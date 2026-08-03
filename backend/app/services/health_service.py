from typing import Dict, Any
from app.core.config import settings
from app.core.constants import MSG_HEALTH_OK, MSG_STATUS_ONLINE
from app.core.logging import logger


class HealthService:
    """
    Service providing backend operational status, system health, and version information.
    """

    def system_status(self) -> Dict[str, Any]:
        """Returns application system status details."""
        logger.info("Executing HealthService.system_status()")
        return {
            "status": MSG_HEALTH_OK,
            "app_name": settings.APP_NAME,
            "debug": settings.DEBUG,
        }

    def backend_status(self) -> Dict[str, Any]:
        """Returns API online status indicator."""
        logger.info("Executing HealthService.backend_status()")
        return {
            "backend": MSG_STATUS_ONLINE,
            "version": settings.API_VERSION,
        }

    def version(self) -> Dict[str, Any]:
        """Returns version details."""
        logger.info("Executing HealthService.version()")
        return {
            "version": settings.API_VERSION,
            "api_prefix": settings.API_V1_STR,
        }
