import time
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime, timedelta, timezone

from app.models.environment import Environment


def provision_environment(env_id, db_factory):
    # db_factory will be SessionLocal, to avoid keeping a session across threads
    db: Session = db_factory()
    try:
        env: Environment | None = db.execute(
            select(Environment).where(Environment.id == env_id)
        ).scalar_one_or_none()

        if not env:
            return

        # simulate work
        time.sleep(2)

        # fake URL (in real life, from ingress / K8s / etc)
        env.status = "running"
        env.base_url = f"https://{env.id}.envctl.local"

        # optionally set expiry for ephemeral envs
        if env.type == "ephemeral" and env.expires_at is None:
            env.expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

        db.add(env)
        db.commit()
    finally:
        db.close()
