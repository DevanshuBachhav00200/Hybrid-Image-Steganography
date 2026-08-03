from app.processing.capacity.interfaces import CapacityCalculator

class CapacityProcessingService(CapacityCalculator):
    def calculate_max_capacity(self, image_bytes: bytes, algorithm: str) -> int:
        raise NotImplementedError("Capacity calculation module not implemented yet.")
