"""Request and response models for RTIKit backend API."""
from typing import Optional
from pydantic import BaseModel, Field


class DraftRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="Citizen query or problem description (10-2000 characters)"
    )
    state: Optional[str] = Field(None, description="State or Union Territory name")
    language: Optional[str] = Field("en", description="Preferred language code")
    applicant_is_bpl: Optional[bool] = Field(False, description="Whether applicant belongs to Below Poverty Line category")
    bpl_card_no: Optional[str] = Field(None, description="Optional BPL card number")


class ProvisionResponse(BaseModel):
    id: str
    section: str
    sub: Optional[str] = None
    title: str
    text: str
    source_url: str


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"
    model_provider: str
