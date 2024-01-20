



from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    password: str

class UserSchema(UserBase):
    id: int
    secret: str

class UserCreate(UserBase):
    pass

class UserLogin(BaseModel):
    username: str
    password: str
