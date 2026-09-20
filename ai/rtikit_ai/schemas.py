"""Pydantic schemas for RTIKit AI requests, final outputs, and streaming events."""
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class AuthorityInfo(BaseModel):
    name: str = Field(..., description="Likely public authority type (e.g., Municipal Corporation / PWD)")
    department: str = Field(..., description="Specific department or wing")
    confidence: Literal["high", "medium", "low"] = Field(default="medium", description="Confidence level of mapping")
    note: str = Field(..., description="Guidance notes for locating the specific PIO")


class ApplicationDraft(BaseModel):
    to: str = Field(..., description="Addressed PIO header, e.g. 'The Public Information Officer, Municipal Corporation'")
    subject: str = Field(..., description="Formal subject line under RTI Act 2005")
    questions: List[str] = Field(..., description="Numbered specific, objective questions requesting documents/records")
    fee_note: str = Field(..., description="Note regarding payment of application fee or BPL exemption")
    body_text: str = Field(..., description="Complete plain-text RTI application ready for printing/filing")
    placeholders: List[str] = Field(..., description="List of placeholders left for user (e.g. ['Applicant Name', 'Address', 'Date'])")


class LegalExplanation(BaseModel):
    point: str = Field(..., description="Title of the legal point (e.g., 'No Reason Required')")
    plain_language: str = Field(..., description="Plain-language explanation of the legal rule")
    citation_ids: List[str] = Field(..., description="IDs of cited sections from corpus, e.g. ['s6-2']")


class Citation(BaseModel):
    id: str = Field(..., description="Unique citation identifier, e.g., 's6-2'")
    section: str = Field(..., description="Section number, e.g. '6'")
    sub: Optional[str] = Field(None, description="Subsection, e.g. '2' or 'h'")
    title: str = Field(..., description="Official title of the section")
    text: str = Field(..., description="Verbatim official text of the clause")
    source_url: str = Field(..., description="Source reference link (e.g. India Code link)")


class TimelineItem(BaseModel):
    label: str = Field(..., description="Milestone label, e.g. 'PIO must respond'")
    days: int = Field(..., description="Timeline duration in days (e.g., 30, or 2 for 48 hours)")
    citation_ids: List[str] = Field(..., description="Associated section citation IDs, e.g. ['s7-1']")


class AppealStage(BaseModel):
    stage: str = Field(..., description="Appeal stage, e.g. 'First Appeal' or 'Second Appeal'")
    deadline_days: int = Field(..., description="Deadline in days from trigger event")
    to: str = Field(..., description="Appellate Authority designation")
    citation_ids: List[str] = Field(..., description="Associated section citation IDs, e.g. ['s19-1']")


class RTIResult(BaseModel):
    case_summary: str = Field(..., description="Summary of the citizen's query and goal")
    suitable_for_rti: bool = Field(..., description="True if request is an RTI matter; False if non-RTI or exempt")
    unsuitable_reason: Optional[str] = Field(None, description="Explanation if request is not suitable for RTI")
    authority: AuthorityInfo = Field(..., description="Target public authority details")
    application: Optional[ApplicationDraft] = Field(None, description="Drafted RTI application (None if unsuitable)")
    explanations: List[LegalExplanation] = Field(default_factory=list, description="List of verified legal points")
    citations: List[Citation] = Field(default_factory=list, description="Verbatim citations retrieved from corpus")
    timeline: List[TimelineItem] = Field(default_factory=list, description="Key statutory response timeline items")
    appeal_plan: List[AppealStage] = Field(default_factory=list, description="First and second appeal roadmap")
    disclaimer: str = Field(
        default="Disclaimer: RTIKit generates information requests based on the RTI Act 2005. This is for informational purposes and does not constitute formal legal advice.",
        description="Legal disclaimer"
    )


# Agent Streaming Event Schemas

class StepEvent(BaseModel):
    type: Literal["step"] = "step"
    id: str
    tool: str
    status: Literal["running", "done", "error"]
    label: str
    detail: Optional[str] = None


class TokenEvent(BaseModel):
    type: Literal["token"] = "token"
    text: str


class ResultEvent(BaseModel):
    type: Literal["result"] = "result"
    data: RTIResult


class ErrorEvent(BaseModel):
    type: Literal["error"] = "error"
    message: str
    recoverable: bool = False


class DoneEvent(BaseModel):
    type: Literal["done"] = "done"
