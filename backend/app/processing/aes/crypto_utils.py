import json
import hmac
import base64
from typing import Dict, Any
from Crypto.Random import get_random_bytes
from app.processing.aes.exceptions import InvalidCiphertextException


def generate_secure_random(n_bytes: int) -> bytes:
    """Generate cryptographically secure random byte array."""
    if n_bytes <= 0:
        raise ValueError("Requested random byte count must be positive.")
    return get_random_bytes(n_bytes)


def constant_time_compare(val1: bytes, val2: bytes) -> bool:
    """Compare two byte sequences in constant time to prevent timing attacks."""
    if not isinstance(val1, (bytes, bytearray)) or not isinstance(val2, (bytes, bytearray)):
        return False
    return hmac.compare_digest(val1, val2)


def validate_payload(payload_dict: Dict[str, Any]) -> bool:
    """
    Validate presence and structure of required fields in an AES payload dictionary.
    Raises InvalidCiphertextException if fields are missing or invalid.
    """
    if not isinstance(payload_dict, dict):
        raise InvalidCiphertextException("AES payload must be a valid dictionary structure.")

    required_fields = ["ciphertext", "salt", "nonce", "authentication_tag"]
    missing = [field for field in required_fields if field not in payload_dict or not payload_dict[field]]
    if missing:
        raise InvalidCiphertextException(f"AES payload missing required field(s): {', '.join(missing)}")

    return True


def serialize_payload(payload_dict: Dict[str, Any]) -> str:
    """Serialize AES payload dictionary into JSON string."""
    validate_payload(payload_dict)
    return json.dumps(payload_dict, sort_keys=True)


def deserialize_payload(payload_input: Any) -> Dict[str, Any]:
    """
    Deserialize AES payload input (dict or JSON string) into dictionary format.
    Raises InvalidCiphertextException if deserialization fails.
    """
    if isinstance(payload_input, dict):
        validate_payload(payload_input)
        return payload_input

    if isinstance(payload_input, str):
        try:
            parsed = json.loads(payload_input)
            validate_payload(parsed)
            return parsed
        except Exception as exc:
            raise InvalidCiphertextException(f"Failed to parse JSON ciphertext payload: {str(exc)}")

    raise InvalidCiphertextException("Payload must be a dictionary or valid JSON string.")
