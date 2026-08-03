"""
FastAPI dependency injection utilities.
"""
from app.core.config import settings, Settings


def get_settings() -> Settings:
    """
    Dependency provider for application settings.
    """
    return settings
