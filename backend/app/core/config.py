from pydantic import BaseModel
import os


class Settings(BaseModel):
    database_url: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./envctl.db",  # fallback for local non-docker dev
    )
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
    jwt_algorithm: str = "HS256"
    jwt_access_token_expires_minutes: int = 60
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:4200")

    @property
    def is_development(self) -> bool:
        return self.database_url.startswith("sqlite")


settings = Settings()
