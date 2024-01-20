from fastapi import Depends, FastAPI, Request
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import hashlib
import uuid
import json

from modules.database import get_db, Base, engine, Session
from modules.authorization import authorize_user
import modules.gemini as gemini
import modules.parser as parser
from schemas import users as userSchema
from schemas import ai as aiSchema
from schemas import notes as noteSchema
from controllers import users as userController
from controllers import notes as notesController
import config


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    admin = userSchema.UserCreate(
        id=str(uuid.uuid4()),
        username=config.ADMIN_USERNAME, 
        password=hashlib.sha256(config.ADMIN_PASSWORD.encode()).hexdigest()
    )
    db = Session()
    db_user = userController.get_user_by_username(db, admin.username)
    if not db_user:
        db_user = userController.create_user(db, admin)

    note = noteSchema.NoteSchema(
        id="1",
        title="Welcome to Gemini!",
        content='''[{
            "type": "heading",
            "attrs": {
                "level": 1
            },
            "content": [
                {
                    "type": "text",
                    "text": "This is a sample note. You can edit or delete this note."
                }
            ]
        }]'''
    )
    db_note = notesController.get_note_by_id(db, 1)
    if not db_note:
        note = notesController.create_note(db, note)
        db_user.notes.append(note)
        db.commit()
    db.close()
    yield

middleware = [Middleware(SessionMiddleware, secret_key=config.SECRET_KEY)]
app = FastAPI(middleware=middleware, lifespan=lifespan)

