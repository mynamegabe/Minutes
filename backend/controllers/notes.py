from sqlalchemy.orm import Session
from sqlalchemy.sql import text

# from . import models, schemas
from models import Note as noteModel
from models import user_notes
from schemas import notes as noteSchema
from controllers import users as userController


def get_notes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(noteModel).offset(skip).limit(limit).all()


def get_note_by_id(db: Session, note_id: int):
    return db.query(noteModel).filter(noteModel.id == note_id).first()


def get_note_by_id_and_username(db: Session, note_id: int, username: str):
    user = userController.get_user_by_username(db, username)
    return db.query(noteModel).filter(noteModel.id == note_id).filter(noteModel.users.any(id=user.id)).first()


def get_notes_by_username(db: Session, username: str):
    user = userController.get_user_by_username(db, username)
    notes = db.query(noteModel.id, noteModel.title).filter(noteModel.users.any(id=user.id)).all()
    notes = [dict(zip(['id', 'title'], note)) for note in notes]
    return notes

def create_note(db: Session, note: noteSchema.NoteCreate):
    db_note = noteModel(
        id=note.id,
        title=note.title,
        content=note.content,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


def update_note(db: Session, note_id: int, note: noteSchema.NoteBase):
    db_note = db.query(noteModel).filter(noteModel.id == note_id).first()
    db_note.title = note.title
    db_note.content = note.content
    db.commit()
    db.refresh(db_note)
    return db_note


def delete_note(db: Session, note_id: int):
    db_note = db.query(noteModel).filter(noteModel.id == note_id).first()
    db.delete(db_note)
    db.commit()
    return db_note