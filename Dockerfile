FROM python:3.12-slim

ENV POETRY_VERSION=2.2.1 \
    POETRY_HOME=/opt/poetry \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip install "poetry==$POETRY_VERSION"

# Create non-root user
RUN useradd -m appuser

WORKDIR /app

# Copy deps first for caching
COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root --no-ansi

# Copy app code
COPY app ./app

# Switch to non-root
USER appuser

# Expose port and add healthcheck (adjust path if needed)
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]