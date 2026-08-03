import time
from typing import Optional, Any
from app.core.enums import PipelineStatus, StatusType, EmbeddingAlgorithm
from app.core.exceptions import PipelineStageException, PipelineException
from app.core.logging import logger
from app.schemas.requests import EncodeRequest
from app.schemas.responses import EncodeResponse
from app.schemas.upload import ImageMetadata
from app.processing.pipeline.context import PipelineContext, PipelineResult
from app.processing.pipeline.mock_embedding import MockEmbeddingService
from app.services.validation_service import ValidationService
from app.services.image_service import ImageService
from app.services.metrics_service import MetricsService
from app.processing.morse.service import MorseService
from app.processing.aes.service import AESService
from app.processing.binary.service import BinaryService
from app.processing.payload.service import PayloadService
from app.processing.payload.embedding_manager import EmbeddingManager


class EncodingPipeline:
    """
    Enterprise Encoding Preprocessing Orchestrator executing stages sequentially:
    Validation -> Image Prep -> Morse -> AES -> Binary -> Payload Builder -> Embedding Manager -> Mock Ready.
    """

    def __init__(self):
        self.validation_service = ValidationService()
        self.image_service = ImageService()
        self.metrics_service = MetricsService()
        self.morse_service = MorseService()
        self.aes_service = AESService()
        self.binary_service = BinaryService()
        self.payload_service = PayloadService()
        self.embedding_manager = EmbeddingManager()
        self.mock_embedding_service = MockEmbeddingService()

    def execute(self, request: EncodeRequest, metadata: Optional[ImageMetadata] = None) -> EncodeResponse:
        """
        Main pipeline entry point executing preprocessing stages in order.
        """
        ctx = PipelineContext(
            request=request,
            metadata=metadata,
            algorithm=request.algorithm,
            current_stage="STARTUP",
            status=PipelineStatus.CREATED,
        )

        logger.info(f"[Pipeline Event] Pipeline Started [{ctx.pipeline_id}] for algorithm: {ctx.algorithm}")

        try:
            self.validate_request_stage(ctx)
            self.validate_image_stage(ctx)
            self.prepare_image_stage(ctx)
            self.morse_stage(ctx)
            self.encryption_stage(ctx)
            self.binary_stage(ctx)
            self.payload_stage(ctx)
            return self.embedding_stage(ctx)

        except Exception as exc:
            ctx.fail(str(exc))
            logger.error(f"[Pipeline Event] Pipeline Failed at stage '{ctx.current_stage}': {str(exc)}")
            raise PipelineStageException(stage_name=ctx.current_stage, message=str(exc))

    def _execute_stage(self, ctx: PipelineContext, stage_name: str, stage_func) -> Any:
        """Helper executing stage logic while measuring duration and recording telemetry."""
        stage_start = time.time()
        ctx.advance_stage(stage_name, PipelineStatus.PROCESSING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        result = stage_func(ctx)

        duration_ms = (time.time() - stage_start) * 1000
        ctx.record_stage_telemetry(stage_name, duration_ms, status="COMPLETED")
        logger.info(f"[Pipeline Event] Stage Completed: {stage_name} in {duration_ms:.2f}ms")
        return result

    def validate_request_stage(self, ctx: PipelineContext) -> None:
        """Stage 1: Validate payload parameters (message, password, algorithm)."""
        stage_name = "VALIDATE_REQUEST"

        def logic(c):
            self.validation_service.validate_request(c.request)
            self.validation_service.validate_message(c.request.message)
            self.validation_service.validate_password(c.request.password)
            self.validation_service.validate_algorithm(c.request.algorithm)

        self._execute_stage(ctx, stage_name, logic)

    def validate_image_stage(self, ctx: PipelineContext) -> None:
        """Stage 2: Validate image payload data URL or base64 structure."""
        stage_name = "VALIDATE_IMAGE"

        def logic(c):
            self.validation_service.validate_image(c.request.image)

        self._execute_stage(ctx, stage_name, logic)

    def prepare_image_stage(self, ctx: PipelineContext) -> None:
        """Stage 3: Load cover image buffer and verify pixel data."""
        stage_name = "PREPARE_IMAGE"

        def logic(c):
            c.temp_data["image_ready"] = True

        self._execute_stage(ctx, stage_name, logic)

    def morse_stage(self, ctx: PipelineContext) -> None:
        """Stage 4: Convert plain text message to International Morse Code sequence."""
        stage_name = "MORSE_ENCODING"

        def logic(c):
            morse_payload = self.morse_service.encode(c.request.message)
            c.temp_data["morse_payload"] = morse_payload

        self._execute_stage(ctx, stage_name, logic)

    def encryption_stage(self, ctx: PipelineContext) -> None:
        """Stage 5: Encrypt Morse code payload using AES-256-GCM and password key."""
        stage_name = "AES_ENCRYPTION"

        def logic(c):
            morse_payload = c.temp_data.get("morse_payload")
            password = c.request.password
            aes_payload = self.aes_service.encrypt(morse_payload, password)
            c.temp_data["aes_payload"] = aes_payload

        self._execute_stage(ctx, stage_name, logic)

    def binary_stage(self, ctx: PipelineContext) -> None:
        """Stage 6: Convert AES cipher payload into MSB-first binary bitstream string."""
        stage_name = "BINARY_CONVERSION"

        def logic(c):
            aes_payload = c.temp_data.get("aes_payload")
            binary_bitstream = self.binary_service.serialize(aes_payload)
            c.temp_data["binary_bitstream"] = binary_bitstream

        self._execute_stage(ctx, stage_name, logic)

    def payload_stage(self, ctx: PipelineContext) -> None:
        """Stage 7: Package binary bitstream into validated Payload object."""
        stage_name = "PAYLOAD_BUILDER"

        def logic(c):
            binary_bitstream = c.temp_data.get("binary_bitstream")
            alg_enum = EmbeddingAlgorithm(c.algorithm) if c.algorithm in EmbeddingAlgorithm.__members__ else EmbeddingAlgorithm.AUTO
            payload_obj = self.payload_service.build(binary_bitstream, alg_enum)
            c.temp_data["payload_object"] = payload_obj

        self._execute_stage(ctx, stage_name, logic)

    def embedding_stage(self, ctx: PipelineContext) -> EncodeResponse:
        """Stage 8: Prepare embedding request and invoke MockEmbeddingService."""
        stage_name = "IMAGE_EMBEDDING"
        stage_start = time.time()
        ctx.advance_stage(stage_name, PipelineStatus.PROCESSING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        payload_obj = ctx.temp_data.get("payload_object")
        embedding_request = self.embedding_manager.prepare_embedding(payload_obj, ctx.metadata)
        ctx.temp_data["embedding_request"] = embedding_request

        response = self.mock_embedding_service.execute(embedding_request)

        ctx.complete()
        duration_ms = (time.time() - stage_start) * 1000
        ctx.record_stage_telemetry(stage_name, duration_ms, status="COMPLETED")

        logger.info(f"[Pipeline Event] Stage Completed: {stage_name} in {duration_ms:.2f}ms")
        logger.info(f"[Pipeline Event] Pipeline Finished [{ctx.pipeline_id}] in {ctx.execution_time_ms}ms across {len(ctx.stage_history)} completed stages.")

        # Attach telemetry data to response metrics
        if response.metrics:
            response.metrics["execution_time_ms"] = ctx.execution_time_ms
            response.metrics["stage_history"] = ctx.stage_history

        return response
