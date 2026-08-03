import pytest
from app.services.validation_service import ValidationService
from app.core.exceptions import ValidationException


def test_validation_service_success():
    service = ValidationService()
    assert service.validate_message("Hello World") is True
    assert service.validate_password("Password123!") is True
    assert service.validate_algorithm("LSB") is True
    assert service.validate_image("sample_base64_data") is True


def test_validation_service_failures():
    service = ValidationService()
    with pytest.raises(ValidationException):
        service.validate_password("short")

    with pytest.raises(ValidationException):
        service.validate_algorithm("INVALID_ALG")

    with pytest.raises(ValidationException):
        service.validate_image("")
