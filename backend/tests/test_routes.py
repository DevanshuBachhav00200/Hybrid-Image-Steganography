import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Hybrid Image Steganography" in data["message"]


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_status_endpoint():
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert data["backend"] == "online"


def test_version_endpoint():
    response = client.get("/api/v1/version")
    assert response.status_code == 200
    data = response.json()
    assert data["version"] == "1.0.0"


def test_encode_endpoint_placeholder_success():
    payload = {
        "message": "Top Secret Message",
        "password": "StrongPassword123!",
        "algorithm": "LSB",
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    }
    response = client.post("/api/v1/encode", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "READY"


def test_decode_endpoint_placeholder_success():
    payload = {
        "message": "Top Secret Message",
        "password": "StrongPassword123!",
        "algorithm": "LSB",
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    }
    response = client.post("/api/v1/decode", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "NOT_IMPLEMENTED"


def test_compare_endpoint_placeholder_success():
    payload = {
        "message": "Top Secret Message",
        "password": "StrongPassword123!",
        "algorithm": "LSB",
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    }
    response = client.post("/api/v1/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "NOT_IMPLEMENTED"


def test_metrics_endpoint_placeholder_success():
    response = client.get("/api/v1/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "NOT_IMPLEMENTED"
