# internal developer platform API

A small **internal developer platform API** built with FastAPI.  
It manages **projects**, **environments**, and **deployments** — a lightweight, backend-only version of what tools like Heroku / Render / platform teams build.

It includes user authentication, environment lifecycle simulation, and deployment workflows.

---

## 🚀 Features

### 🔐 Authentication
- Register, login, and JWT-based authentication  
- Endpoints:  
  `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/me`

### 📦 Projects
- Projects represent applications owned by authenticated users  
- CRUD endpoints under `/api/v1/projects`

### 🌱 Environments
- Each environment belongs to a project  
- Types: `ephemeral` or `persistent`  
- Lifecycle: `provisioning → running`  
- TTL for ephemeral environments  
- Fake base URL assigned during “provisioning”

### 🚢 Deployments
- Each deployment targets an environment  
- Accepts version identifiers (git SHA, tag, etc)  
- Lifecycle: `pending → running → succeeded`  
- Fake logs URL  
- Simulated async rollout process

### 🧱 Stack
- **FastAPI**
- **SQLAlchemy ORM**
- **JWT (python-jose)**
- **Passlib**
- **Alembic-ready**
- **Poetry** for dependency management

---

## 🛠 Installation & Running Locally

### 1. Install dependencies

```bash
poetry install
```

### 2. Run the app

```bash
poetry run uvicorn app.main:app --reload
```

The API will be available at:

```
http://127.0.0.1:8000
```

### 3. API Docs

- Swagger UI: http://127.0.0.1:8000/docs  
- ReDoc: http://127.0.0.1:8000/redoc

---

## 🧪 Example Usage (with curl)

### 1. Register user

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/auth/register   -H "Content-Type: application/json"   -d '{"email":"test@example.com","password":"secret123"}'
```

### 2. Login and copy token

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/auth/login   -H "Content-Type: application/x-www-form-urlencoded"   -d "username=test@example.com&password=secret123"
```

Extract the `access_token` and export it:

```bash
TOKEN="paste_the_token_here"
```

---

## 🏗 Create a project

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/projects/   -H "Authorization: Bearer $TOKEN"   -H "Content-Type: application/json"   -d '{"name":"payments","description":"payment service"}'
```

Copy `"id"` → set as `PROJECT_ID`.

---

## 🌱 Create an Environment

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/environments/projects/$PROJECT_ID   -H "Authorization: Bearer $TOKEN"   -H "Content-Type: application/json"   -d '{"name":"preview-pr-123","type":"ephemeral","ttl_hours":24}'
```

Copy `"id"` → set as `ENV_ID`.

The environment will transition automatically from:

```
provisioning → running
```

---

## 🚢 Deploy to Environment

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/deployments/environments/$ENV_ID   -H "Authorization: Bearer $TOKEN"   -H "Content-Type: application/json"   -d '{"version":"sha-1234567"}'
```

Copy `"id"` → set as `DEPLOYMENT_ID`.

Check deployment status:

```bash
curl -s   -H "Authorization: Bearer $TOKEN"   http://127.0.0.1:8000/api/v1/deployments/$DEPLOYMENT_ID
```

---

## 📁 Folder structure

```
app/
 ├── api/v1/
 │    ├── auth.py
 │    ├── projects.py
 │    ├── environments.py
 │    └── deployments.py
 ├── core/
 │    ├── database.py
 │    └── security.py
 ├── models/
 │    ├── user.py
 │    ├── project.py
 │    ├── environment.py
 │    └── deployment.py
 ├── schemas/
 └── main.py
```

---

## 🧩 Future Improvements (optional)

- Real provisioning via Kubernetes (helm, kubectl)
- GitOps integration
- Async worker with Celery / RQ
- Real logs streaming
- Proper environment variables & secrets management
- Docker Compose (API + Postgres)
- Pytest test suite

---

## 📜 License

MIT
