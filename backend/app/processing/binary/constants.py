"""
Binary Conversion and Header Specification Constants.
"""

MAGIC_NUMBER = b"STEGO"  # 5 bytes
FORMAT_VERSION = 1       # 1 byte uint8
ALGORITHM_ID_AES_GCM = 1 # 1 byte uint8
HEADER_SIZE_BYTES = 16   # 1 byte uint8 (Fixed 16-byte header)
RESERVED_BYTES = b"\x00\x00" # 2 bytes

# Bit ordering convention
BIT_ORDERING = "MSB"

# AES Component Sizes in Bytes
NONCE_SIZE_BYTES = 12
SALT_SIZE_BYTES = 16
TAG_SIZE_BYTES = 16
