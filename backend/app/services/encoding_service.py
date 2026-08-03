from app.schemas.requests import EncodeRequest
from app.schemas.responses import EncodeResponse
from app.processing.pipeline.factory import PipelineFactory
from app.core.logging import logger


class EncodingService:
    """
    Service layer orchestrating the encoding workflow via EncodingPipeline.
    Does not contain inline stage logic; delegates execution to Pipeline orchestrator.
    """

    def encode(self, request: EncodeRequest) -> EncodeResponse:
        """
        Execute steganographic encoding workflow using PipelineFactory orchestrator.
        """
        logger.info(f"EncodingService: Delegating encode request for algorithm '{request.algorithm}' to EncodingPipeline")
        pipeline = PipelineFactory.get_encoding_pipeline()
        return pipeline.execute(request)
