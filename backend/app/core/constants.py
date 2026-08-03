"""
Global system constants and domain constraints for Hybrid Image Steganography System API.
"""

# API Versioning Prefix
API_V1_STR = "/api/v1"

# OpenAPI Tag Groups
TAG_SYSTEM = "System"
TAG_ENCODING = "Encoding"
TAG_DECODING = "Decoding"
TAG_COMPARISON = "Comparison"
TAG_METRICS = "Metrics"

# Response Messages
MSG_BACKEND_RUNNING = "Hybrid Image Steganography Backend Running"
MSG_HEALTH_OK = "healthy"
MSG_STATUS_ONLINE = "online"

# Domain Validation Constraints & Defaults
SUPPORTED_ALGORITHMS = ["LSB", "DCT", "DWT"]
SUPPORTED_IMAGE_TYPES = ["PNG", "JPEG", "BMP", "WEBP"]
MAX_IMAGE_SIZE_BYTES = 10485760  # 10 MB in bytes
MAX_MESSAGE_LENGTH = 10000
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128

# Application Default Values
DEFAULT_ALGORITHM = "LSB"
DEFAULT_TEMP_DIR = "app/temp"
DEFAULT_STATIC_DIR = "app/static"
