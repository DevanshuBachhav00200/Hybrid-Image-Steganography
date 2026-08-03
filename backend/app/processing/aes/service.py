import base64
from typing import Dict, Any, Union
from Crypto.Cipher import AES
from app.core.logging import logger
from app.processing.aes.interfaces import AESInterface
from app.processing.aes.constants import (
    AES_ALGORITHM,
    KEY_LENGTH_BITS,
    SALT_SIZE_BYTES,
    NONCE_SIZE_BYTES,
    TAG_SIZE_BYTES,
    PBKDF2_ITERATIONS,
    MIN_AES_PASSWORD_LENGTH,
    MAX_AES_PASSWORD_LENGTH,
)
from app.processing.aes.exceptions import (
    EncryptionException,
    DecryptionException,
    AuthenticationException,
    WeakPasswordException,
    InvalidCiphertextException,
)
from app.processing.aes.key_derivation import KeyDerivationService
from app.processing.aes.crypto_utils import (
    generate_secure_random,
    deserialize_payload,
    validate_payload,
)


class AESService(AESInterface):
    """
    Production-grade Cryptography Service implementing AES-256-GCM authenticated
    encryption and decryption with PBKDF2-HMAC-SHA256 key derivation.
    """

    def validate_password(self, password: str) -> bool:
        """
        Validate password length and character policy.
        Raises WeakPasswordException if password fails policy rules.
        """
        if not password or not isinstance(password, str) or not password.strip():
            raise WeakPasswordException("Password cannot be empty or whitespace only.")
        if len(password) < MIN_AES_PASSWORD_LENGTH:
            raise WeakPasswordException(f"Password must be at least {MIN_AES_PASSWORD_LENGTH} characters long.")
        if len(password) > MAX_AES_PASSWORD_LENGTH:
            raise WeakPasswordException(f"Password exceeds maximum length of {MAX_AES_PASSWORD_LENGTH} characters.")
        return True

    def generate_salt(self) -> bytes:
        """Generate 16-byte random salt."""
        return generate_secure_random(SALT_SIZE_BYTES)

    def generate_nonce(self) -> bytes:
        """Generate 12-byte random IV/nonce for GCM mode."""
        return generate_secure_random(NONCE_SIZE_BYTES)

    def derive_key(self, password: str, salt: bytes) -> bytes:
        """Derive 256-bit symmetric encryption key using PBKDF2-HMAC-SHA256."""
        self.validate_password(password)
        return KeyDerivationService.derive_key(password, salt)

    def encrypt(self, data: str, password: str) -> Dict[str, Any]:
        """
        Encrypt data string using AES-256-GCM.
        Returns structured payload containing ciphertext, salt, nonce, and tag (base64 encoded).
        """
        if data is None or not isinstance(data, str) or len(data) == 0:
            raise ValueError("Data to encrypt cannot be empty or None.")

        self.validate_password(password)

        logger.info(f"AES-256-GCM Encryption Started: Plaintext length {len(data)} characters")

        try:
            salt = self.generate_salt()
            nonce = self.generate_nonce()
            key = self.derive_key(password, salt)

            cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
            ciphertext_bytes, tag_bytes = cipher.encrypt_and_digest(data.encode("utf-8"))

            payload = {
                "ciphertext": base64.b64encode(ciphertext_bytes).decode("utf-8"),
                "salt": base64.b64encode(salt).decode("utf-8"),
                "nonce": base64.b64encode(nonce).decode("utf-8"),
                "authentication_tag": base64.b64encode(tag_bytes).decode("utf-8"),
                "algorithm": AES_ALGORITHM,
                "key_length": KEY_LENGTH_BITS,
                "iterations": PBKDF2_ITERATIONS,
            }

            logger.info("AES-256-GCM Encryption Completed successfully.")
            return payload

        except WeakPasswordException:
            raise
        except Exception as exc:
            logger.error(f"AES Encryption Failure: {str(exc)}")
            raise EncryptionException(f"Encryption failed: {str(exc)}")

    def decrypt(self, payload: Union[Dict[str, Any], str], password: str) -> str:
        """
        Decrypt AES-256-GCM payload dictionary or JSON string using password.
        Raises AuthenticationException if MAC tag verification fails (wrong password or tampered data).
        """
        self.validate_password(password)

        logger.info("AES-256-GCM Decryption Started.")

        try:
            payload_dict = deserialize_payload(payload)

            try:
                ciphertext_bytes = base64.b64decode(payload_dict["ciphertext"])
                salt_bytes = base64.b64decode(payload_dict["salt"])
                nonce_bytes = base64.b64decode(payload_dict["nonce"])
                tag_bytes = base64.b64decode(payload_dict["authentication_tag"])
            except Exception as exc:
                raise InvalidCiphertextException(f"Failed to decode base64 payload components: {str(exc)}")

            key = self.derive_key(password, salt_bytes)
            cipher = AES.new(key, AES.MODE_GCM, nonce=nonce_bytes)

            try:
                decrypted_bytes = cipher.decrypt_and_verify(ciphertext_bytes, tag_bytes)
            except ValueError as exc:
                logger.warning("AES Decryption Failure: MAC tag verification failed.")
                raise AuthenticationException("MAC authentication check failed. Invalid password or data tampered.")

            decrypted_str = decrypted_bytes.decode("utf-8")
            logger.info("AES-256-GCM Decryption Completed successfully.")
            return decrypted_str

        except (WeakPasswordException, AuthenticationException, InvalidCiphertextException):
            raise
        except Exception as exc:
            logger.error(f"AES Decryption Failure: {str(exc)}")
            raise DecryptionException(f"Decryption failed: {str(exc)}")
