import pytest
import base64
from app.processing.aes.service import AESService
from app.processing.aes.key_derivation import KeyDerivationService
from app.processing.aes.exceptions import (
    AuthenticationException,
    WeakPasswordException,
    InvalidCiphertextException,
)


@pytest.fixture
def aes_service():
    return AESService()


# 1. PBKDF2 Key Derivation
def test_key_derivation(aes_service):
    salt = aes_service.generate_salt()
    key = KeyDerivationService.derive_key("StrongPassword123!", salt)
    assert len(key) == 32  # 256 bits


# 2. Basic Encryption and Decryption
def test_encryption_decryption(aes_service):
    plaintext = "...././.-../.-.. /---/.--/---/.-./.-../-.."
    password = "StrongPassword123!"

    payload = aes_service.encrypt(plaintext, password)

    assert "ciphertext" in payload
    assert "salt" in payload
    assert "nonce" in payload
    assert "authentication_tag" in payload
    assert payload["algorithm"] == "AES-256-GCM"
    assert payload["key_length"] == 256
    assert payload["iterations"] == 100000

    decrypted = aes_service.decrypt(payload, password)
    assert decrypted == plaintext


# 3. Round-Trip Fidelity with Various Datasets
@pytest.mark.parametrize(
    "text",
    [
        "SECRET_MORSE_PAYLOAD_123",
        "Unicode payload with special chars !@#$%^&*()_+-=",
        "A" * 1000,  # Large payload
    ],
)
def test_round_trip_fidelity(aes_service, text):
    password = "ComplexPassword99#"
    payload = aes_service.encrypt(text, password)
    decrypted = aes_service.decrypt(payload, password)
    assert decrypted == text


# 4. Wrong Password Rejection
def test_wrong_password_rejection(aes_service):
    plaintext = "Sensitive Morse Data"
    correct_password = "CorrectPassword123!"
    wrong_password = "WrongPassword123!"

    payload = aes_service.encrypt(plaintext, correct_password)

    with pytest.raises(AuthenticationException) as excinfo:
        aes_service.decrypt(payload, wrong_password)
    assert "MAC authentication check failed" in str(excinfo.value)


# 5. Tampered Ciphertext Rejection
def test_tampered_ciphertext(aes_service):
    plaintext = "Steganography Data"
    password = "SecurePassword123!"

    payload = aes_service.encrypt(plaintext, password)

    # Tamper with ciphertext bytes
    raw_cipher = base64.b64decode(payload["ciphertext"])
    tampered_bytes = bytearray(raw_cipher)
    tampered_bytes[0] ^= 0xFF  # Flip bits
    payload["ciphertext"] = base64.b64encode(tampered_bytes).decode("utf-8")

    with pytest.raises(AuthenticationException):
        aes_service.decrypt(payload, password)


# 6. Tampered Authentication Tag Rejection
def test_tampered_auth_tag(aes_service):
    plaintext = "Integrity Test Payload"
    password = "SecurePassword123!"

    payload = aes_service.encrypt(plaintext, password)

    # Tamper with authentication tag
    raw_tag = base64.b64decode(payload["authentication_tag"])
    tampered_tag = bytearray(raw_tag)
    tampered_tag[0] ^= 0xFF
    payload["authentication_tag"] = base64.b64encode(tampered_tag).decode("utf-8")

    with pytest.raises(AuthenticationException):
        aes_service.decrypt(payload, password)


# 7. Tampered Nonce Rejection
def test_tampered_nonce(aes_service):
    plaintext = "Nonce Test Payload"
    password = "SecurePassword123!"

    payload = aes_service.encrypt(plaintext, password)

    # Tamper with nonce
    raw_nonce = base64.b64decode(payload["nonce"])
    tampered_nonce = bytearray(raw_nonce)
    tampered_nonce[0] ^= 0xFF
    payload["nonce"] = base64.b64encode(tampered_nonce).decode("utf-8")

    with pytest.raises(AuthenticationException):
        aes_service.decrypt(payload, password)


# 8. Password Policy Validation Exceptions
def test_weak_password_exceptions(aes_service):
    with pytest.raises(WeakPasswordException):
        aes_service.encrypt("Data", "short")  # Less than 8 chars

    with pytest.raises(WeakPasswordException):
        aes_service.encrypt("Data", "")

    with pytest.raises(WeakPasswordException):
        aes_service.encrypt("Data", None)

    with pytest.raises(WeakPasswordException):
        aes_service.encrypt("Data", "        ")


# 9. Invalid Payload Validation
def test_invalid_payload_validation(aes_service):
    with pytest.raises(InvalidCiphertextException):
        aes_service.decrypt("invalid json string", "ValidPassword123!")

    with pytest.raises(InvalidCiphertextException):
        aes_service.decrypt({"ciphertext": "data_only"}, "ValidPassword123!")


# 10. Empty Data Encryption Rejection
def test_empty_data_encryption(aes_service):
    with pytest.raises(ValueError):
        aes_service.encrypt("", "ValidPassword123!")

    with pytest.raises(ValueError):
        aes_service.encrypt(None, "ValidPassword123!")
