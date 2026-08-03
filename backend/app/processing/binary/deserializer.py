import base64
from typing import Dict, Any
from app.core.logging import logger
from app.processing.binary.header import parse_header, calculate_checksum
from app.processing.binary.bitstream import bits_to_bytes
from app.processing.binary.constants import (
    HEADER_SIZE_BYTES,
    NONCE_SIZE_BYTES,
    SALT_SIZE_BYTES,
    TAG_SIZE_BYTES,
)
from app.processing.binary.exceptions import (
    DeserializationException,
    ChecksumException,
    PayloadLengthException,
)


def deserialize_binary_to_payload(bitstream: str) -> Dict[str, Any]:
    """
    Deserialize MSB-first binary bitstream string back into structured AES payload dictionary.
    Verifies 16-byte binary header, payload length, and CRC16 checksum integrity.
    """
    logger.info("Binary Deserialization Started.")

    try:
        full_buffer = bits_to_bytes(bitstream)

        if len(full_buffer) < HEADER_SIZE_BYTES:
            raise DeserializationException(f"Bitstream buffer too short ({len(full_buffer)} bytes). Minimum header size is 16 bytes.")

        header = parse_header(full_buffer[:HEADER_SIZE_BYTES])

        payload_bytes = full_buffer[HEADER_SIZE_BYTES : HEADER_SIZE_BYTES + header.payload_length]
        if len(payload_bytes) != header.payload_length:
            raise PayloadLengthException(
                f"Binary payload length mismatch. Expected {header.payload_length} bytes, got {len(payload_bytes)} bytes."
            )

        actual_checksum = calculate_checksum(payload_bytes)
        if actual_checksum != header.checksum:
            logger.warning(f"Binary Checksum Mismatch: Calculated {actual_checksum}, expected {header.checksum}")
            raise ChecksumException("Binary payload CRC checksum mismatch. Payload corrupted.")

        min_payload_size = NONCE_SIZE_BYTES + SALT_SIZE_BYTES + TAG_SIZE_BYTES
        if len(payload_bytes) < min_payload_size:
            raise DeserializationException(f"Payload bytes size ({len(payload_bytes)}) is smaller than required crypto components ({min_payload_size} bytes).")

        nonce_bytes = payload_bytes[0:NONCE_SIZE_BYTES]
        salt_bytes = payload_bytes[NONCE_SIZE_BYTES : NONCE_SIZE_BYTES + SALT_SIZE_BYTES]
        tag_bytes = payload_bytes[NONCE_SIZE_BYTES + SALT_SIZE_BYTES : NONCE_SIZE_BYTES + SALT_SIZE_BYTES + TAG_SIZE_BYTES]
        ciphertext_bytes = payload_bytes[NONCE_SIZE_BYTES + SALT_SIZE_BYTES + TAG_SIZE_BYTES :]

        aes_payload = {
            "ciphertext": base64.b64encode(ciphertext_bytes).decode("utf-8"),
            "salt": base64.b64encode(salt_bytes).decode("utf-8"),
            "nonce": base64.b64encode(nonce_bytes).decode("utf-8"),
            "authentication_tag": base64.b64encode(tag_bytes).decode("utf-8"),
            "algorithm": "AES-256-GCM",
            "key_length": 256,
            "iterations": 100000,
        }

        logger.info("Binary Deserialization Completed successfully.")
        return aes_payload

    except (ChecksumException, PayloadLengthException, DeserializationException):
        raise
    except Exception as exc:
        logger.error(f"Binary Deserialization Failure: {str(exc)}")
        raise DeserializationException(f"Failed to deserialize binary bitstream: {str(exc)}")
