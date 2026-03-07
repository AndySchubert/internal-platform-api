import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


def send_verification_email(email: str, token: str) -> None:
    """
    Mock sending a verification email.
    In a real app, this would use a service like SendGrid or AWS SES.
    """
    logger.info("\n==========================================")
    logger.info(f"MOCK EMAIL: Sending verification link to {email}")
    logger.info(
        f"Click here to verify: {settings.frontend_url}/verify-email?token={token}"
    )
    logger.info("==========================================\n")


def send_password_reset_email(email: str, token: str) -> None:
    """
    Mock sending a password reset email.
    """
    logger.info("\n==========================================")
    logger.info(f"MOCK EMAIL: Sending password reset link to {email}")
    logger.info(
        f"Click here to reset: {settings.frontend_url}/reset-password?token={token}"
    )
    logger.info("==========================================\n")
