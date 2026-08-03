from app.processing.binary.exceptions import InvalidBitstreamException


def bytes_to_bits(data: bytes) -> str:
    """
    Convert byte array into MSB-first binary bitstream string ('0' and '1's).
    Example: b'A' -> '01000001'
    """
    if data is None:
        raise ValueError("Byte data cannot be None.")
    return "".join(format(byte, "08b") for byte in data)


def bits_to_bytes(bitstream: str) -> bytes:
    """
    Convert MSB-first binary bitstream string ('0' and '1's) back into byte array.
    Raises InvalidBitstreamException if bitstream length is not a multiple of 8 or contains invalid characters.
    """
    if bitstream is None or not isinstance(bitstream, str):
        raise InvalidBitstreamException("Bitstream must be a valid string of '0' and '1's.")

    bitstream = bitstream.strip()
    if not bitstream:
        return b""

    if len(bitstream) % 8 != 0:
        raise InvalidBitstreamException(f"Bitstream length ({len(bitstream)}) is not a multiple of 8.")

    if any(c not in ("0", "1") for c in bitstream):
        raise InvalidBitstreamException("Bitstream contains invalid characters. Only '0' and '1' are permitted.")

    byte_array = bytearray()
    for i in range(0, len(bitstream), 8):
        byte_chunk = bitstream[i : i + 8]
        byte_array.append(int(byte_chunk, 2))

    return bytes(byte_array)


def int_to_binary(val: int, length: int = 8) -> str:
    """Convert integer to binary string of specified bit length."""
    if val < 0:
        raise ValueError("Integer value must be non-negative.")
    return format(val, f"0{length}b")


def binary_to_int(bit_str: str) -> int:
    """Convert binary bit string to integer."""
    if not bit_str or any(c not in ("0", "1") for c in bit_str):
        raise InvalidBitstreamException("Invalid bit string for integer conversion.")
    return int(bit_str, 2)


def pack_bits(bit_str: str) -> bytes:
    """Alias for bits_to_bytes."""
    return bits_to_bytes(bit_str)


def unpack_bits(data: bytes) -> str:
    """Alias for bytes_to_bits."""
    return bytes_to_bits(data)
