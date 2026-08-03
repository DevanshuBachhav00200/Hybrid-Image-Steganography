from abc import ABC, abstractmethod
from typing import Dict, Any

class MetricsEvaluator(ABC):
    @abstractmethod
    def evaluate(self, original_bytes: bytes, stego_bytes: bytes) -> Dict[str, Any]: pass
