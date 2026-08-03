from abc import ABC, abstractmethod

class EmbeddingEngine(ABC):
    @abstractmethod
    def embed_payload(self, image_bytes: bytes, payload: str) -> bytes: pass
    @abstractmethod
    def extract_payload(self, stego_bytes: bytes) -> str: pass
