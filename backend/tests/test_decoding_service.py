import pytest
from app.services.decoding_service import DecodingService
from app.schemas.requests import DecodeRequest


def test_decoding_service_raises_not_implemented():
    service = DecodingService()
    payload = DecodeRequest(
        password="StrongPassword123!",
        algorithm="DCT",
        image="data:image/png;base64,stego_sample_base64",
    )
    with pytest.raises(NotImplementedError) as excinfo:
        service.decode(payload)
    assert "Decoding pipeline not implemented yet" in str(excinfo.value)
