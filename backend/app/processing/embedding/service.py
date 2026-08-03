from app.processing.embedding.interfaces import EmbeddingEngine

class EmbeddingProcessingService(EmbeddingEngine):
    def embed_payload(self, image_bytes: bytes, payload: str) -> bytes:
        raise NotImplementedError("Embedding engine module not implemented yet.")

    def extract_payload(self, stego_bytes: bytes) -> str:
        raise NotImplementedError("Extraction engine module not implemented yet.")
