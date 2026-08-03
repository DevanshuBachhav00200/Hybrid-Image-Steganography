import pytest
from app.processing.pipeline.context import PipelineContext
from app.processing.pipeline.status import PipelineStatus
from app.processing.pipeline.encoding_pipeline import EncodingPipeline
from app.processing.pipeline.factory import PipelineFactory
from app.schemas.requests import EncodeRequest
from app.core.exceptions import PipelineStageException


def test_pipeline_context_lifecycle():
    ctx = PipelineContext(algorithm="LSB")
    assert ctx.status == PipelineStatus.CREATED
    assert ctx.current_stage == "INITIALIZATION"

    ctx.advance_stage("VALIDATING", PipelineStatus.VALIDATING)
    assert ctx.status == PipelineStatus.VALIDATING
    assert ctx.current_stage == "VALIDATING"

    ctx.complete()
    assert ctx.status == PipelineStatus.COMPLETED
    assert ctx.execution_time_ms is not None


def test_pipeline_factory():
    pipeline = PipelineFactory.get_encoding_pipeline()
    assert isinstance(pipeline, EncodingPipeline)


def test_encoding_pipeline_execution():
    pipeline = EncodingPipeline()
    payload = EncodeRequest(
        message="Secret Message",
        password="StrongPassword123!",
        algorithm="LSB",
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    )

    response = pipeline.execute(payload)
    assert response.status == "NOT_IMPLEMENTED"
    assert response.message == "Encode endpoint ready."


def test_encoding_pipeline_exception_propagation():
    pipeline = EncodingPipeline()
    payload = EncodeRequest(
        message="Secret Message",
        password="StrongPassword123!",
        algorithm="LSB",
        image="data:image/png;base64,sample",
    )

    # Monkeypatch validate_request_stage to simulate stage failure
    def mock_fail_stage(ctx):
        raise ValueError("Simulated stage error")

    pipeline.validate_request_stage = mock_fail_stage

    with pytest.raises(PipelineStageException) as excinfo:
        pipeline.execute(payload)
    assert "Simulated stage error" in str(excinfo.value)
