from app.services.encoding_service import EncodingService
from app.schemas.requests import EncodeRequest


def test_encoding_service_returns_ready():
    service = EncodingService()
    payload = EncodeRequest(
        message="Secret Payload",
        password="StrongPassword123!",
        algorithm="LSB",
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    )
    response = service.encode(payload)
    assert response.status == "READY"
    assert response.message == "Payload prepared successfully and ready for steganographic embedding."
