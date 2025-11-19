from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.database import get_db, SessionLocal
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.environment import Environment
from app.models.deployment import Deployment
from app.schemas.deployment import DeploymentCreate, DeploymentRead
from app.services.deployments import run_deployment

router = APIRouter(prefix="/deployments", tags=["deployments"])


def _get_env_owned_by_user(
    db: Session,
    env_id: UUID,
    user_id: UUID,
) -> Environment:
    env: Environment | None = db.execute(
        select(Environment).where(Environment.id == env_id)
    ).scalar_one_or_none()
    if not env:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Environment not found")

    project: Project | None = db.execute(
        select(Project).where(Project.id == env.project_id)
    ).scalar_one_or_none()

    if not project or project.owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Environment not found")

    return env


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
    env = _get_env_owned_by_user(db, env_id, current_user.id)

    if env.status != "running":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Environment is not ready (status={env.status})",
        )

    dep = Deployment(
        environment_id=env.id,
        version=dep_in.version,
        status="pending",
    )

    db.add(dep)
    db.commit()
    db.refresh(dep)

    background_tasks.add_task(run_deployment, dep.id, SessionLocal)

    return dep


@router.get("/environments/{env_id}", response_model=list[DeploymentRead])
def list_deployments_for_environment(
    env_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_env_owned_by_user(db, env_id, current_user.id)

    deps = db.execute(
        select(Deployment).where(Deployment.environment_id == env_id)
    ).scalars().all()

    return deps


@router.get("/{deployment_id}", response_model=DeploymentRead)
def get_deployment(
    deployment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    dep: Deployment | None = db.execute(
        select(Deployment).where(Deployment.id == deployment_id)
    ).scalar_one_or_none()

    if not dep:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deployment not found")

    # verify env → project → owner
    env: Environment | None = db.execute(
        select(Environment).where(Environment.id == dep.environment_id)
    ).scalar_one_or_none()
    if not env:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deployment not found")

    project: Project | None = db.execute(
        select(Project).where(Project.id == env.project_id)
    ).scalar_one_or_none()
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deployment not found")

    return dep
