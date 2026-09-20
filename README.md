# RTIKit — Plain-Language Right to Information Assistant

> **Verified, Not Hallucinated.** Ask the government in the right words. Powered by AWS open-source Strands Agents SDK and Amazon Bedrock.

RTIKit is an intelligent citizen application designed to help ordinary citizens and students draft ready-to-file Right to Information (RTI) applications backed by verbatim clauses from India's RTI Act 2005.

---

## Problem
India's Right to Information Act, 2005 empowers any citizen to demand information from a public authority. In practice, most people never use it because:
1. They don't know which public authority or department to address.
2. They don't know the rules: the fee, the 30-day response deadline, the 48-hour life/liberty rule, or how to appeal.
3. They don't know how to word the request, leading to vague queries that get rejected or answered with "information not available".
4. When ignored or refused, they don't know the first-appeal roadmap.

## Solution
A citizen describes their problem in everyday language (e.g., *"The road outside my house was repaired last year but the pothole is back. Who approved the work and what was the budget?"*). RTIKit returns:
- A **ready-to-file formal RTI application** with specific, objective questions requesting certified public records.
- A **plain-language explanation of every legal point**, with interactive citation chips (`§6(2)`, `§7(1)`) linked directly to official verbatim gazette text.
- A **statutory 30-day response timeline** and first/second appeal roadmap.

---

## Agent Architecture

```mermaid
graph TD
    User["Citizen (Browser UI)"] -->|POST /api/rti/draft (SSE)| Backend["FastAPI Backend (Port 8000)"]
    Backend -->|run_rti_agent()| Agent["Strands AI Agent"]
    
    subgraph Agentic Tool Execution
        Agent -->|1. find_authority| AuthTool["find_authority Tool"]
        Agent -->|2. lookup_rti_provision| ProvisionTool["lookup_rti_provision Tool"]
        Agent -->|3. draft_application| DraftTool["draft_application Tool"]
        
        AuthTool --> AuthoritiesDB[("authorities.json (30+ mappings)")]
        ProvisionTool --> ActDB[("rti_act_2005.json (Verbatim Act Text)")]
    end
    
    Agent -->|Yield Stream Events| Backend
    Backend -->|SSE Stream: step, token, result| User
    
    subgraph UI Presentation Layer
        User -->|1. Live Render| LiveTimeline["Live Step Timeline"]
        User -->|2. Formatted Render| LetterCard["Formal RTI Letter Preview"]
        User -->|3. Click § Citation| CitationSheet["Verbatim Clause Side Sheet"]
    end
```

---

## AWS Services & Open Source Projects Used

1. **Strands Agents SDK (`strands-agents`)**: AWS open-source Python framework used to build our agent with tool decorators, step lifecycle handlers, and streaming event callbacks.
2. **Amazon Bedrock**: Model provider powering agent reasoning using Bedrock Claude models (configurable via `BEDROCK_MODEL_ID`).

---

## Repo Structure

```
rtikit/
├── frontend/          # Next.js 15 App Router + TypeScript + Tailwind v4 + Motion
├── backend/           # FastAPI HTTP + SSE streaming layer
├── ai/                # Strands Agent, tools, verbatim corpus, evals
├── docs/              # Architecture & demo script
├── .env.example
├── .gitignore
├── LICENSE            # MIT
└── README.md
```

---

## Setup & Execution

### 1. `ai/` Package Setup
```bash
cd ai
pip install -e .
python -m pytest tests
python -m rtikit_ai.cli "The road outside my home has potholes"
```

### 2. `backend/` Setup
```bash
cd backend
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. `frontend/` Setup
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```env
# AWS & Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
BEDROCK_MODEL_ID=us.anthropic.claude-3-5-sonnet-20021022-v1:0

# Model Provider: bedrock | anthropic | ollama | mock
MODEL_PROVIDER=bedrock

# Backend Settings
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000

# Frontend Settings
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MOCK=0
```

---

## Testing

Run unit & smoke test suites:

```bash
# AI Package Tests (Tools & 5 Benchmark Queries)
pytest ai/tests

# Backend API Tests
pytest backend/tests
```

---

## Challenges Encountered

- **Strict Citation Coupling**: Ensuring the LLM does not hallucinate legal section numbers from memory required enforcing tool retrieval before claim synthesis.
- **Real-Time Step Visibility**: Translating Strands Agent execution tool events into SSE streams for an animated UI step timeline.

---

## What I Learned

<!-- PROMPT_FOR_USER_EXPERIENCE -->
*Fill in your personal learnings from building RTIKit:*
- **Agent Tool Execution**: *[Add your experience with Strands Agents SDK tool calling and event streams]*
- **AWS Bedrock Integration**: *[Add your notes on configuring Amazon Bedrock Claude models]*
- **Civic Tech UX**: *[Add your thoughts on designing accessible legal AI tools for citizens]*

---

## Limitations

- **State-Specific RTI Rules**: While the RTI Act 2005 is a central legislation, application fee amounts and postal order payment methods vary by state.
- **Not Legal Advice**: RTIKit provides informational drafting assistance and is not a substitute for formal legal counsel.

---

## Future Improvements

- Deployment on AWS Lambda + API Gateway using Mangum.
- S3-hosted dynamic gazette corpus updating automatically with state RTI amendments.
- Multi-lingual output support (Hindi, Tamil, Marathi, Bengali).
