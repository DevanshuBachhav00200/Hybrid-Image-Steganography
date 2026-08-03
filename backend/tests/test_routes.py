from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# System Route Tests
def test_system_version_endpoint():
    response = client.get("/api/v1/version")
    assert response.status_code == 200
    data = response.json()
    assert data["version"] == "1.0.0"
    assert data["api_prefix"] == "/api/v1"


def test_system_docs_info_endpoint():
    response = client.get("/api/v1/docs-info")
    assert response.status_code == 200
    data = response.json()
    assert data["swagger_url"] == "/docs"
    assert data["redoc_url"] == "/redoc"


# Encode Endpoint Tests
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
    assert data["status"] == "NOT_IMPLEMENTED"
    assert data["message"] == "Encode endpoint ready."


def test_encode_endpoint_validation_short_password():
    payload = {
        "message": "Top Secret Message",
        "password": "short",  # Password < 8 chars
        "algorithm": "LSB",
        "image": "sample_image_data",
    }
    response = client.post("/api/v1/encode", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == 422
    assert data["error"]["type"] == "RequestValidationError"


def test_encode_endpoint_validation_invalid_algorithm():
    payload = {
        "message": "Top Secret Message",
        "password": "StrongPassword123!",
        "algorithm": "INVALID_ALG",  # Not LSB, DCT, or DWT
        "image": "sample_image_data",
    }
    response = client.post("/api/v1/encode", json=payload)
    assert response.status_code == 422


# Decode Endpoint Tests
def test_decode_endpoint_placeholder_success():
    payload = {
        "password": "StrongPassword123!",
        "algorithm": "DCT",
        "image": "stego_image_data_base64",
    }
    response = client.post("/api/v1/decode", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "NOT_IMPLEMENTED"
    assert data["message"] == "Decode endpoint ready."


# Compare Endpoint Tests
def test_compare_endpoint_placeholder_success():
    payload = {
        "message": "Benchmark Payload",
        "password": "StrongPassword123!",
        "image": "test_cover_image_data",
    }
    response = client.post("/api/v1/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "NOT_IMPLEMENTED"
    assert data["message"] == "Compare endpoint ready."


# Metrics Endpoints Tests
def test_metrics_get_endpoint():
    response = client.get("/api/v1/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "NOT_IMPLEMENTED"
    assert data["message"] == "Metrics endpoint ready."


def test_metrics_history_endpoint():
    response = client.get("/api/v1/metrics/history")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "NOT_IMPLEMENTED"
    assert data["message"] == "Metrics history endpoint ready."


def test_metrics_system_endpoint():
    response = client.get("/api/v1/metrics/system")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "NOT_IMPLEMENTED"
    assert data["message"] == "System metrics endpoint ready."


# Custom Error Handler Tests
def test_not_found_404_error():
    response = client.get("/api/v1/non-existent-path")
    assert response.status_code == 404
    data = response.json()
    assert data["error"]["code"] == 404
    assert data["error"]["type"] == "HTTPException"
