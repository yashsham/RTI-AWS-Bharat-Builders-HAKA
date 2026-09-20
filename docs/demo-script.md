# RTIKit 3-Minute Hackathon Demo Script

> **Title:** RTIKit — Plain-Language Right to Information Assistant  
> **Target Duration:** 3 minutes (180 seconds)  
> **Sample Query for Demo:** "The road outside my house was repaired last year but the pothole is back. Who approved the work, and what was the budget?"

---

## Timeline & Script Breakdown

### 0:00 – 0:20 | The Problem
*(Visual: Screen showing news clippings or photos of broken public infrastructure/potholes, transitioning to a blank RTI form)*

**Speaker:**  
"In India, every citizen has the constitutional right to demand information from government authorities under the Right to Information Act 2005. But in practice, millions of citizens never use it. Why? They don't know which department to address, what specific questions to ask, or what legal protections apply. A vague RTI application is easily ignored or rejected."

---

### 0:20 – 0:40 | The Solution (Introducing RTIKit)
*(Visual: RTIKit Homepage with paper-and-ink aesthetic, clean hero banner)*

**Speaker:**  
"Meet **RTIKit** — an intelligent assistant built to bridge this gap. You describe your problem in everyday language. RTIKit retrieves verified statutory clauses from the RTI Act, identifies the right public authority, and formats a ready-to-file formal application."

---

### 0:40 – 1:50 | Live Demo
*(Visual: Clicking the 'Pothole / Road Repair' example chip, then clicking 'Draft My RTI Application')*

**Speaker:**  
"Let's see it in action. I'll select a common citizen issue: *'The road outside my house was repaired last year but the pothole is back. Who approved the work and what was the budget?'*"

*(Visual: Pointing out the live vertical Step Timeline as Strands Agent executes tools)*

**Speaker:**  
"Watch the agent working in real time. First, `find_authority` matches topic keywords against our corpus, identifying the **Municipal Corporation / PWD Engineering Division**. Next, `lookup_rti_provision` searches the RTI Act gazette text, retrieving Sections 2(f), 6(1), 6(2), 7(1), 19(1), and 19(3)."

*(Visual: Streamed text appearing token by token, followed by the two-column Result View)*

**Speaker:**  
"And here is our result! On the left, we have a beautifully formatted, ready-to-print formal RTI application. Notice how the questions are specific and answerable: asking for certified work orders, completion certificates, contractor payment vouchers, and warranty periods."

*(Visual: Hovering over and clicking a citation chip like `§6(2)`. The Citation Side Sheet slides in)*

**Speaker:**  
"Here is our key differentiator — **The Trust Principle**. The AI is strictly prohibited from stating legal rules from memory. Every claim has an interactive citation chip. Click `§6(2)`, and the exact verbatim gazette text pops up: *'An applicant shall not be required to give any reason for requesting the information.'* You can even verify it directly on India Code!"

*(Visual: Clicking 'Print Application' to show the clean print preview layout, then clicking tabs for 30-Day Timeline and Appeal Roadmap)*

**Speaker:**  
"The user can edit applicant details inline, download a `.txt` file, or print a formal letter. On the right panel, we also provide the statutory 30-day timeline and a First & Second Appeal roadmap."

---

### 1:50 – 2:20 | Technical Architecture
*(Visual: Showing the architecture diagram from `docs/architecture.md`)*

**Speaker:**  
"Under the hood, RTIKit is built as a clean 3-tier system:
1. **AI Core (`ai/`)**: Built using the **Strands Agents SDK** with **Amazon Bedrock** (Claude 3.5 Sonnet) as the model provider. It runs three custom tools backed by our verified RTI Act gazette JSON corpus.
2. **Backend (`backend/`)**: FastAPI server streaming events over Server-Sent Events (SSE).
3. **Frontend (`frontend/`)**: Next.js 15, Motion animations, and Tailwind CSS v4."

---

### 2:20 – 2:45 | AWS Integration & Learning
*(Visual: Highlighting Strands Agent code and Amazon Bedrock integration)*

**Speaker:**  
"By combining the open-source Strands Agents SDK with Amazon Bedrock, we achieved agentic tool calling with live streaming step events. Building this taught us how critical deterministic tool retrieval is when dealing with legal and civic applications."

---

### 2:45 – 3:00 | Impact & Conclusion
*(Visual: Final shot of RTIKit interface with 'Verified, Not Hallucinated' badge)*

**Speaker:**  
"RTIKit turns complex legislation into actionable civic power. Verified from the law, crafted for citizens. Thank you!"
