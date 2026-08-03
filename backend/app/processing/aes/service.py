from app.processing.aes.interfaces import AESProcessor

class AESProcessingService(AESProcessor):
    def encrypt(self, plain_text: str, password: str) -> str:
        raise NotImplementedError("AES encryption module not implemented yet.")

    def decrypt(self, cipher_text: str, password: str) -> str:
        raise NotImplementedError("AES decryption module not implemented yet.")
