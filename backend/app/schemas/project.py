from pydantic import BaseModel, AnyHttpUrl
from uuid import UUID
from datetime import datetime
from typing import Optional


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    repo_url: Optional[str] = None


class ProjectRead(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    repo_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
