class StegoException(Exception):
    """Base exception class for steganography module."""
    def __init__(self, message: str = "Steganography operation error"):
        self.message = message
        super().__init__(self.message)

class EncodingException(StegoException):
    """Exception raised during encoding operation failure."""
    pass

class DecodingException(StegoException):
    """Exception raised during decoding operation failure."""
    pass

class InvalidImageFormatException(StegoException):
    """Exception raised when an unsupported image format is uploaded."""
    pass
