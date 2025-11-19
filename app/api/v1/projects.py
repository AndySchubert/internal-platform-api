from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectRead
from app.models.user import User

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=list[ProjectRead])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Project)
        .filter(Project.owner_id == current_user.id)
        .order_by(Project.created_at.desc())
        .all()
    )


@router.post("/", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = Project(
        name=project_in.name,
        description=project_in.description,
        repo_url=str(project_in.repo_url) if project_in.repo_url else None,
        owner_id=current_user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    db.delete(project)
    db.commit()
