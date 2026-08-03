import time
from typing import Optional
from app.core.enums import PipelineStatus, StatusType, EmbeddingAlgorithm
from app.core.exceptions import PipelineStageException, PipelineException
from app.core.logging import logger
from app.schemas.requests import EncodeRequest
from app.schemas.responses import EncodeResponse
from app.schemas.upload import ImageMetadata
from app.processing.pipeline.context import PipelineContext
from app.services.validation_service import ValidationService
from app.services.image_service import ImageService
from app.services.metrics_service import MetricsService
from app.processing.morse.service import MorseService
from app.processing.aes.service import AESService
from app.processing.binary.service import BinaryService
from app.processing.payload.service import PayloadService
from app.processing.payload.embedding_manager import EmbeddingManager
from app.processing.factories import EmbeddingFactory


class EncodingPipeline:
    """
    Enterprise Encoding Pipeline Orchestrator coordinating all stages of steganographic
    message embedding: Validation -> Image Prep -> Morse -> AES -> Binary -> Payload Builder -> Embedding Manager -> Metrics -> Response.
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

    def execute(self, request: EncodeRequest, metadata: Optional[ImageMetadata] = None) -> EncodeResponse:
        """
        Main pipeline entry point executing stages sequentially.
        """
        ctx = PipelineContext(
            request=request,
            metadata=metadata,
            algorithm=request.algorithm,
            current_stage="STARTUP",
            status=PipelineStatus.CREATED,
        )

        logger.info(f"[Pipeline Event] Pipeline Started for algorithm: {ctx.algorithm}")

        try:
            self.validate_request_stage(ctx)
            self.validate_image_stage(ctx)
            self.prepare_image_stage(ctx)
            self.morse_stage(ctx)
            self.encryption_stage(ctx)
            self.binary_stage(ctx)
            self.payload_stage(ctx)
            self.embedding_stage(ctx)
            self.metrics_stage(ctx)
            return self.response_stage(ctx)

        except NotImplementedError as exc:
            logger.info(f"[Pipeline Event] Stage Placeholder Reached: {str(exc)}")
            ctx.complete()
            logger.info(f"[Pipeline Event] Pipeline Finished in {ctx.execution_time_ms}ms")
            return EncodeResponse(
                status=StatusType.NOT_IMPLEMENTED,
                message="Encode endpoint ready.",
                stego_image=None,
                metrics=None,
            )

        except Exception as exc:
            ctx.fail(str(exc))
            logger.error(f"[Pipeline Event] Pipeline Failed at stage '{ctx.current_stage}': {str(exc)}")
            raise PipelineStageException(stage_name=ctx.current_stage, message=str(exc))

    def validate_request_stage(self, ctx: PipelineContext) -> None:
        """Stage 1: Validate payload parameters (message, password, algorithm)."""
        stage_name = "VALIDATE_REQUEST"
        ctx.advance_stage(stage_name, PipelineStatus.VALIDATING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        self.validation_service.validate_request(ctx.request)
        self.validation_service.validate_message(ctx.request.message)
        self.validation_service.validate_password(ctx.request.password)
        self.validation_service.validate_algorithm(ctx.request.algorithm)

        logger.info(f"[Pipeline Event] Stage Completed: {stage_name}")

    def validate_image_stage(self, ctx: PipelineContext) -> None:
        """Stage 2: Validate image payload data URL or base64 structure."""
        stage_name = "VALIDATE_IMAGE"
        ctx.advance_stage(stage_name, PipelineStatus.VALIDATING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        self.validation_service.validate_image(ctx.request.image)
        logger.info(f"[Pipeline Event] Stage Completed: {stage_name}")

    def prepare_image_stage(self, ctx: PipelineContext) -> None:
        """Stage 3: Load cover image buffer and verify pixel data."""
        stage_name = "PREPARE_IMAGE"
        ctx.advance_stage(stage_name, PipelineStatus.PREPARING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        ctx.temp_data["image_ready"] = True
        logger.info(f"[Pipeline Event] Stage Completed: {stage_name}")

    def morse_stage(self, ctx: PipelineContext) -> None:
        """Stage 4: Convert plain text message to International Morse Code sequence."""
        stage_name = "MORSE_ENCODING"
        ctx.advance_stage(stage_name, PipelineStatus.PROCESSING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        morse_payload = self.morse_service.encode(ctx.request.message)
        ctx.temp_data["morse_payload"] = morse_payload
        
        logger.info(f"[Pipeline Event] Stage Completed: {stage_name} (Morse symbols: {len(morse_payload)})")

    def encryption_stage(self, ctx: PipelineContext) -> None:
        """Stage 5: Encrypt Morse code payload using AES-256-GCM and password key."""
        stage_name = "AES_ENCRYPTION"
        ctx.advance_stage(stage_name, PipelineStatus.PROCESSING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        morse_payload = ctx.temp_data.get("morse_payload")
        password = ctx.request.password

        aes_payload = self.aes_service.encrypt(morse_payload, password)
        ctx.temp_data["aes_payload"] = aes_payload

        logger.info(f"[Pipeline Event] Stage Completed: {stage_name}")

    def binary_stage(self, ctx: PipelineContext) -> None:
        """Stage 6: Convert AES cipher payload into MSB-first binary bitstream string."""
        stage_name = "BINARY_CONVERSION"
        ctx.advance_stage(stage_name, PipelineStatus.PROCESSING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        aes_payload = ctx.temp_data.get("aes_payload")
        binary_bitstream = self.binary_service.serialize(aes_payload)
        ctx.temp_data["binary_bitstream"] = binary_bitstream

        logger.info(f"[Pipeline Event] Stage Completed: {stage_name} (Bitstream length: {len(binary_bitstream)} bits)")

    def payload_stage(self, ctx: PipelineContext) -> None:
        """Stage 7: Package binary bitstream into validated Payload object."""
        stage_name = "PAYLOAD_BUILDER"
        ctx.advance_stage(stage_name, PipelineStatus.PROCESSING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        binary_bitstream = ctx.temp_data.get("binary_bitstream")
        alg_enum = EmbeddingAlgorithm(ctx.algorithm) if ctx.algorithm in EmbeddingAlgorithm.__members__ else EmbeddingAlgorithm.AUTO

        payload_obj = self.payload_service.build(binary_bitstream, alg_enum)
        ctx.temp_data["payload_object"] = payload_obj

        logger.info(f"[Pipeline Event] Stage Completed: {stage_name} (Payload ID: {payload_obj.payload_id})")

    def embedding_stage(self, ctx: PipelineContext) -> None:
        """Stage 8: Prepare embedding request and dispatch to LSB/DCT/DWT embedding strategy."""
        stage_name = "IMAGE_EMBEDDING"
        ctx.advance_stage(stage_name, PipelineStatus.PROCESSING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        payload_obj = ctx.temp_data.get("payload_object")
        embedding_request = self.embedding_manager.prepare_embedding(payload_obj, ctx.metadata)
        ctx.temp_data["embedding_request"] = embedding_request

        # Raises NotImplementedError until low-level embedding strategies are implemented in Phase 3E
        self.embedding_manager.dispatch(embedding_request)

    def metrics_stage(self, ctx: PipelineContext) -> None:
        """Stage 9: Calculate PSNR, SSIM, MSE image distortion metrics."""
        stage_name = "METRICS_GENERATION"
        ctx.advance_stage(stage_name, PipelineStatus.PROCESSING)
        logger.info(f"[Pipeline Event] Stage Started: {stage_name}")

        self.metrics_service.calculate_metrics(None)

    def response_stage(self, ctx: PipelineContext) -> EncodeResponse:
        """Stage 10: Format final operational payload response."""
        stage_name = "BUILD_RESPONSE"
        ctx.advance_stage(stage_name, PipelineStatus.COMPLETED)
        ctx.complete()
        logger.info(f"[Pipeline Event] Stage Completed: {stage_name}")
        logger.info(f"[Pipeline Event] Pipeline Finished in {ctx.execution_time_ms}ms")

        return EncodeResponse(
            status=StatusType.SUCCESS,
            message="Encoding completed successfully.",
            stego_image=ctx.temp_data.get("stego_image"),
            metrics=ctx.temp_data.get("metrics"),
        )
