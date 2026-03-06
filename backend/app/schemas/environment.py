from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any


class EnvironmentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    type: str = Field(pattern="^(ephemeral|persistent)$")
    config: Optional[Dict[str, Any]] = None
    ttl_hours: Optional[int] = None  # only for ephemeral envs


class EnvironmentRead(BaseModel):
    id: UUID
    project_id: UUID
    name: str
    type: str
    status: str
    base_url: Optional[str] = None
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True
