from app.core.exceptions import StegoAppException


class AESCryptoException(StegoAppException):
    """Base exception for all AES cryptographic processing errors."""
    pass


class EncryptionException(AESCryptoException):
    """Raised when AES-GCM encryption fails."""
    pass


class DecryptionException(AESCryptoException):
    """Raised when AES-GCM decryption fails."""
    pass


class KeyDerivationException(AESCryptoException):
    """Raised when PBKDF2 key derivation fails."""
    pass


class AuthenticationException(AESCryptoException):
    """Raised when AES-GCM authentication tag verification fails (wrong password or tampered data)."""
    def __init__(self, message: str = "MAC authentication check failed. Invalid password or data tampered."):
        super().__init__(message)


class WeakPasswordException(AESCryptoException):
    """Raised when password policy validation fails (too short, empty, or null)."""
    def __init__(self, message: str = "Password does not meet minimum security requirements."):
        super().__init__(message)


class InvalidCiphertextException(AESCryptoException):
    """Raised when ciphertext payload structure or data is invalid."""
    pass
