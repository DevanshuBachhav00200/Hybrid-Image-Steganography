from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hybrid Image Steganography Backend Running"}


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_api_v1_status_endpoint():
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    assert response.json() == {"backend": "online", "version": "1.0.0"}
