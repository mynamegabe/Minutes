from sqlalchemy.orm import Session
from sqlalchemy.sql import text

# from . import models, schemas
from models import User as userModel
from schemas import users as userSchema


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(userModel).offset(skip).limit(limit).all()


def get_user(db: Session, user_id: int):
    return db.query(userModel).filter(userModel.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(userModel).filter(userModel.username == username).first()

def create_user(db: Session, user: userSchema.UserCreate):
    db_user = userModel(
        username=user.username, 
        password=user.password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return user


def update_user(db: Session, user_id: int, user: userSchema.UserBase):
    db_user = db.query(userModel).filter(userModel.id == user_id).first()
    db_user.username = user.username
    db_user.password = user.password
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_item(db: Session, user_id: int):
    db_item = db.query(userModel).filter(userModel.id == user_id).first()
    db.delete(db_item)
    db.commit()
    return db_item