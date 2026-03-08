import os
import httpx
import sys
import time

def run_smoke_test():
    frontend_url = os.getenv("FRONTEND_URL")
    backend_url = os.getenv("BACKEND_URL")

    if not frontend_url or not backend_url:
        print("Error: FRONTEND_URL and BACKEND_URL must be set.")
        sys.exit(1)

    print(f"🚀 Starting Smoke Test...")
    print(f"🌍 Frontend: {frontend_url}")
    print(f"⚙️  Backend:  {backend_url}")

    errors = []

    # 1. Check Frontend Accessibility
    try:
        print(f"\n[1/3] Testing Frontend accessibility...")
        response = httpx.get(frontend_url, timeout=10.0)
        if response.status_code == 200:
            print("✅ Frontend is up!")
        else:
            errors.append(f"Frontend returned status {response.status_code}")
    except Exception as e:
        errors.append(f"Frontend connection failed: {e}")

    # 2. Check Backend Health
    try:
        print(f"\n[2/3] Testing Backend health endpoint...")
        response = httpx.get(f"{backend_url}/health", timeout=10.0)
        if response.status_code == 200 and response.json().get("status") == "ok":
            print("✅ Backend health check passed!")
        else:
            errors.append(f"Backend health check failed: {response.status_code} - {response.text}")
    except Exception as e:
        errors.append(f"Backend health connection failed: {e}")

    # 3. Check Proxy (via Frontend URL)
    try:
        print(f"\n[3/4] Testing API proxying (Projects list via Frontend)...")
        # We hit the FRONTEND URL to ensure Nginx proxying is working
        response = httpx.get(f"{frontend_url}/api/v1/projects", timeout=10.0)
        if response.status_code == 401:
            print("✅ API proxy is working (received expected 401 Unauthorized via Frontend)!")
        else:
            errors.append(f"API proxy test failed: Received {response.status_code} instead of 401")
    except Exception as e:
        errors.append(f"API proxy connection failed: {e}")

    # 4. Check Registration Flow
    try:
        print(f"\n[4/4] Testing User Registration flow...")
        unique_email = f"smoke-test-{int(time.time())}@example.com"
        reg_data = {"email": unique_email, "password": "smoketestpassword123"}
        
        response = httpx.post(f"{frontend_url}/api/v1/auth/register", json=reg_data, timeout=10.0)
        
        # We expect 202 Accepted for registration
        if response.status_code == 202:
            print(f"✅ User registration successful for {unique_email}!")
        else:
            errors.append(f"Registration failed: Received {response.status_code} - {response.text}")
    except Exception as e:
        errors.append(f"Registration flow failed: {e}")

    if errors:
        print("\n❌ Smoke Test FAILED with the following errors:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)
    else:
        print("\n✨ Smoke Test PASSED successfully!")
        sys.exit(0)

if __name__ == "__main__":
    run_smoke_test()
