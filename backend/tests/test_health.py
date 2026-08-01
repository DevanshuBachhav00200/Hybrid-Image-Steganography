import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure root backend dir is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "Coming Soon"}

def test_version_check():
    response = client.get("/api/version")
    assert response.status_code == 200
    assert response.json() == {"status": "Coming Soon"}

def test_algorithms_check():
    response = client.get("/api/algorithms")
    assert response.status_code == 200
    assert response.json() == {"status": "Coming Soon"}
