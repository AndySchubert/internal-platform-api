# app/models/user.py
from sqlalchemy import Column, String, DateTime, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    
    # OWASP Security Tracking Fields
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token_hash = Column(String(255), nullable=True)
    verification_token_expires_at = Column(DateTime(timezone=True), nullable=True)
    
    password_reset_token_hash = Column(String(255), nullable=True)
    password_reset_token_expires_at = Column(DateTime(timezone=True), nullable=True)
    
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    last_failed_login_at = Column(DateTime(timezone=True), nullable=True)
    lockout_until = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
