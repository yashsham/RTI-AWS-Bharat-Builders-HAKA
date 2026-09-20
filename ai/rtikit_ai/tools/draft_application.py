"""Tool to assemble and format a structured RTI Application letter."""
from typing import List, Dict, Any, Optional

try:
    from strands import tool
except ImportError:
    try:
        from strands_agents import tool
    except ImportError:
        def tool(func):
            return func


@tool
def draft_application(
    authority_name: str,
    department: str,
    subject: str,
    questions: List[str],
    is_bpl: bool = False,
    bpl_card_no: Optional[str] = None,
    state_or_union: str = "Central / General"
) -> Dict[str, Any]:
    """Assemble a formal, ready-to-file RTI application letter.

    Args:
        authority_name: The public authority designation (e.g. 'Municipal Corporation of Delhi' or 'Public Works Department')
        department: The specific department or division
        subject: Concise subject line for the RTI request
        questions: List of clear, specific, objective questions requesting official records/documents
        is_bpl: True if applicant belongs to Below Poverty Line category (exempt from RTI fee)
        bpl_card_no: Optional BPL card/certificate number if applicable
        state_or_union: Target State or Central jurisdiction

    Returns:
        A dictionary with 'to', 'subject', 'questions', 'fee_note', 'body_text', and 'placeholders'.
    """
    to_header = f"The Public Information Officer (PIO),\n{department},\n{authority_name}"

    formatted_questions = []
    for idx, q in enumerate(questions, start=1):
        formatted_questions.append(f"{idx}. {q.strip()}")

    if is_bpl:
        bpl_str = f" (BPL Card No: {bpl_card_no})" if bpl_card_no else ""
        fee_note = f"The applicant belongs to the Below Poverty Line (BPL) category{bpl_str}. As per Section 7(5) of the RTI Act 2005, no application fee is payable."
    else:
        fee_note = "An application fee of Rs. 10/- is attached herewith by way of Postal Order / Demand Draft / Online Payment as prescribed under Section 6(1) of the RTI Act 2005."

    questions_block = "\n".join(formatted_questions)

    body_text = f"""To,
{to_header}

SUBJECT: Application under Section 6(1) of the Right to Information Act, 2005 regarding {subject}.

Sir / Madam,

Kindly provide the following certified information and copies of records under the Right to Information Act, 2005:

{questions_block}

FEE DETAILS:
{fee_note}

DECLARATION:
1. I am a citizen of India.
2. The information sought pertains to public records and does not fall under any of the exemptions specified under Section 8 or Section 9 of the RTI Act 2005.
3. As per Section 6(2) of the RTI Act 2005, no reasons are required to be given for seeking this information.

Place: [YOUR CITY / TOWN]
Date: [DATE OF FILING]

Applicant Details:
Name: [YOUR FULL NAME]
Postal Address: [YOUR COMPLETE MAILING ADDRESS]
Mobile No.: [YOUR PHONE NUMBER]
Email ID: [YOUR EMAIL ADDRESS]
Signature: ______________________
"""

    return {
        "to": to_header,
        "subject": f"Application under RTI Act 2005 regarding {subject}",
        "questions": formatted_questions,
        "fee_note": fee_note,
        "body_text": body_text,
        "placeholders": [
            "YOUR CITY / TOWN",
            "DATE OF FILING",
            "YOUR FULL NAME",
            "YOUR COMPLETE MAILING ADDRESS",
            "YOUR PHONE NUMBER",
            "YOUR EMAIL ADDRESS"
        ]
    }
