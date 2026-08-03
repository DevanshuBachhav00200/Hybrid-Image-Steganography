from app.services.encoding_service import EncodingService
from app.schemas.requests import EncodeRequest


def test_encoding_service_returns_not_implemented():
    service = EncodingService()
    payload = EncodeRequest(
        message="Secret Payload",
        password="StrongPassword123!",
        algorithm="LSB",
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    )
    response = service.encode(payload)
    assert response.status == "NOT_IMPLEMENTED"
    assert response.message == "Encode endpoint ready."
