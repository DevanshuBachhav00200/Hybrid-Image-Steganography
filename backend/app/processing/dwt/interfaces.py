from abc import ABC, abstractmethod

class DWTEngine(ABC):
    @abstractmethod
    def embed_dwt(self, image_bytes: bytes, binary_data: str) -> bytes: pass
    @abstractmethod
    def extract_dwt(self, stego_bytes: bytes) -> str: pass
