from typing import Dict, Any
from app.processing.binary.interfaces import BinaryInterface
from app.processing.binary.models import HeaderModel
from app.processing.binary.serializer import serialize_payload_to_binary
from app.processing.binary.deserializer import deserialize_binary_to_payload
from app.processing.binary.bitstream import bytes_to_bits, bits_to_bytes
from app.processing.binary.header import build_header, parse_header, validate_header
from app.processing.binary.constants import HEADER_SIZE_BYTES
from app.processing.binary.exceptions import InvalidBitstreamException


class BinaryService(BinaryInterface):
    """
    Production-ready Binary Conversion Service managing header packing, MSB-first
    bitstream serialization, deserialization, and payload integrity checksum verification.
    """

    def serialize(self, aes_payload: Dict[str, Any]) -> str:
        """Serialize AES payload dictionary into MSB-first binary bitstream string ('0' and '1's)."""
        return serialize_payload_to_binary(aes_payload)

    def deserialize(self, bitstream: str) -> Dict[str, Any]:
        """Deserialize MSB-first binary bitstream string back into AES payload dictionary."""
        return deserialize_binary_to_payload(bitstream)

    def bytes_to_bits(self, data: bytes) -> str:
        """Convert byte array into MSB-first binary string."""
        return bytes_to_bits(data)

    def bits_to_bytes(self, bitstream: str) -> bytes:
        """Convert MSB-first binary string back into byte array."""
        return bits_to_bytes(bitstream)

    def build_header(self, payload_len: int, checksum: int = 0) -> bytes:
        """Build 16-byte fixed binary header."""
        return build_header(payload_len, checksum)

    def parse_header(self, header_bytes: bytes) -> HeaderModel:
        """Parse 16-byte binary header into HeaderModel."""
        return parse_header(header_bytes)

    def validate_header(self, header: HeaderModel) -> bool:
        """Validate binary header parameters."""
        return validate_header(header)

    def calculate_payload_length(self, bitstream: str) -> int:
        """Extract payload byte length indicator from binary header in bitstream."""
        header_bytes = self.bits_to_bytes(bitstream[: HEADER_SIZE_BYTES * 8])
        header = self.parse_header(header_bytes)
        return header.payload_length

    def validate_bitstream(self, bitstream: str) -> bool:
        """
        Validate bitstream string format and header structural integrity.
        """
        if not bitstream or not isinstance(bitstream, str):
            raise InvalidBitstreamException("Bitstream must be a non-empty string.")

        if len(bitstream) % 8 != 0:
            raise InvalidBitstreamException(f"Bitstream length ({len(bitstream)}) is not a multiple of 8.")

        if any(c not in ("0", "1") for c in bitstream):
            raise InvalidBitstreamException("Bitstream contains invalid characters. Only '0' and '1' permit.")

        header_bytes = self.bits_to_bytes(bitstream[: HEADER_SIZE_BYTES * 8])
        header = self.parse_header(header_bytes)
        return self.validate_header(header)
