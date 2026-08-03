import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings powered by Pydantic Settings.
    Loads variables from environment variables or .env file.
    """
    APP_NAME: str = "Hybrid Image Steganography System API"
    API_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    API_V1_STR: str = "/api/v1"
    
    # CORS Configuration
    ALLOWED_ORIGINS: Union[List[str], str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Logging & Storage
    LOG_LEVEL: str = "INFO"
    TEMP_DIRECTORY: str = "app/temp"
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB default

    @field_validator("ALLOWED_ORIGINS", mode="before")
    def parse_allowed_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [item.strip() for item in v.split(",") if item.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
