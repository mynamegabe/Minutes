from pydantic import BaseModel
from typing import Optional

class QueryBase(BaseModel):
    query: str

class GenerateModel(QueryBase):
    type: str
    question: Optional[str] = None
    
class VerifyModel(BaseModel):
    question: str
    answer: str