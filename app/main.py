from fastapi import FastAPI
from sqlalchemy import text

from app.core.database import Base, engine

from app.api.v1.auth import router as auth_router
from app.api.v1.projects import router as projects_router
from app.api.v1.environments import router as environments_router
from app.api.v1.deployments import router as deployments_router

app = FastAPI()

app.include_router(auth_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")
app.include_router(environments_router, prefix="/api/v1")
app.include_router(deployments_router, prefix="/api/v1")

@app.on_event("startup")
def on_startup():
    # create tables if they don't exist yet (simple for now; later use Alembic)
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    # optional: basic DB check
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}


app.include_router(auth_router, prefix="/api/v1")
