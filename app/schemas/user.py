from pydantic import BaseModel, EmailStr, Field

from uuid import UUID
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
