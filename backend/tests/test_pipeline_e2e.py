import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.processing.pipeline.encoding_pipeline import EncodingPipeline
from app.processing.pipeline.diagnostics import check_pipeline_health
from app.schemas.requests import EncodeRequest
from app.core.exceptions import PipelineStageException, ValidationException


@pytest.fixture
def test_client():
    return TestClient(app)


@pytest.fixture
def valid_encode_payload():
    return {
        "message": "SECRET HYBRID STEGANOGRAPHY MESSAGE 2026",
        "password": "StrongPassword123!",
        "algorithm": "LSB",
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    }


# 1. Full End-to-End Pipeline Execution (Direct Class)
def test_pipeline_direct_execution(valid_encode_payload):
    pipeline = EncodingPipeline()
    request = EncodeRequest(**valid_encode_payload)

    response = pipeline.execute(request)
    assert response.status == "READY"
    assert response.message == "Payload prepared successfully and ready for steganographic embedding."
    assert response.metrics is not None
    assert response.metrics["status"] == "PREPARED"
    assert "execution_time_ms" in response.metrics
    assert len(response.metrics["stage_history"]) == 8


# 2. End-to-End API Route Execution (FastAPI Endpoint)
def test_encode_endpoint_e2e(test_client, valid_encode_payload):
    response = test_client.post("/api/v1/encode", json=valid_encode_payload)
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "READY"
    assert data["message"] == "Payload prepared successfully and ready for steganographic embedding."
    assert data["metrics"]["status"] == "PREPARED"


# 3. Large Message Payload
def test_large_message_pipeline_execution():
    pipeline = EncodingPipeline()
    large_msg = ("PREPROCESSING PIPELINE LARGE TEST MESSAGE " * 50).strip()
    request = EncodeRequest(
        message=large_msg,
        password="StrongPassword123!",
        algorithm="LSB",
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    )

    response = pipeline.execute(request)
    assert response.status == "READY"


# 4. Small Message Payload
def test_small_message_pipeline_execution():
    pipeline = EncodingPipeline()
    request = EncodeRequest(
        message="A",
        password="StrongPassword123!",
        algorithm="LSB",
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    )

    response = pipeline.execute(request)
    assert response.status == "READY"


# 5. Special Punctuation Message
def test_punctuation_message_pipeline_execution():
    pipeline = EncodingPipeline()
    request = EncodeRequest(
        message="TEST! @ $ & ( ) + - = / _ . , : ; ' \" ?",
        password="StrongPassword123!",
        algorithm="LSB",
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    )

    response = pipeline.execute(request)
    assert response.status == "READY"


# 6. Weak Password Validation Failure (Whitespace-only 8 char password)
def test_weak_password_pipeline_failure():
    pipeline = EncodingPipeline()
    request = EncodeRequest(
        message="Valid Message",
        password="        ",  # 8 spaces: passes Pydantic min_length=8 but fails AES WeakPasswordException
        algorithm="LSB",
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    )

    with pytest.raises(PipelineStageException) as excinfo:
        pipeline.execute(request)
    assert "AES_ENCRYPTION" in str(excinfo.value)


# 7. Invalid Base64 Image Payload Failure
def test_invalid_image_pipeline_failure():
    pipeline = EncodingPipeline()
    request = EncodeRequest(
        message="Valid Message",
        password="StrongPassword123!",
        algorithm="LSB",
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    )

    # Monkeypatch validate_image to raise ValidationException during stage 2
    def mock_fail_image(ctx):
        raise ValidationException("Invalid image structure")

    pipeline.validation_service.validate_image = mock_fail_image

    with pytest.raises(PipelineStageException) as excinfo:
        pipeline.execute(request)
    assert "VALIDATE_IMAGE" in str(excinfo.value)


# 8. Pipeline Health Check Diagnostics
def test_pipeline_diagnostics():
    health = check_pipeline_health()
    assert health["status"] == "HEALTHY"
    assert health["module_availability"]["morse_service"] == "OPERATIONAL"
    assert health["module_availability"]["aes_service"] == "OPERATIONAL"
    assert health["module_availability"]["binary_service"] == "OPERATIONAL"
    assert health["module_availability"]["payload_service"] == "OPERATIONAL"
    assert health["module_availability"]["mock_embedding_service"] == "OPERATIONAL"
    assert health["configuration_check"]["is_valid"] is True