origins = [
    "http://localhost:3000",
    # "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
async def index():
    return {
        "status": "up",
    }

@app.post("/register")
async def register(user: userSchema.UserBase, db: Session = Depends(get_db)):
    db_user = userController.get_user_by_username(db, username=user.username)
    if db_user:
        return {
            "status": "error",
            "msg": "User already exists",
        }
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    new_user = userSchema.UserCreate(
        id=str(uuid.uuid4()),
        username=user.username, 
        password=hashed,
    )
    userController.create_user(db=db, user=new_user)
    note = noteSchema.NoteSchema(
        id=str(uuid.uuid4()),
        title="Welcome to Gemini!",
        content='''[{
            "type": "heading",
            "attrs": {
                "level": 1
            },
            "content": [
                {
                    "type": "text",
                    "text": "This is a sample note. You can edit or delete this note."
                }
            ]
        }]'''
    )
    db_note = notesController.create_note(db, note)
    db_user = userController.get_user_by_username(db, user.username)
    db_user.notes.append(db_note)
    return {
        "status": "success",
        "msg": "User created successfully!",
    }


@app.post("/login")
async def login(request: Request, user: userSchema.UserBase, db: Session = Depends(get_db)):
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = userController.get_user_by_username(db, username=user.username)
    if not db_user or db_user.password != hashed:
        return {
            "status": "error",
            "msg": "Incorrect username or password",
        }
    request.session["user"] = db_user.username
    return {
        "status": "success",
        "msg": "Logged in successfully!",
    }


@app.post("/api/query")
async def query(request: Request, query: aiSchema.QueryBase, username: str = Depends(authorize_user)):
    response = gemini.queryGemini(query)
    return {
        "status": "success",
        "msg": response,
    }


@app.post("/api/generate")
async def generate(request: Request, query: aiSchema.GenerateModel, username: str = Depends(authorize_user)):
    response = ""
    status = "success"
    match query.type:
        case "questions":
            response = gemini.generateQuestions(query.query)
            data = parser.parseQuestions(response)
        case "summary":
            response = gemini.generateSummary(query.query)
            data = response
        case "answer":
            # haystack to get relevant content
            response = gemini.answerQuestion(query.query, query.question)
            data = response
        case "mcq":
            response = gemini.generateMCQ(query.query)
            data = parser.parseMCQ(response)
        case _:
            status = "error"
            data = "Invalid type"
    return {
        "status": status,
        "data": data,
    }


@app.post("/api/verify")
async def verify(request: Request, query: aiSchema.VerifyModel, username: str = Depends(authorize_user)):
    response = gemini.verifyAnswer(query.question, query.answer, query.expected)
    return {
        "status": "success",
        "msg": response,
    }

@app.get("/api/users")
async def get_users(request: Request, username: str = Depends(authorize_user)):
    db = Session()
    users = userController.get_users(db)
    print(users)
    db.close()
    return {
        "status": "success",
        "data": users,
    }


@app.get("/api/notes")
async def get_notes(request: Request, username: str = Depends(authorize_user)):
    db = Session()
    notes = notesController.get_notes_by_username(db, username)
    db.close()
    return {
        "status": "success",
        "data": notes,
    }


@app.get("/api/notes/{note_id}")
async def get_note_by_id(request: Request, note_id: str, username: str = Depends(authorize_user)):
    db = Session()
    note = notesController.get_note_by_id_and_username(db, note_id, username)
    db.close()
    note.content = json.loads(note.content)
    return {
        "status": "success",
        "data": note,  
    }


@app.post("/api/notes")
async def create_notes(request: Request, note: noteSchema.NoteBase, username: str = Depends(authorize_user)):
    note_id = str(uuid.uuid4())
    db = Session()
    db_note = noteSchema.NoteSchema(
        id=note_id,
        title=note.title,
        content=note.content,
    )
    print(db_note)
    db_note = notesController.create_note(db, db_note)
    db_user = userController.get_user_by_username(db, username)
    db_user.notes.append(db_note)
    db.commit()
    db.close()
    return {
        "status": "success",
        "data": {
            "id": note_id,
            'title': note.title,
            'content': note.content,
        },
    }


@app.put("/api/notes/{note_id}")
async def update_notes(request: Request, note_id: str, note: noteSchema.NoteBase, username: str = Depends(authorize_user)):
    db = Session()
    db_note = notesController.get_note_by_id_and_username(db, note_id, username)
    if not db_note:
        return {
            "status": "error",
            "msg": "Note not found",
        }
    db_note = notesController.update_note(db, note_id, note)
    db.close()
    return {
        "status": "success",
        # "data": db_note,
    }

@app.get("/api/notes/{note_id}/questions")
async def generate_questions(request: Request, note_id: str, username: str = Depends(authorize_user)):
    db = Session()
    db_note = notesController.get_note_by_id_and_username(db, note_id, username)
    if not db_note:
        return {
            "status": "error",
            "msg": "Note not found",
        }
    content = db_note.content
    questions = parser.extractQuestions(content)
    db.close()
    return {
        "status": "success",
        "data": questions,
    }


@app.delete("/api/notes/{note_id}")
async def delete_notes(request: Request, note_id: str, username: str = Depends(authorize_user)):
    db = Session()
    db_note = notesController.get_note_by_id_and_username(db, note_id, username)
    if not db_note:
        return {
            "status": "error",
            "msg": "Note not found",
        }
    # db_note = notesController.delete_note_by_id(db, note_id)
    db_user = userController.get_user_by_username(db, username)
    db_user.notes.remove(db_note)
    db.commit()
    db.close()
    return {
        "status": "success",
        # "data": db_note,
    }


@app.post("/api/notes/{note_id}/questions")
async def grade_questions(request: Request, note_id: str, answers: noteSchema.NoteAnswers, username: str = Depends(authorize_user)):
    db = Session()
    db_note = notesController.get_note_by_id_and_username(db, note_id, username)
    if not db_note:
        return {
            "status": "error",
            "msg": "Note not found",
        }
    content = db_note.content
    questions = parser.extractQuestions(content)
    total = len(questions)
    grade = 0
    for i in range(total):
        if questions[i] == answers[i]:
            grade += 1
    data = {
        "total": total,
        "correct": grade,
        "incorrect": total - grade,
    }
    db.close()
    return {
        "status": "success",
        "data": data,
    }