import pytest
from app.services.encoding_service import EncodingService
from app.schemas.requests import EncodeRequest


def test_encoding_service_raises_not_implemented():
    service = EncodingService()
    payload = EncodeRequest(
        message="Secret Payload",
        password="StrongPassword123!",
        algorithm="LSB",
        image="data:image/png;base64,sample_base64",
    )
    with pytest.raises(NotImplementedError) as excinfo:
        service.encode(payload)
    assert "Encoding pipeline not implemented yet" in str(excinfo.value)
