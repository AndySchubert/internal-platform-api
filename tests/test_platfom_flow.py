# tests/test_platfom_flow.py
import time

from fastapi.testclient import TestClient


def auth_token(client: TestClient) -> str:
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={"email": "user@example.com", "password": "secret123"},
    )
    # Login
    resp = client.post(
        "/api/v1/auth/login",
        data={"username": "user@example.com", "password": "secret123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]


def test_project_env_deploy_flow(client: TestClient):
    token = auth_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # create project
    resp = client.post(
        "/api/v1/projects/",
        json={"name": "payments", "description": "payment service"},
        headers=headers,
    )
    assert resp.status_code == 201, resp.text
    project = resp.json()
    project_id = project["id"]

    # create environment
    resp = client.post(
        f"/api/v1/environments/projects/{project_id}",
        json={
            "name": "preview-pr-123",
            "type": "ephemeral",
            "ttl_hours": 24,
            "config": {"ENV": "dev", "DEBUG": True},
        },
        headers=headers,
    )
    assert resp.status_code == 201, resp.text
    env = resp.json()
    env_id = env["id"]

    # wait until env is running (background task should update it)
    for _ in range(30):  # ~3 seconds max with 0.1s sleep
        resp = client.get(f"/api/v1/environments/{env_id}", headers=headers)
        assert resp.status_code == 200, resp.text
        status = resp.json()["status"]
        if status == "running":
            break
        time.sleep(0.1)
    else:
        raise AssertionError("Environment did not reach running state")

    # create deployment
    resp = client.post(
        f"/api/v1/deployments/environments/{env_id}",
        json={"version": "sha-1234567"},
        headers=headers,
    )
    assert resp.status_code == 201, resp.text
    dep = resp.json()
    assert dep["version"] == "sha-1234567"
