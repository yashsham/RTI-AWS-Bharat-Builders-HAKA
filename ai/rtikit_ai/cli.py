"""Command line interface runner for RTIKit AI agent."""
import sys
import asyncio
import argparse
from rtikit_ai.agent import run_rti_agent


async def main():
    parser = argparse.ArgumentParser(description="RTIKit AI Agent CLI Runner")
    parser.add_argument("query", type=str, help="Citizen query or problem description")
    parser.add_argument("--bpl", action="store_true", help="Applicant is below poverty line")
    args = parser.parse_args()

    print(f"\n--- Running RTIKit Agent for Query: '{args.query}' ---\n")

    options = {"applicant_is_bpl": args.bpl}
    async for event in run_rti_agent(args.query, options):
        if event.type == "step":
            print(f"[{event.status.upper()}] Step ({event.tool}): {event.label}")
            if event.detail:
                print(f"       Detail: {event.detail}")
        elif event.type == "token":
            sys.stdout.write(event.text)
            sys.stdout.flush()
        elif event.type == "result":
            print("\n\n=== FINAL RESULT ===")
            res = event.data
            print(f"Suitable for RTI: {res.suitable_for_rti}")
            print(f"Target Authority: {res.authority.name} ({res.authority.department})")
            if res.application:
                print("\n--- DRAFT APPLICATION ---")
                print(res.application.body_text)
            else:
                print(f"\nReason Unsuitable: {res.unsuitable_reason}")
            print(f"\nTotal Citations: {len(res.citations)}")
            for c in res.citations:
                print(f" - [{c.id}] Section {c.section}: {c.title}")
        elif event.type == "error":
            print(f"\n[ERROR]: {event.message}")


if __name__ == "__main__":
    asyncio.run(main())
