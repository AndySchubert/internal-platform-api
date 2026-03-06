from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional

from app.models.session import Session as SessionModel


def get_session_by_hash(db: Session, session_id_hash: str) -> Optional[SessionModel]:
    return db.execute(select(SessionModel).where(SessionModel.session_id_hash == session_id_hash)).scalar_one_or_none()


def create_session(db: Session, session: SessionModel) -> SessionModel:
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def update_session(db: Session, session: SessionModel) -> SessionModel:
    db.commit()
    db.refresh(session)
    return session
