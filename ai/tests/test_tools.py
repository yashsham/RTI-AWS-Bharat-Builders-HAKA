"""Unit tests for RTIKit tools (find_authority, lookup_provision, draft_application)."""
import json
from pathlib import Path
from rtikit_ai.tools.find_authority import find_authority
from rtikit_ai.tools.lookup_provision import lookup_rti_provision
from rtikit_ai.tools.draft_application import draft_application


def test_find_authority_road():
    res = find_authority("The road outside my home has potholes and asphalt broken")
    assert "Municipal" in res["authority_type"] or "PWD" in res["authority_type"]
    assert res["confidence"] in ["high", "medium"]


def test_find_authority_scholarship():
    res = find_authority("My college scholarship grant has been pending for 8 months")
    assert "Education" in res["authority_type"] or "Social Justice" in res["authority_type"]


def test_lookup_provision_section_6():
    res = lookup_rti_provision("request for information", section="6")
    assert len(res) > 0
    sec_ids = [c["id"] for c in res]
    assert "s6-1" in sec_ids or "s6-2" in sec_ids


def test_lookup_provision_30_days():
    res = lookup_rti_provision("30 days deadline to respond")
    assert len(res) > 0
    found_7 = any(c["section"] == "7" for c in res)
    assert found_7


def test_draft_application_structure():
    res = draft_application(
        authority_name="Municipal Corporation of Delhi",
        department="Engineering Division",
        subject="Road Repair Works and Work Orders",
        questions=["What was the total budget sanctioned?", "Provide certified copy of completion certificate."]
    )
    assert "Municipal Corporation of Delhi" in res["to"]
    assert len(res["questions"]) == 2
    assert "Section 6(1)" in res["body_text"]
    assert "Section 6(2)" in res["body_text"]
    assert len(res["placeholders"]) > 0


def test_draft_application_bpl():
    res = draft_application(
        authority_name="District Magistrate Office",
        department="Revenue Wing",
        subject="Land Mutation Records",
        questions=["Provide copy of mutation order."],
        is_bpl=True,
        bpl_card_no="BPL/12345/2024"
    )
    assert "Below Poverty Line" in res["fee_note"]
    assert "BPL/12345/2024" in res["fee_note"]
