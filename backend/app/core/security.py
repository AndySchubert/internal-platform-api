from datetime import datetime, timedelta, timezone
from typing import Optional
import secrets
import hashlib

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
    if expires_minutes is None:
        expires_minutes = settings.jwt_access_token_expires_minutes

    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode = {"sub": subject, "exp": expire}
    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )
    return encoded_jwt


def generate_random_token(length: int = 32) -> str:
    """Generate a high-entropy random token for verifications and resets."""
    return secrets.token_urlsafe(length)


def hash_token(token: str) -> str:
    """Consistently hash a generic token before storing in DB (to prevent DB leak abuse)."""
    return hashlib.sha256(token.encode()).hexdigest()


def generate_session_id() -> str:
    """Generate a highly secure, meaningless session identifier."""
    return secrets.token_urlsafe(64)
