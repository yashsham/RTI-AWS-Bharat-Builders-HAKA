"""Application configuration settings for RTIKit Backend."""
import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    aws_region: str = "us-east-1"
    bedrock_model_id: str = "us.anthropic.claude-3-5-sonnet-20021022-v1:0"
    model_provider: str = "bedrock"
    port: int = 8000
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
