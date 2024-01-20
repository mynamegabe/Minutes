from sqlalchemy import Column, Integer, String, JSON, Table, ForeignKey
from sqlalchemy.orm import relationship

from modules.database import Base

user_notes = Table(
    "user_notes",
    Base.metadata,
    Column("user_id", String(255), ForeignKey("users.id")),
    Column("note_id", String(255), ForeignKey("notes.id")),
)

class User(Base):
    __tablename__ = "users"

    id = Column(String(255), primary_key=True, index=True)
    username = Column(String(255), index=True)
    password = Column(String(255), index=True)
    notes = relationship("Note", secondary=user_notes, back_populates="users")


class Note(Base):
    __tablename__ = "notes"

    id = Column(String(255), primary_key=True, index=True)
    title = Column(String(255), index=True)
    content = Column(JSON, index=True)
    users = relationship("User", secondary=user_notes, back_populates="notes")