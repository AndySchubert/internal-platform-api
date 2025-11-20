from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.environment import Environment


def provision_environment(env_id, db_factory=SessionLocal):
    # normalize env_id into a real UUID, tolerate string input
    if isinstance(env_id, str):
        try:
            env_id = UUID(env_id)
        except ValueError:
            # invalid UUID string → nothing to do
            return

    db: Session = db_factory()
    try:
        env: Environment | None = db.execute(
            select(Environment).where(Environment.id == env_id)
        ).scalar_one_or_none()

        if not env:
            return

        # ✅ actually change state here
        env.status = "running"
        env.base_url = f"https://{env.id}.envctl.local"

        # optional TTL handling, if you have ttl_hours in the model
        if getattr(env, "ttl_hours", None) and env.type == "ephemeral":
            env.expires_at = datetime.utcnow() + timedelta(hours=env.ttl_hours)

        db.add(env)
        db.commit()
        db.refresh(env)

    finally:
        db.close()
