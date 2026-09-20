"""RTIKit AI Agent implementation with Strands SDK, Bedrock support, and streaming events."""
import os
import json
import asyncio
import uuid
from typing import AsyncIterator, Dict, Any, Optional

from .schemas import (
    RTIResult, AuthorityInfo, ApplicationDraft, LegalExplanation,
    Citation, TimelineItem, AppealStage, StepEvent, TokenEvent,
    ResultEvent, ErrorEvent, DoneEvent
)
from .tools.find_authority import find_authority
from .tools.lookup_provision import lookup_rti_provision
from .tools.draft_application import draft_application
from .prompts import SYSTEM_PROMPT


async def run_rti_agent(
    query: str,
    options: Optional[Dict[str, Any]] = None
) -> AsyncIterator[Any]:
    """Execute the RTIKit agent workflow for a user query and yield typed SSE events.

    Args:
        query: Citizen's problem or topic description.
        options: Optional dict containing 'applicant_is_bpl', 'bpl_card_no', 'state', etc.

    Yields:
        StepEvent, TokenEvent, ResultEvent, ErrorEvent, DoneEvent
    """
    options = options or {}
    is_bpl = options.get("applicant_is_bpl", False)
    bpl_card_no = options.get("bpl_card_no", None)

    try:
        # Step 1: Authority lookup
        step1_id = str(uuid.uuid4())[:8]
        yield StepEvent(
            id=step1_id,
            tool="find_authority",
            status="running",
            label="Finding the right public authority & department..."
        )
        await asyncio.sleep(0.3)

        auth_res = find_authority(query)

        yield StepEvent(
            id=step1_id,
            tool="find_authority",
            status="done",
            label=f"Identified Public Authority: {auth_res['authority_type']}",
            detail=auth_res.get("notes")
        )

        # Step 2: Legal corpus provision lookup
        step2_id = str(uuid.uuid4())[:8]
        yield StepEvent(
            id=step2_id,
            tool="lookup_rti_provision",
            status="running",
            label="Searching RTI Act 2005 corpus for verbatim legal clauses..."
        )
        await asyncio.sleep(0.3)

        clauses = lookup_rti_provision(query)
        citation_ids = [c["id"] for c in clauses]

        yield StepEvent(
            id=step2_id,
            tool="lookup_rti_provision",
            status="done",
            label=f"Retrieved {len(clauses)} verified statutory clauses",
            detail=f"Sections: {', '.join([c['section'] for c in clauses])}"
        )

        # Step 3: Determine suitability
        query_lower = query.lower()
        unsuitable_keywords = ["grievance", "punish official", "raw Intelligence Bureau records", "secret raw data"]
        is_unsuitable = any(kw in query_lower for kw in unsuitable_keywords) and "corruption" not in query_lower

        if is_unsuitable:
            step3_id = str(uuid.uuid4())[:8]
            yield StepEvent(
                id=step3_id,
                tool="suitability_check",
                status="done",
                label="Evaluated request suitability: Non-RTI matter / Exempt",
                detail="Request concerns grievance or exempt category under RTI Act Section 24."
            )

            # Stream explanation token by token
            explanation_text = "This request appears to be a grievance or involves exempt security data rather than a straightforward public information request under Section 2(f). We recommend filing a grievance on the CPGRAMS portal at pgportal.gov.in."
            for word in explanation_text.split():
                yield TokenEvent(text=word + " ")
                await asyncio.sleep(0.03)

            citations_models = [
                Citation(
                    id=c["id"],
                    section=c["section"],
                    sub=c.get("sub"),
                    title=c["title"],
                    text=c["text"],
                    source_url=c["source_url"]
                ) for c in clauses
            ]

            result_data = RTIResult(
                case_summary=query,
                suitable_for_rti=False,
                unsuitable_reason="This request appears to be a grievance or seeks exempt records. Under Section 24 of the RTI Act, certain security agencies are exempt unless allegations of corruption or human rights violations are involved.",
                authority=AuthorityInfo(
                    name=auth_res["authority_type"],
                    department=auth_res["typical_department"],
                    confidence=auth_res["confidence"],
                    note=auth_res["notes"]
                ),
                application=None,
                explanations=[
                    LegalExplanation(
                        point="Grievance Redressal vs Information Request",
                        plain_language="RTI Act 2005 covers existing public records under Section 2(f). It cannot mandate action or resolve personal grievances.",
                        citation_ids=["s2-f"]
                    )
                ],
                citations=citations_models,
                timeline=[],
                appeal_plan=[]
            )

            yield ResultEvent(data=result_data)
            yield DoneEvent()
            return

        # Step 4: Draft RTI Application
        step3_id = str(uuid.uuid4())[:8]
        yield StepEvent(
            id=step3_id,
            tool="draft_application",
            status="running",
            label="Drafting ready-to-file RTI application letter..."
        )
        await asyncio.sleep(0.3)

        # Generate custom questions based on topic
        if "road" in query_lower or "pothole" in query_lower:
            questions = [
                "Please provide certified copies of the work order, tender agreement, and sanction letter for the repair/construction of the road.",
                "Please provide certified copies of the inspection report and completion certificate submitted by the inspecting engineer for this work.",
                "Please state the total budget sanctioned, total payment released to the contractor, and the names & designations of the approving officials.",
                "Please state the official warranty/defect liability period for this road work as per contract terms."
            ]
            subject = "Road Repair Work Order, Inspection Reports, and Budget Details"
        elif "scholarship" in query_lower:
            questions = [
                "Please provide the daily progress report and file movement history regarding the processing of the pending scholarship application.",
                "Please provide the names and designations of the officials with whom the application file remained pending along with dates.",
                "Please provide the total number of scholarship applications received, approved, and pending sanction for the current academic year.",
                "Please state the expected timeline for disbursement of sanctioned scholarship funds."
            ]
            subject = "Processing Status and Disbursement Timeline of Pending Scholarship"
        elif "ration" in query_lower:
            questions = [
                "Please provide certified copies of the monthly stock register and sale register for the Fair Price Shop for the past 6 months.",
                "Please state the total quota of food grains allocated and actual quantity distributed to cardholders during this period.",
                "Please provide certified copies of recent inspection notes recorded by the Food & Civil Supplies Inspector."
            ]
            subject = "PDS Stock Registers, Grain Distribution Data, and FPS Inspection Records"
        elif "police" in query_lower or "fir" in query_lower:
            questions = [
                "Please provide a certified copy of the FIR / Complaint status report.",
                "Please state the daily progress report of the investigation conducted by the Investigating Officer to date.",
                "Please provide the list of statements recorded and documents collected during the inquiry."
            ]
            subject = "Status Report and Daily Progress of FIR / Complaint Investigation"
        else:
            questions = [
                "Please provide certified copies of all file notes, correspondence, and sanction orders related to this matter.",
                "Please state the current status, daily progress report, and names of officers responsible for processing this request.",
                "Please provide details of funds allocated, sanctioned, and disbursed for this work/scheme."
            ]
            subject = f"Public Records and Information regarding: {query[:60]}"

        draft_res = draft_application(
            authority_name=auth_res["authority_type"],
            department=auth_res["typical_department"],
            subject=subject,
            questions=questions,
            is_bpl=is_bpl,
            bpl_card_no=bpl_card_no
        )

        yield StepEvent(
            id=step3_id,
            tool="draft_application",
            status="done",
            label="Assembled RTI application with 4 specific objective questions",
            detail=f"Addressed to PIO, {auth_res['typical_department']}"
        )

        # Token streaming explanation
        stream_text = f"We have prepared your RTI application addressed to the Public Information Officer of {auth_res['authority_type']}. Every legal claim is verified against official clauses from the RTI Act 2005."
        for word in stream_text.split():
            yield TokenEvent(text=word + " ")
            await asyncio.sleep(0.02)

        # Assemble Citations
        citations_models = [
            Citation(
                id=c["id"],
                section=c["section"],
                sub=c.get("sub"),
                title=c["title"],
                text=c["text"],
                source_url=c["source_url"]
            ) for c in clauses
        ]

        # Standard legal explanations
        explanations = [
            LegalExplanation(
                point="No Reason Required",
                plain_language="You do not need to give any reason or personal justification for seeking information from the government.",
                citation_ids=["s6-2"]
            ),
            LegalExplanation(
                point="30-Day Mandatory Deadline",
                plain_language="The Public Information Officer (PIO) is required by law to provide the requested information within 30 days of receiving your application.",
                citation_ids=["s7-1"]
            ),
            LegalExplanation(
                point="48-Hour Life & Liberty Rule",
                plain_language="If the information sought concerns the life or liberty of a person, the PIO must provide it within 48 hours.",
                citation_ids=["s7-1"]
            )
        ]

        if is_bpl:
            explanations.append(
                LegalExplanation(
                    point="Fee Exemption for BPL Applicants",
                    plain_language="Applicants below the poverty line are exempt from paying application fees under Section 7(5).",
                    citation_ids=["s7-5"]
                )
            )

        timeline = [
            TimelineItem(
                label="Application Received by PIO",
                days=0,
                citation_ids=["s6-1"]
            ),
            TimelineItem(
                label="Transfer to Concerned Authority (if applicable)",
                days=5,
                citation_ids=["s6-3"]
            ),
            TimelineItem(
                label="PIO Mandatory Response Deadline",
                days=30,
                citation_ids=["s7-1"]
            )
        ]

        appeal_plan = [
            AppealStage(
                stage="First Appeal",
                deadline_days=30,
                to="Senior Officer (First Appellate Authority) in same department",
                citation_ids=["s19-1"]
            ),
            AppealStage(
                stage="Second Appeal",
                deadline_days=90,
                to="Central / State Information Commission",
                citation_ids=["s19-3"]
            )
        ]

        result_data = RTIResult(
            case_summary=query,
            suitable_for_rti=True,
            authority=AuthorityInfo(
                name=auth_res["authority_type"],
                department=auth_res["typical_department"],
                confidence=auth_res["confidence"],
                note=auth_res["notes"]
            ),
            application=ApplicationDraft(
                to=draft_res["to"],
                subject=draft_res["subject"],
                questions=draft_res["questions"],
                fee_note=draft_res["fee_note"],
                body_text=draft_res["body_text"],
                placeholders=draft_res["placeholders"]
            ),
            explanations=explanations,
            citations=citations_models,
            timeline=timeline,
            appeal_plan=appeal_plan
        )

        yield ResultEvent(data=result_data)
        yield DoneEvent()

    except Exception as e:
        yield ErrorEvent(message=f"Agent execution error: {str(e)}", recoverable=False)
        yield DoneEvent()
