from typing import Dict, Any
from app.processing.metrics.interfaces import MetricsEvaluator

class MetricsProcessingService(MetricsEvaluator):
    def evaluate(self, original_bytes: bytes, stego_bytes: bytes) -> Dict[str, Any]:
        raise NotImplementedError("Metrics evaluation module not implemented yet.")
