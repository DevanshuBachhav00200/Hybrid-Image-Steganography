import pytest
import base64
from app.processing.binary.service import BinaryService
from app.processing.binary.header import build_header, parse_header, calculate_checksum
from app.processing.binary.bitstream import bytes_to_bits, bits_to_bytes
from app.processing.binary.exceptions import (
    InvalidHeaderException,
    InvalidBitstreamException,
    ChecksumException,
    PayloadLengthException,
)
from app.processing.binary.constants import MAGIC_NUMBER, HEADER_SIZE_BYTES


@pytest.fixture
def binary_service():
    return BinaryService()


@pytest.fixture
def sample_aes_payload():
    return {
        "ciphertext": base64.b64encode(b"EncryptedCiphertextData123").decode("utf-8"),
        "salt": base64.b64encode(b"SaltBytes16_Byte").decode("utf-8"),
        "nonce": base64.b64encode(b"NonceBytes12").decode("utf-8"),
        "authentication_tag": base64.b64encode(b"AuthTagBytes16__").decode("utf-8"),
        "algorithm": "AES-256-GCM",
        "key_length": 256,
        "iterations": 100000,
    }


# 1. Header Packing & Unpacking
def test_header_packing_and_parsing():
    payload_len = 100
    checksum = 12345

    header_bytes = build_header(payload_len, checksum)
    assert len(header_bytes) == HEADER_SIZE_BYTES
    assert header_bytes[:5] == MAGIC_NUMBER

    header_model = parse_header(header_bytes)
    assert header_model.magic_number == MAGIC_NUMBER
    assert header_model.version == 1
    assert header_model.algorithm_id == 1
    assert header_model.payload_length == payload_len
    assert header_model.header_size == 16
    assert header_model.checksum == checksum


# 2. MSB-First Bit Conversion
def test_bytes_to_bits_and_back():
    raw_data = b"ABC 123"
    bitstream = bytes_to_bits(raw_data)
    assert len(bitstream) == len(raw_data) * 8
    assert all(c in ("0", "1") for c in bitstream)

    reconstructed_bytes = bits_to_bytes(bitstream)
    assert reconstructed_bytes == raw_data


# 3. Serialization and Deserialization Round-Trip
def test_binary_serialization_round_trip(binary_service, sample_aes_payload):
    bitstream = binary_service.serialize(sample_aes_payload)
    assert len(bitstream) > HEADER_SIZE_BYTES * 8

    reconstructed_payload = binary_service.deserialize(bitstream)
    assert reconstructed_payload["ciphertext"] == sample_aes_payload["ciphertext"]
    assert reconstructed_payload["salt"] == sample_aes_payload["salt"]
    assert reconstructed_payload["nonce"] == sample_aes_payload["nonce"]
    assert reconstructed_payload["authentication_tag"] == sample_aes_payload["authentication_tag"]


# 4. Invalid Magic Bytes Rejection
def test_invalid_magic_number_rejection():
    # Header with invalid magic bytes b"BADMG"
    bad_header_bytes = b"BADMG\x01\x01\x00\x00\x00\x64\x10\x00\x00\x00\x00"
    with pytest.raises(InvalidHeaderException) as excinfo:
        parse_header(bad_header_bytes)
    assert "Invalid magic bytes" in str(excinfo.value)


# 5. Invalid Bitstream Character Rejection
def test_invalid_bitstream_character(binary_service):
    invalid_bits = "01010102"  # Contains '2'
    with pytest.raises(InvalidBitstreamException):
        binary_service.bits_to_bytes(invalid_bits)


# 6. Bitstream Length Non-Multiple of 8 Rejection
def test_invalid_bitstream_length(binary_service):
    invalid_bits = "010101"  # Length 6
    with pytest.raises(InvalidBitstreamException):
        binary_service.bits_to_bytes(invalid_bits)


# 7. Checksum Mismatch Detection
def test_checksum_mismatch(binary_service, sample_aes_payload):
    bitstream = binary_service.serialize(sample_aes_payload)

    # Flip a bit in the payload portion (after 16-byte header = 128 bits)
    tampered_bitstream = (
        bitstream[:128]
        + ("1" if bitstream[128] == "0" else "0")
        + bitstream[129:]
    )

    with pytest.raises(ChecksumException) as excinfo:
        binary_service.deserialize(tampered_bitstream)
    assert "CRC checksum mismatch" in str(excinfo.value)


# 8. Large Payload Serialization
def test_large_payload_serialization(binary_service):
    large_cipher = base64.b64encode(b"X" * 10000).decode("utf-8")
    payload = {
        "ciphertext": large_cipher,
        "salt": base64.b64encode(b"SaltBytes16_Byte").decode("utf-8"),
        "nonce": base64.b64encode(b"NonceBytes12").decode("utf-8"),
        "authentication_tag": base64.b64encode(b"AuthTagBytes16__").decode("utf-8"),
        "algorithm": "AES-256-GCM",
        "key_length": 256,
        "iterations": 100000,
    }

    bitstream = binary_service.serialize(payload)
    reconstructed = binary_service.deserialize(bitstream)
    assert reconstructed["ciphertext"] == large_cipher


# 9. BinaryService Helper Functions
def test_binary_service_helpers(binary_service, sample_aes_payload):
    bitstream = binary_service.serialize(sample_aes_payload)
    assert binary_service.validate_bitstream(bitstream) is True

    payload_len = binary_service.calculate_payload_length(bitstream)
    assert payload_len > 0
