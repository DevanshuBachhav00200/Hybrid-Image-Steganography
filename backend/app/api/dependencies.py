"""
FastAPI dependency injection providers.
Service instances are injected into endpoints via FastAPI Depends to prevent direct service-to-service coupling.
"""
from app.core.config import settings, Settings
from app.services.encoding_service import EncodingService
from app.services.decoding_service import DecodingService
from app.services.comparison_service import ComparisonService
from app.services.metrics_service import MetricsService
from app.services.image_service import ImageService
from app.services.validation_service import ValidationService
from app.services.health_service import HealthService
from app.services.report_service import ReportService
from app.processing.morse.service import MorseService


def get_settings() -> Settings:
    """Dependency provider for application settings."""
    return settings


def get_encoding_service() -> EncodingService:
    """Dependency provider for EncodingService."""
    return EncodingService()


def get_decoding_service() -> DecodingService:
    """Dependency provider for DecodingService."""
    return DecodingService()


def get_comparison_service() -> ComparisonService:
    """Dependency provider for ComparisonService."""
    return ComparisonService()


def get_metrics_service() -> MetricsService:
    """Dependency provider for MetricsService."""
    return MetricsService()


def get_image_service() -> ImageService:
    """Dependency provider for ImageService."""
    return ImageService()


def get_validation_service() -> ValidationService:
    """Dependency provider for ValidationService."""
    return ValidationService()


def get_health_service() -> HealthService:
    """Dependency provider for HealthService."""
    return HealthService()


def get_report_service() -> ReportService:
    """Dependency provider for ReportService."""
    return ReportService()


def get_morse_service() -> MorseService:
    """Dependency provider for MorseService."""
    return MorseService()
