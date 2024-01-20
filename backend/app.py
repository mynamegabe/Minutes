from fastapi import Depends, FastAPI, Request
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import hashlib
import uuid

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
        content="This is a sample note. You can edit or delete this note.",
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
    "http://localhost:5173",
    # "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
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
async def get_note_by_id(request: Request, note_id: int, username: str = Depends(authorize_user)):
    db = Session()
    note = notesController.get_note_by_id_and_username(db, note_id, username)
    db.close()
    return {
        "status": "success",
        "data": note,  
    }


@app.post("/api/notes")
async def create_notes(request: Request, note: noteSchema.NoteBase, username: str = Depends(authorize_user)):
    db = Session()
    db_note = noteSchema.NoteSchema(
        id=str(uuid.uuid4()),
        title=note.title,
        content=note.content,
    )
    db_note = notesController.create_note(db, db_note)
    db_user = userController.get_user_by_username(db, username)
    db_user.notes.append(db_note)
    db.commit()
    db.close()
    return {
        "status": "success",
        "data": db_note,
    }


@app.put("/api/notes/{note_id}")
async def update_notes(request: Request, note_id: int, note: noteSchema.NoteBase, username: str = Depends(authorize_user)):
    db = Session()
    user = userController.get_user_by_username(db, username)
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