import time
from typing import Dict, Any
from app.core.config import settings
from app.core.logging import logger
from app.processing.morse.service import MorseService
from app.processing.aes.service import AESService
from app.processing.binary.service import BinaryService
from app.processing.payload.service import PayloadService
from app.processing.payload.embedding_manager import EmbeddingManager
from app.processing.pipeline.mock_embedding import MockEmbeddingService


def check_pipeline_health() -> Dict[str, Any]:
    """
    Perform diagnostic health checks across all preprocessing modules, services, and configurations.
    Returns structured pipeline health report dictionary.
    """
    logger.info("Executing Pipeline Diagnostics & Health Check...")
    start_time = time.time()

    modules_status = {}
    
    # 1. Module Availability Checks
    try:
        MorseService()
        modules_status["morse_service"] = "OPERATIONAL"
    except Exception as exc:
        modules_status["morse_service"] = f"FAILED: {str(exc)}"

    try:
        AESService()
        modules_status["aes_service"] = "OPERATIONAL"
    except Exception as exc:
        modules_status["aes_service"] = f"FAILED: {str(exc)}"

    try:
        BinaryService()
        modules_status["binary_service"] = "OPERATIONAL"
    except Exception as exc:
        modules_status["binary_service"] = f"FAILED: {str(exc)}"

    try:
        PayloadService()
        modules_status["payload_service"] = "OPERATIONAL"
    except Exception as exc:
        modules_status["payload_service"] = f"FAILED: {str(exc)}"

    try:
        EmbeddingManager()
        modules_status["embedding_manager"] = "OPERATIONAL"
    except Exception as exc:
        modules_status["embedding_manager"] = f"FAILED: {str(exc)}"

    try:
        MockEmbeddingService()
        modules_status["mock_embedding_service"] = "OPERATIONAL"
    except Exception as exc:
        modules_status["mock_embedding_service"] = f"FAILED: {str(exc)}"

    # 2. Configuration Check
    config_valid = bool(settings.APP_NAME and settings.MAX_UPLOAD_SIZE > 0)

    # 3. Overall Pipeline Health Status
    all_operational = all(status == "OPERATIONAL" for status in modules_status.values()) and config_valid
    overall_status = "HEALTHY" if all_operational else "DEGRADED"

    duration_ms = round((time.time() - start_time) * 1000, 2)

    health_report = {
        "status": overall_status,
        "timestamp": time.time(),
        "diagnostic_duration_ms": duration_ms,
        "module_availability": modules_status,
        "configuration_check": {
            "app_name": settings.APP_NAME,
            "version": settings.API_VERSION,
            "max_upload_size_bytes": settings.MAX_UPLOAD_SIZE,
            "is_valid": config_valid,
        },
    }

    logger.info(f"Pipeline Diagnostics Finished: Health Status [{overall_status}] in {duration_ms}ms")
    return health_report
