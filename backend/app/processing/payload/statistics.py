from app.processing.payload.models import PayloadStatistics
from app.processing.payload.constants import HEADER_BITS_SIZE


def calculate_statistics(binary_bitstream: str, preparation_time_ms: float = 0.0) -> PayloadStatistics:
    """
    Calculate statistical metrics for the given binary bitstream.
    """
    total_bits = len(binary_bitstream) if binary_bitstream else 0
    total_bytes = total_bits // 8
    header_bits = HEADER_BITS_SIZE if total_bits >= HEADER_BITS_SIZE else 0
    payload_bits = max(0, total_bits - header_bits)

    ones_count = binary_bitstream.count("1") if binary_bitstream else 0
    zeros_count = binary_bitstream.count("0") if binary_bitstream else 0

    return PayloadStatistics(
        total_bits=total_bits,
        total_bytes=total_bytes,
        header_bits=header_bits,
        payload_bits=payload_bits,
        estimated_embedding_percentage=0.0,
        estimated_compression_ratio=1.0,
        preparation_time_ms=round(preparation_time_ms, 2),
    )
