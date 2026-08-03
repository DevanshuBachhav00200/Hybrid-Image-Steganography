from abc import ABC, abstractmethod

class LSBEngine(ABC):
    @abstractmethod
    def embed_lsb(self, image_bytes: bytes, binary_data: str) -> bytes: pass
    @abstractmethod
    def extract_lsb(self, stego_bytes: bytes) -> str: pass
