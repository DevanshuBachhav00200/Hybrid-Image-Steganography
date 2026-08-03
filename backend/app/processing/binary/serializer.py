import base64
from typing import Dict, Any
from app.core.logging import logger
from app.processing.binary.header import build_header, calculate_checksum
from app.processing.binary.bitstream import bytes_to_bits
from app.processing.binary.exceptions import SerializationException
from app.processing.aes.crypto_utils import validate_payload


def serialize_payload_to_binary(aes_payload: Dict[str, Any]) -> str:
    """
    Serialize AES payload dictionary into MSB-first binary bitstream string ('0' and '1's).
    Structure: [Header (16B)] + [Nonce (12B)] + [Salt (16B)] + [Auth Tag (16B)] + [Ciphertext (NB)]
    """
    validate_payload(aes_payload)

    logger.info("Binary Serialization Started.")

    try:
        nonce_bytes = base64.b64decode(aes_payload["nonce"])
        salt_bytes = base64.b64decode(aes_payload["salt"])
        tag_bytes = base64.b64decode(aes_payload["authentication_tag"])
        ciphertext_bytes = base64.b64decode(aes_payload["ciphertext"])

        payload_bytes = nonce_bytes + salt_bytes + tag_bytes + ciphertext_bytes
        checksum = calculate_checksum(payload_bytes)

        header_bytes = build_header(len(payload_bytes), checksum)
        full_buffer = header_bytes + payload_bytes

        bitstream = bytes_to_bits(full_buffer)
        logger.info(f"Binary Serialization Completed: Total bitstream length {len(bitstream)} bits ({len(full_buffer)} bytes)")
        return bitstream

    except Exception as exc:
        logger.error(f"Binary Serialization Failure: {str(exc)}")
        raise SerializationException(f"Failed to serialize AES payload to binary bitstream: {str(exc)}")
