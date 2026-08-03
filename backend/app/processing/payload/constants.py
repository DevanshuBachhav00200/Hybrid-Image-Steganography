"""
Payload Builder and Embedding Preparation Constants.
"""
from app.core.enums import EmbeddingAlgorithm

DEFAULT_EMBEDDING_ALGORITHM = EmbeddingAlgorithm.AUTO
MAX_PAYLOAD_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB max payload size limit
MAX_PAYLOAD_SIZE_BITS = MAX_PAYLOAD_SIZE_BYTES * 8
HEADER_BITS_SIZE = 128  # 16 bytes fixed header = 128 bits
