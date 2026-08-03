from abc import ABC, abstractmethod

class DCTEngine(ABC):
    @abstractmethod
    def embed_dct(self, image_bytes: bytes, binary_data: str) -> bytes: pass
    @abstractmethod
    def extract_dct(self, stego_bytes: bytes) -> str: pass
