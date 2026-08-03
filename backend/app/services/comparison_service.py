from app.schemas.requests import CompareRequest
from app.schemas.responses import CompareResponse


class ComparisonService:
    """
    Service handling multi-algorithm steganography benchmark comparisons.
    """
    def compare(self, request: CompareRequest) -> CompareResponse:
        """
        Execute performance benchmarking across LSB, DCT, and DWT algorithms.
        Raises NotImplementedError until algorithm modules are implemented in Phase 3B.
        """
        raise NotImplementedError("Algorithm comparison pipeline not implemented yet.")
