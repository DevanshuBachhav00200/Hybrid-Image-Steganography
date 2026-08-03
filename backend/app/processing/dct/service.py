from app.processing.dct.interfaces import DCTEngine

class DCTProcessingService(DCTEngine):
    def embed_dct(self, image_bytes: bytes, binary_data: str) -> bytes:
        raise NotImplementedError("DCT embedding module not implemented yet.")

    def extract_dct(self, stego_bytes: bytes) -> str:
        raise NotImplementedError("DCT extraction module not implemented yet.")
