import logging
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password
from app.core.config import settings

logger = logging.getLogger("envctl")

def seed_db(db: Session):
    if not settings.is_development:
        return

    admin_email = "admin@envctl.dev"
    admin_password = "adminpassword"

    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if not existing_admin:
        logger.info(f"Seeding admin user: {admin_email}")
        admin_user = User(
            email=admin_email,
            password_hash=hash_password(admin_password),
            is_verified=True
        )
        db.add(admin_user)
        db.commit()
    else:
        logger.info(f"Admin user {admin_email} already exists.")
