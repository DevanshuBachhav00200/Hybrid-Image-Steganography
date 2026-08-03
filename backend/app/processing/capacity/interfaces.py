from abc import ABC, abstractmethod

class CapacityCalculator(ABC):
    @abstractmethod
    def calculate_max_capacity(self, image_bytes: bytes, algorithm: str) -> int: pass
