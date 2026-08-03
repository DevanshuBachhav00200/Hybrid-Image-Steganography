from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256
from app.processing.aes.constants import (
    KEY_LENGTH_BYTES,
    PBKDF2_ITERATIONS,
    SALT_SIZE_BYTES,
)
from app.processing.aes.exceptions import KeyDerivationException
from app.core.logging import logger


class KeyDerivationService:
    """
    Independent Key Derivation Service implementing PBKDF2-HMAC-SHA256 to produce
    cryptographically strong 256-bit symmetric keys from user passwords.
    """

    @staticmethod
    def derive_key(password: str, salt: bytes, iterations: int = PBKDF2_ITERATIONS) -> bytes:
        """
        Derive 256-bit key from password string and salt bytes.
        Raises KeyDerivationException if key derivation fails.
        """
        if not password or not isinstance(password, str):
            raise KeyDerivationException("Password must be a non-empty string for key derivation.")
        if not salt or len(salt) < SALT_SIZE_BYTES:
            raise KeyDerivationException(f"Salt must be at least {SALT_SIZE_BYTES} bytes.")

        try:
            # PBKDF2 key derivation using HMAC-SHA256
            derived_key = PBKDF2(
                password=password,
                salt=salt,
                dkLen=KEY_LENGTH_BYTES,
                count=iterations,
                hmac_hash_module=SHA256,
            )
            return derived_key
        except Exception as exc:
            logger.error(f"KeyDerivationService: PBKDF2 key derivation error: {str(exc)}")
            raise KeyDerivationException(f"Key derivation failed: {str(exc)}")
