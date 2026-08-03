"""
Processing Pipeline package for orchestrating encoding, decoding, and comparison workflows.
"""
from app.processing.pipeline.context import PipelineContext, PipelineResult
from app.processing.pipeline.status import PipelineStatus
from app.processing.pipeline.encoding_pipeline import EncodingPipeline
from app.processing.pipeline.factory import PipelineFactory
from app.processing.pipeline.mock_embedding import MockEmbeddingService
from app.processing.pipeline.diagnostics import check_pipeline_health

__all__ = [
    "PipelineContext",
    "PipelineResult",
    "PipelineStatus",
    "EncodingPipeline",
    "PipelineFactory",
    "MockEmbeddingService",
    "check_pipeline_health",
]
