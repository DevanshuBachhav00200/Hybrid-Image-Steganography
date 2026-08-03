"""
FastAPI dependency injection providers.
Services are provided via dependencies to allow clean unit testing and mock overrides.
"""
from app.core.config import settings, Settings
from app.services.encoding_service import EncodingService
from app.services.decoding_service import DecodingService
from app.services.comparison_service import ComparisonService
from app.services.metrics_service import MetricsService


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
