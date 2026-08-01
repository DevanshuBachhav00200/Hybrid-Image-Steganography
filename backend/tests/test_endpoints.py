import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app

client = TestClient(app)

def test_encode_endpoint():
    response = client.post("/api/encode")
    assert response.status_code == 200
    assert response.json() == {"status": "Coming Soon"}

def test_decode_endpoint():
    response = client.post("/api/decode")
    assert response.status_code == 200
    assert response.json() == {"status": "Coming Soon"}

def test_compare_endpoint():
    response = client.post("/api/compare")
    assert response.status_code == 200
    assert response.json() == {"status": "Coming Soon"}

def test_metrics_endpoint():
    response = client.post("/api/metrics")
    assert response.status_code == 200
    assert response.json() == {"status": "Coming Soon"}
