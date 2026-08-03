import time
import uuid
from app.core.enums import PayloadStatus, EmbeddingAlgorithm
from app.core.logging import logger
from app.processing.binary.bitstream import bits_to_bytes
from app.processing.binary.header import parse_header
from app.processing.payload.models import Payload
from app.processing.payload.validator import validate_payload_structure
from app.processing.payload.statistics import calculate_statistics
from app.processing.payload.metadata import build_embedding_metadata
from app.processing.payload.exceptions import PayloadValidationException


class PayloadBuilder:
    """
    Payload Builder component responsible for constructing and validating Payload objects.
    """

    @staticmethod
    def build(binary_bitstream: str, algorithm: EmbeddingAlgorithm = EmbeddingAlgorithm.AUTO) -> Payload:
        """
        Construct a validated Payload container object from raw binary bitstream.
        """
        start_time = time.time()
        logger.info(f"PayloadBuilder: Packaging binary bitstream for algorithm: {algorithm}")

        validation_result = validate_payload_structure(binary_bitstream)
        if not validation_result.is_valid:
            error_msg = "; ".join(validation_result.errors)
            logger.error(f"PayloadBuilder Validation Error: {error_msg}")
            raise PayloadValidationException(f"Payload validation failed: {error_msg}")

        header_bytes = bits_to_bytes(binary_bitstream[:128])
        header_model = parse_header(header_bytes)

        payload_bytes_len = len(binary_bitstream) // 8
        prep_time_ms = (time.time() - start_time) * 1000

        stats = calculate_statistics(binary_bitstream, prep_time_ms)
        metadata = build_embedding_metadata(algorithm, payload_bytes_len, len(binary_bitstream))

        payload_obj = Payload(
            payload_id=str(uuid.uuid4()),
            timestamp=time.time(),
            algorithm=algorithm,
            binary_data=binary_bitstream,
            payload_size_bits=len(binary_bitstream),
            payload_size_bytes=payload_bytes_len,
            header=header_model,
            metadata=metadata,
            statistics=stats,
            status=PayloadStatus.READY,
        )

        logger.info(f"PayloadBuilder: Successfully built Payload [{payload_obj.payload_id}] ({payload_obj.payload_size_bits} bits)")
        return payload_obj
