# tests/conftest.py
import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.services import provisioning, deployments

# Use a separate SQLite DB for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_envctl.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override the app's DB dependency
app.dependency_overrides[get_db] = override_get_db

# Make background services use the SAME SessionLocal as the API in tests
provisioning.SessionLocal = TestingSessionLocal
deployments.SessionLocal = TestingSessionLocal


@pytest.fixture(autouse=True)
def reset_db():
    """Drop & recreate all tables before each test."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    return TestClient(app)
