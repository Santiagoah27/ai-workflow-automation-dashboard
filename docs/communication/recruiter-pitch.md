# Recruiter Pitch

## 30-Second Pitch

AI Workflow Automation Dashboard is a full-stack portfolio project built with Next.js, React, TypeScript and .NET 8. It demonstrates how repetitive business workflows can be captured as structured requests, processed through mock AI-assisted generation, reviewed by a human and preserved in request history with SQLite persistence.

The project shows frontend architecture, REST API design, layered backend structure, AI provider abstraction, human-in-the-loop workflow design and backend tests for core workflow behavior.

## 60-Second Pitch

AI Workflow Automation Dashboard is a full-stack internal-tool project that models a complete workflow lifecycle: create request, generate mock AI output, review and edit the result, save the human-approved version, archive the request and keep it available in history.

The frontend is built with Next.js, React and TypeScript, using typed API calls and a professional business-tool UI. The backend is a .NET 8 Web API with a layered API, Application, Domain and Infrastructure structure. SQLite and EF Core provide local persistence, and the AI workflow processor abstraction keeps mock AI generation separate from the application workflow so a real provider can be added later.

The project was designed to demonstrate practical engineering judgment: clean boundaries, a focused MVP, human review, traceability, documentation, screenshots and tests around the core backend workflow.

## Technical Talking Points

- Frontend architecture: Next.js app structure, feature folders, reusable UI components, typed API service and clear loading, empty and error states.
- Backend architecture: .NET 8 Web API with API, Application, Domain and Infrastructure layers.
- Persistence: SQLite through Entity Framework Core, including local request history across backend restarts.
- AI abstraction: `IAiWorkflowProcessor` with a mock provider for local demo behavior and future real-provider integration.
- Human review: generated output and reviewed output are stored separately to preserve traceability.
- Testing: backend xUnit tests cover request creation, generation, review validation, archive flow, not-found behavior and mock AI output variations.
- Documentation: README, architecture docs, decision log, case study, screenshots and reusable portfolio copy.

## What I Would Improve Next

- Add a real AI provider through the existing abstraction.
- Add more automated tests, including API integration and selected frontend behavior tests.
- Add deployment when the hosting target is defined.
- Add authentication if the project becomes a real multi-user app.
- Add more workflow templates for common business processes.
