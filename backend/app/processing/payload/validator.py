from app.processing.payload.models import PayloadValidationResult
from app.processing.payload.constants import MAX_PAYLOAD_SIZE_BITS, HEADER_BITS_SIZE
from app.processing.binary.bitstream import bits_to_bytes
from app.processing.binary.header import parse_header
from app.processing.payload.exceptions import PayloadValidationException


def validate_payload_structure(binary_bitstream: str) -> PayloadValidationResult:
    """
    Validate binary bitstream string structure, boundaries, and binary header integrity.
    """
    errors = []

    if not binary_bitstream or not isinstance(binary_bitstream, str):
        errors.append("Binary bitstream cannot be empty or None.")
        return PayloadValidationResult(is_valid=False, errors=errors)

    if len(binary_bitstream) % 8 != 0:
        errors.append(f"Bitstream length ({len(binary_bitstream)}) is not a multiple of 8.")

    if any(c not in ("0", "1") for c in binary_bitstream):
        errors.append("Bitstream contains invalid characters. Only '0' and '1' are permitted.")

    if len(binary_bitstream) < HEADER_BITS_SIZE:
        errors.append(f"Bitstream length ({len(binary_bitstream)} bits) is smaller than mandatory header size ({HEADER_BITS_SIZE} bits).")

    if len(binary_bitstream) > MAX_PAYLOAD_SIZE_BITS:
        errors.append(f"Bitstream size exceeds maximum permitted limit ({MAX_PAYLOAD_SIZE_BITS} bits).")

    if not errors:
        try:
            header_bytes = bits_to_bytes(binary_bitstream[:HEADER_BITS_SIZE])
            parse_header(header_bytes)
        except Exception as exc:
            errors.append(f"Header validation failed: {str(exc)}")

    is_valid = len(errors) == 0
    return PayloadValidationResult(is_valid=is_valid, errors=errors)
