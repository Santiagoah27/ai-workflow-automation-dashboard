# LinkedIn Post

## Version A: Technical Audience

I built AI Workflow Automation Dashboard as a full-stack portfolio project to explore how repetitive business workflows can be modeled as structured, traceable internal tools.

The app follows a complete workflow:

1. Create a structured request.
2. Add business context, notes and desired output type.
3. Generate a mock AI-assisted draft.
4. Review and edit the result.
5. Save the human-reviewed output.
6. Archive the request.
7. Keep the request available in history.

The stack:

- Next.js, React and TypeScript on the frontend
- .NET 8 Web API on the backend
- SQLite persistence with Entity Framework Core
- Layered backend structure: API, Application, Domain and Infrastructure
- REST API endpoints
- Typed frontend API service
- AI workflow processor abstraction
- Mock AI provider for local development

One of the main design choices was treating AI as a workflow component, not just an API call. The app keeps original input, generated output and reviewed output separate so the user remains in control before anything is considered final.

The project also includes backend tests for the core workflow behavior and documentation with real local screenshots.

This is not a production system or a client project. It is a portfolio project designed to demonstrate practical full-stack engineering, AI workflow design, clean architecture and professional internal-tool UX.

#FullStackDevelopment #NextJS #DotNet #AI #SoftwareEngineering #WorkflowAutomation

## Version B: Business/Client Audience

I built AI Workflow Automation Dashboard as a portfolio project to explore a common business problem: repetitive work often lives across emails, spreadsheets, documents and unstructured notes.

That makes it harder to keep requests consistent, review outputs and understand what happened later.

This project demonstrates a more structured approach:

- Capture a business request through a form.
- Generate a mock AI-assisted first draft.
- Let a human review and edit the result.
- Save the approved output.
- Track the request status.
- Keep the full request available in history.

The goal is not to show AI replacing people. The goal is to show how AI can support a workflow while the user stays in control of the final result.

Technically, the project uses Next.js, React, TypeScript, .NET 8, SQLite and a layered backend architecture. The AI integration is currently mock-based for local demo purposes, with an abstraction that could support a real provider later.

For me, this project connects full-stack engineering with practical business process automation: internal tools, traceable workflows, structured data and human-in-the-loop AI design.

#WorkflowAutomation #FullStackDevelopment #AI #SoftwareEngineering #NextJS #DotNet
