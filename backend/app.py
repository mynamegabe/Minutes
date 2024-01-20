from fastapi import Depends, FastAPI, Request
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import hashlib

from modules.database import get_db, Base, engine, Session
from modules.authorization import authorize_user
import modules.gemini as gemini
from modules.parser import parseQuestions
from schemas import users as userSchema
from schemas import ai as aiSchema
from controllers import users as userController
import config


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    admin = userSchema.UserCreate(
        username=config.ADMIN_USERNAME, 
        password=config.ADMIN_PASSWORD
    )
    db = Session()
    db_user = userController.get_user_by_username(db, admin.username)
    if not db_user:
        userController.create_user(db, admin)
    db.close()
    yield

middleware = [Middleware(SessionMiddleware, secret_key=config.SECRET_KEY)]
app = FastAPI(middleware=middleware, lifespan=lifespan)

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    match query.type:
        case "questions":
            response = gemini.generateQuestions(query.query)
        case _:
            response = gemini.generateGemini(query.query)
    questions = parseQuestions(response)            
    return {
        "status": "success",
        "data": questions,
    }