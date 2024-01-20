from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    password: str

class UserSchema(UserBase):
    id: str

class UserCreate(UserBase):
    id: str
    pass

class UserLogin(BaseModel):
    username: str
    password: str
