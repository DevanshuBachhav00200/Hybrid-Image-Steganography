import struct
import zlib
from app.processing.binary.constants import (
    MAGIC_NUMBER,
    FORMAT_VERSION,
    ALGORITHM_ID_AES_GCM,
    HEADER_SIZE_BYTES,
    RESERVED_BYTES,
)
from app.processing.binary.models import HeaderModel
from app.processing.binary.exceptions import (
    InvalidHeaderException,
    PayloadLengthException,
    ChecksumException,
)

HEADER_STRUCT_FORMAT = ">5sBBIB2sH"  # 5 + 1 + 1 + 4 + 1 + 2 + 2 = 16 bytes


def calculate_checksum(payload_bytes: bytes) -> int:
    """Calculate 16-bit CRC checksum over payload byte sequence."""
    if not payload_bytes:
        return 0
    return zlib.crc32(payload_bytes) & 0xFFFF


def build_header(payload_len: int, checksum: int) -> bytes:
    """
    Construct 16-byte fixed binary header.
    Format: Magic (5B) | Version (1B) | Alg ID (1B) | Payload Len (4B) | Header Size (1B) | Reserved (2B) | Checksum (2B)
    """
    if payload_len <= 0:
        raise PayloadLengthException("Payload length must be a positive integer.")

    header_bytes = struct.pack(
        HEADER_STRUCT_FORMAT,
        MAGIC_NUMBER,
        FORMAT_VERSION,
        ALGORITHM_ID_AES_GCM,
        payload_len,
        HEADER_SIZE_BYTES,
        RESERVED_BYTES,
        checksum,
    )
    return header_bytes


def parse_header(header_bytes: bytes) -> HeaderModel:
    """
    Parse 16-byte binary header into HeaderModel.
    Raises InvalidHeaderException if header byte array length is invalid or cannot be unpacked.
    """
    if not header_bytes or len(header_bytes) < HEADER_SIZE_BYTES:
        raise InvalidHeaderException(
            f"Invalid header size. Expected {HEADER_SIZE_BYTES} bytes, got {len(header_bytes) if header_bytes else 0} bytes."
        )

    try:
        magic, version, alg_id, payload_len, h_size, reserved, checksum = struct.unpack(
            HEADER_STRUCT_FORMAT, header_bytes[:HEADER_SIZE_BYTES]
        )
    except Exception as exc:
        raise InvalidHeaderException(f"Failed to unpack header bytes: {str(exc)}")

    header = HeaderModel(
        magic_number=magic,
        version=version,
        algorithm_id=alg_id,
        payload_length=payload_len,
        header_size=h_size,
        checksum=checksum,
    )

    validate_header(header)
    return header


def validate_header(header: HeaderModel) -> bool:
    """
    Validate magic bytes, version, and header structural parameters.
    Raises InvalidHeaderException if validation fails.
    """
    if header.magic_number != MAGIC_NUMBER:
        raise InvalidHeaderException(f"Invalid magic bytes '{header.magic_number}'. Expected '{MAGIC_NUMBER}'.")

    if header.version != FORMAT_VERSION:
        raise InvalidHeaderException(f"Unsupported format version '{header.version}'. Expected '{FORMAT_VERSION}'.")

    if header.algorithm_id != ALGORITHM_ID_AES_GCM:
        raise InvalidHeaderException(f"Unsupported algorithm ID '{header.algorithm_id}'. Expected '{ALGORITHM_ID_AES_GCM}'.")

    if header.header_size != HEADER_SIZE_BYTES:
        raise InvalidHeaderException(f"Invalid header size indicator '{header.header_size}'. Expected '{HEADER_SIZE_BYTES}'.")

    if header.payload_length <= 0:
        raise PayloadLengthException("Invalid payload length in binary header.")

    return True
