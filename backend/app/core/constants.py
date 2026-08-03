"""
Global system constants and domain constraints for Hybrid Image Steganography System API.
"""

# API Versioning Prefix
API_V1_STR = "/api/v1"

# OpenAPI Tag Groups
TAG_SYSTEM = "System"
TAG_UPLOAD = "Upload"
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

# Strictly Supported Image Formats (PNG and BMP only)
SUPPORTED_IMAGE_TYPES = ["PNG", "BMP"]
SUPPORTED_MIME_TYPES = ["image/png", "image/bmp", "image/x-ms-bmp"]
SUPPORTED_EXTENSIONS = [".png", ".bmp"]

# Upload & Dimension Constraints
MAX_IMAGE_SIZE_BYTES = 10485760  # 10 MB limit
MIN_IMAGE_WIDTH = 10
MIN_IMAGE_HEIGHT = 10
MAX_IMAGE_WIDTH = 8192
MAX_IMAGE_HEIGHT = 8192
MAX_MEGAPIXELS = 64

# Message & Security Constraints
MAX_MESSAGE_LENGTH = 10000
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128

# Application Default Values & Directories
DEFAULT_ALGORITHM = "LSB"
DEFAULT_TEMP_DIR = "app/temp"
DEFAULT_UPLOADS_DIR = "app/temp/uploads"
DEFAULT_STATIC_DIR = "app/static"
