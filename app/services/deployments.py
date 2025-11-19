import time
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.deployment import Deployment
from app.models.environment import Environment


def run_deployment(deployment_id, db_factory=SessionLocal):
    db: Session = db_factory()
    try:
        dep: Deployment | None = db.execute(
            select(Deployment).where(Deployment.id == deployment_id)
        ).scalar_one_or_none()

        if not dep:
            return

        env: Environment | None = db.execute(
            select(Environment).where(Environment.id == dep.environment_id)
        ).scalar_one_or_none()

        if not env:
            dep.status = "failed"
            db.add(dep)
            db.commit()
            return

        # Simulate "deploying"
        dep.status = "running"
        db.add(dep)
        db.commit()

        time.sleep(2)

        # In real life: helm upgrade / kubectl apply / etc.
        dep.status = "succeeded"
        dep.logs_url = f"https://logs.envctl.local/deployments/{dep.id}"

        db.add(dep)
        db.commit()

    finally:
        db.close()
