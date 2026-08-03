from app.processing.lsb.interfaces import LSBEngine

class LSBProcessingService(LSBEngine):
    def embed_lsb(self, image_bytes: bytes, binary_data: str) -> bytes:
        raise NotImplementedError("LSB embedding module not implemented yet.")

    def extract_lsb(self, stego_bytes: bytes) -> str:
        raise NotImplementedError("LSB extraction module not implemented yet.")
