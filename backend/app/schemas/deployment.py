from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
