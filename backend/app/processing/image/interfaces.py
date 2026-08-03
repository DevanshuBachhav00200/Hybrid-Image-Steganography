from abc import ABC, abstractmethod

class ImageTransformProcessor(ABC):
    @abstractmethod
    def resize_or_format(self, image_bytes: bytes) -> bytes: pass
