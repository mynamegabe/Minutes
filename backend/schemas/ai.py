from pydantic import BaseModel

class QueryBase(BaseModel):
    query: str

class GenerateModel(QueryBase):
    type: str

