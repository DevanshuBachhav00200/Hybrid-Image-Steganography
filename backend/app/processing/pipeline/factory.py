from app.processing.pipeline.encoding_pipeline import EncodingPipeline


class PipelineFactory:
    """
    Factory class for instantiating process pipelines (Encode, Decode, Comparison).
    """

    @staticmethod
    def get_encoding_pipeline() -> EncodingPipeline:
        """Instantiate and return EncodingPipeline orchestrator."""
        return EncodingPipeline()

    @staticmethod
    def get_decoding_pipeline():
        """Instantiate and return DecodingPipeline orchestrator (placeholder)."""
        raise NotImplementedError("Decoding pipeline factory not implemented yet.")

    @staticmethod
    def get_comparison_pipeline():
        """Instantiate and return ComparisonPipeline orchestrator (placeholder)."""
        raise NotImplementedError("Comparison pipeline factory not implemented yet.")
