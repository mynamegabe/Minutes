from pydantic import BaseModel
from typing import Optional

class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None

class NoteSchema(NoteBase):
    id: str

class NoteCreate(NoteBase):
    id: str
    pass

class NoteAnswers(BaseModel):
    id: str
    answers: str