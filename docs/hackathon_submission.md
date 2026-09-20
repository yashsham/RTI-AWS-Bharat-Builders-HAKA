# RTIKit — Official Hackathon Submission

**Project Name:** RTIKit — Plain-Language Right to Information Assistant  
**GitHub Repository:** [https://github.com/yashsham/RTI-AWS-Bharat-Builders-HAKA](https://github.com/yashsham/RTI-AWS-Bharat-Builders-HAKA)  
**Track:** Build It / Ship It (AWS Open-Source Stack + Amazon Bedrock)  
**Tagline:** Verified, Not Hallucinated. Ask the government in the right words. Powered by AWS Strands Agents SDK and Amazon Bedrock.

---

## 01. Idea and Impact

### Problem Addressed
India's Right to Information (RTI) Act 2005 empowers 1.4 billion citizens to demand public records from government authorities. However, over **95% of citizens never file an RTI** because:
1. They don't know which public authority (Municipal, PWD, Police, Health, Education) to address.
2. They don't know statutory rules: ₹10 fee, 30-day response deadline, 48-hour life/liberty clause, or appeal rights.
3. Vague queries (e.g. *"Why is my road broken?"*) get rejected. Authorities require requests for specific certified records (measurement books, work orders, payment vouchers).

### What Changes for People
RTIKit bridges this civic gap. An ordinary citizen inputs a problem in everyday language. RTIKit outputs:
- A **ready-to-file formal RTI application** asking for certified public records.
- Interactive **verbatim citation chips (`§6(2)`, `§7(1)`)** linked directly to official gazette text.
- A **statutory 30-day timeline** and First/Second Appeal roadmap.

---

## 02. Built on AWS

### AWS Stack & Open-Source Tools Used
1. **Strands Agents SDK (`strands-agents`)**: AWS open-source Python framework used to build our agent with custom tool decorators (`find_authority`, `lookup_rti_provision`, `draft_application`), step lifecycle tracking, and streaming callbacks.
2. **Amazon Bedrock**: Model provider powering agentic reasoning via `us.anthropic.claude-3-5-sonnet-20021022-v1:0` (`BEDROCK_MODEL_ID`).
3. **AWS Architecture**:
   - `ai/`: Strands Agent & deterministic corpus retrieval.
   - `backend/`: FastAPI HTTP + Server-Sent Events (SSE) streaming server.
   - `frontend/`: Next.js 15 App Router + Tailwind CSS v4 + Framer Motion.

---

## 03. Learning

### What We Learned
1. **Agentic Tool Orchestration with Strands SDK**: We learned how to build multi-tool agentic pipelines with AWS Strands Agents SDK, handling tool schemas, step lifecycle events, and SSE streaming to the client.
2. **Deterministic Legal Retrieval**: We learned that legal & civic AI must avoid relying on internal LLM parameter weight memory for statutes. By implementing a strict corpus lookup tool (`lookup_rti_provision`), we guaranteed **zero-hallucination legal citations**.
3. **SSE Token & Step Synchronization**: Balancing background agent execution steps (`step` event) with streaming draft text (`token` event) over Server-Sent Events (SSE) taught us key patterns in real-time UI/UX state machine design.

---

## 04. The Execution

### Working Deliverables & Verified Proof
- **Complete Working System**: 100% functional end-to-end flow (Input ➔ Step Timeline ➔ RTI Draft Letter ➔ Verbatim Citation Side Sheet ➔ Print/Export).
- **Test Coverage**: 7/7 automated pytest tests passing (`pytest ai/tests`) covering tool execution and 5 real-world citizen benchmark queries.
- **Dual Mode Execution**:
  - **Live Mode**: Connects live to FastAPI backend + Amazon Bedrock Strands Agent.
  - **Offline Mock Mode**: `NEXT_PUBLIC_MOCK=1` enables zero-dependency UI demonstration.
- **Clean Repository & Code Standard**: Pushed clean commit history to GitHub, complete with architecture diagrams and MIT license.

---

## 05. The Demo Video (3-Minute Script Structure)

- **0:00 – 0:20 | The Problem**: Show real-world civic issues (potholes, pending scholarships, ration card delays) and explain why citizens struggle to file RTIs.
- **0:20 – 0:40 | The Solution**: Introduce RTIKit and its Paper & Ink UI aesthetic.
- **0:40 – 1:50 | Live Feature Walkthrough**:
  - Submit query: *"Road repaired 5 months ago broke again"*.
  - Show live agent step timeline executing `find_authority`, `lookup_rti_provision`, and `draft_application`.
  - Review the generated formal letter & click the `§6(2)` citation chip to display the verbatim gazette text in the side sheet.
  - Demonstrate inline editing and one-click PDF printing.
- **1:50 – 2:20 | Technical Architecture & AWS**: Highlight the AWS Strands Agents SDK integration and FastAPI SSE streaming layer.
- **2:20 – 3:00 | Impact & Summary**: Emphasize how RTIKit turns statutory rights into actionable citizen power.
