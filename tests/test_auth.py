def test_register_and_login_and_me(client):
    resp = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "secret123"},
    )
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

    resp = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "secret123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200, resp.text
    token_data = resp.json()
    assert "access_token" in token_data

    token = token_data["access_token"]

    resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200, resp.text
    me = resp.json()
    assert me["email"] == "test@example.com"
