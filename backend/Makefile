.PHONY: install start test lint format

install:
	poetry install

start:
	poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	poetry run pytest

lint:
	poetry run ruff check .
	poetry run black --check .

format:
	poetry run ruff check --fix .
	poetry run black .
