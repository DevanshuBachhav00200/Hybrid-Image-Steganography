from app.processing.payload.builder import PayloadBuilder
from app.processing.payload.embedding_manager import EmbeddingManager


class EmbeddingPreparationFactory:
    """
    Factory providing instances of PayloadBuilder and EmbeddingManager.
    """

    @staticmethod
    def get_payload_builder() -> PayloadBuilder:
        """Instantiate and return PayloadBuilder."""
        return PayloadBuilder()

    @staticmethod
    def get_embedding_manager() -> EmbeddingManager:
        """Instantiate and return EmbeddingManager."""
        return EmbeddingManager()
