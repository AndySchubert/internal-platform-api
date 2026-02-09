from uuid import UUID

from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.schemas.deployment import DeploymentCreate, DeploymentRead
from app.services import deployments as deployments_service

router = APIRouter(prefix="/deployments", tags=["deployments"])


@router.post(
    "/environments/{env_id}",
    response_model=DeploymentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_deployment_for_environment(
    env_id: UUID,
    dep_in: DeploymentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deployments_service.create_deployment(
        db, background_tasks, env_id, dep_in, current_user.id
    )


@router.get("/environments/{env_id}", response_model=list[DeploymentRead])
def list_deployments_for_environment(
    env_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deployments_service.list_deployments(db, env_id, current_user.id)


@router.get("/{deployment_id}", response_model=DeploymentRead)
def get_deployment(
    deployment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return deployments_service.get_deployment_by_id(db, deployment_id, current_user.id)
