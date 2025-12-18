from fastapi import FastAPI
from sqlalchemy import text
from sqlalchemy.exc import OperationalError  # Added for retry handling
import time  # Added for sleep in retries

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
    max_retries = 10  
    retry_delay = 5 

    for attempt in range(max_retries):
        try:
            # Test the connection first
            with engine.connect() as connection:
                connection.execute(text("SELECT 1")) 
            Base.metadata.create_all(bind=engine)
            print("Database connected and tables created successfully.")
            return  # Success, exit the function
        except OperationalError as e:
            if attempt < max_retries - 1:
                print(f"DB connection failed (attempt {attempt + 1}/{max_retries}): {e}. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                raise  # After max retries, let it fail

@app.get("/health")
def health():
    # optional: basic DB check
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}