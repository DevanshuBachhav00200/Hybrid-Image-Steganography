from app.processing.dwt.interfaces import DWTEngine

class DWTProcessingService(DWTEngine):
    def embed_dwt(self, image_bytes: bytes, binary_data: str) -> bytes:
        raise NotImplementedError("DWT embedding module not implemented yet.")

    def extract_dwt(self, stego_bytes: bytes) -> str:
        raise NotImplementedError("DWT extraction module not implemented yet.")
