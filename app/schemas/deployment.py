from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class DeploymentCreate(BaseModel):
    version: str


class DeploymentRead(BaseModel):
    id: UUID
    environment_id: UUID
    version: str
    status: str
    logs_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
