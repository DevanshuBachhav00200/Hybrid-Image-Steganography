from typing import Optional
from app.core.enums import EmbeddingAlgorithm, StatusType
from app.core.logging import logger
from app.schemas.upload import ImageMetadata
from app.processing.payload.models import Payload, EmbeddingRequest, EmbeddingResponse
from app.processing.payload.exceptions import EmbeddingPreparationException, AlgorithmSelectionException


class EmbeddingManager:
    """
    Embedding Manager component selecting steganography algorithms and building EmbeddingRequest objects.
    """

    def select_algorithm(self, payload: Payload, request_alg: EmbeddingAlgorithm) -> EmbeddingAlgorithm:
        """
        Determine target steganographic embedding algorithm (LSB, DCT, DWT).
        If AUTO is requested, selects optimal algorithm based on payload size.
        """
        if request_alg == EmbeddingAlgorithm.AUTO or request_alg is None:
            # Default algorithm resolution rule: select LSB for standard payloads
            logger.info("EmbeddingManager: AUTO algorithm requested. Selected LSB as default.")
            return EmbeddingAlgorithm.LSB

        if request_alg not in (EmbeddingAlgorithm.LSB, EmbeddingAlgorithm.DCT, EmbeddingAlgorithm.DWT):
            raise AlgorithmSelectionException(f"Unsupported embedding algorithm '{request_alg}'.")

        return request_alg

    def build_embedding_request(
        self,
        payload: Payload,
        algorithm: EmbeddingAlgorithm,
        image_metadata: Optional[ImageMetadata] = None,
    ) -> EmbeddingRequest:
        """
        Construct EmbeddingRequest container object for steganography embedding modules.
        """
        if not payload or not payload.binary_data:
            raise EmbeddingPreparationException("Cannot build embedding request from empty or invalid payload.")

        return EmbeddingRequest(
            payload_id=payload.payload_id,
            algorithm=algorithm,
            binary_data=payload.binary_data,
            image_metadata=image_metadata,
        )

    def prepare_embedding(
        self,
        payload: Payload,
        image_metadata: Optional[ImageMetadata] = None,
    ) -> EmbeddingRequest:
        """
        Main entry point for preparing embedding request.
        """
        logger.info(f"EmbeddingManager: Preparing embedding request for Payload [{payload.payload_id}]")
        selected_alg = self.select_algorithm(payload, payload.algorithm)
        return self.build_embedding_request(payload, selected_alg, image_metadata)

    def dispatch(self, request: EmbeddingRequest) -> EmbeddingResponse:
        """
        Dispatch embedding request to low-level steganography embedding strategies (LSB / DCT / DWT).
        Raises NotImplementedError until embedding modules are built in Phase 3E.
        """
        logger.info(f"EmbeddingManager: Dispatching request for algorithm {request.algorithm}")
        raise NotImplementedError("Image embedding dispatch stage not implemented yet.")
