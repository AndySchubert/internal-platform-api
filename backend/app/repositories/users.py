from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional

from app.models.user import User


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.execute(select(User).where(User.email == email)).scalar_one_or_none()


def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    return db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()


def create_user(db: Session, user: User) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_verification_token_hash(db: Session, token_hash: str) -> Optional[User]:
    return db.execute(
        select(User).where(User.verification_token_hash == token_hash)
    ).scalar_one_or_none()


def update_user(db: Session, user: User) -> User:
    db.commit()
    db.refresh(user)
    return user
