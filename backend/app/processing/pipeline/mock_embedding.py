from app.core.enums import StatusType
from app.core.logging import logger
from app.schemas.responses import EncodeResponse
from app.processing.payload.models import EmbeddingRequest


class MockEmbeddingService:
    """
    Mock Embedding Service intercepting pipeline execution immediately after Payload Preparation.
    Confirms end-to-end preprocessing pipeline execution before pixel-level steganography embedding algorithms in Phase 3E.
    """

    @staticmethod
    def execute(request: EmbeddingRequest) -> EncodeResponse:
        """
        Interprets prepared EmbeddingRequest and returns a READY status response confirming preprocessing completion.
        """
        logger.info(f"MockEmbeddingService: Payload [{request.payload_id}] received for algorithm '{request.algorithm}'. Preprocessing complete.")
        return EncodeResponse(
            status=StatusType.READY,
            message="Payload prepared successfully and ready for steganographic embedding.",
            stego_image=None,
            metrics={
                "payload_id": request.payload_id,
                "algorithm": str(request.algorithm),
                "status": "PREPARED",
            },
        )
