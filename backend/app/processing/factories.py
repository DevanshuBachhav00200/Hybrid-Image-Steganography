from app.core.enums import AlgorithmType
from app.processing.interfaces import EmbeddingStrategy, SecurityStrategy, MetricStrategy


class EmbeddingFactory:
    """
    Factory class for instantiating concrete EmbeddingStrategy implementations (LSB, DCT, DWT).
    """
    @staticmethod
    def get_embedding_strategy(algorithm: AlgorithmType) -> EmbeddingStrategy:
        """Returns the appropriate EmbeddingStrategy instance for specified algorithm type."""
        raise NotImplementedError(f"Embedding strategy factory for '{algorithm}' not implemented yet.")


class SecurityFactory:
    """
    Factory class for instantiating concrete SecurityStrategy implementations.
    """
    @staticmethod
    def get_security_strategy() -> SecurityStrategy:
        """Returns the SecurityStrategy instance."""
        raise NotImplementedError("Security strategy factory not implemented yet.")


class MetricsFactory:
    """
    Factory class for instantiating concrete MetricStrategy implementations.
    """
    @staticmethod
    def get_metric_strategy() -> MetricStrategy:
        """Returns the MetricStrategy instance."""
        raise NotImplementedError("Metrics strategy factory not implemented yet.")
