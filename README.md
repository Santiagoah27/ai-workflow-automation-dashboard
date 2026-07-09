# AI Workflow Automation Dashboard

A full-stack portfolio project that demonstrates how businesses can automate repetitive internal workflows using structured forms, AI-assisted processing, request tracking and editable generated outputs.

## Purpose

This project shows how practical AI-driven development can be applied to real business workflows such as document generation, internal reports, client responses, process summaries and repetitive administrative tasks.

The goal is to demonstrate business value, clean software architecture, full-stack development, AI workflow design and a professional user experience for internal tools.

## Problem

Many small businesses and internal teams still manage repetitive processes through Excel, email, WhatsApp, documents or unstructured notes.

This usually creates:

- Duplicated manual work
- Inconsistent outputs
- Lack of traceability
- Slow response times
- Hard-to-review information
- Repetitive administrative effort

## Solution

AI Workflow Automation Dashboard allows users to create structured workflow requests, generate AI-assisted outputs, review and edit the result, track request status and keep a history of processed work.

The application follows a human-in-the-loop approach where AI helps generate structured outputs, but the user keeps control by reviewing, editing and approving the final result.

## Core Features

- Dashboard with workflow request summary
- Create structured business requests
- Generate AI-assisted outputs
- Review and edit generated results
- Track request status
- View request history
- Copy generated output
- Keep original input and reviewed output separated
- Handle AI generation failures gracefully

## Example Use Cases

- Generate professional emails from unstructured notes
- Create internal reports from business context
- Summarize client requests
- Produce action plans
- Standardize repetitive documentation
- Support administrative workflows
- Convert manual processes into structured digital workflows

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript

### Backend

- .NET 8 Web API
- C#
- Entity Framework Core

### Database

- SQLite for local demo
- PostgreSQL optional later

### AI Layer

- AI workflow processor abstraction
- Mock AI provider for local development
- Real AI provider integration later through environment variables

### Documentation

- README.md
- AGENTS.md
- docs/project-brief.md
- docs/architecture.md
- docs/decisions.md

## Architecture Overview

The project will follow a simple full-stack architecture:

- Frontend app for dashboard, forms, request history and review flow
- Backend API for workflow request management
- Application layer for use cases
- Domain layer for core entities and enums
- Infrastructure layer for persistence and AI provider implementation
- AI provider abstraction to support mock and real providers

## Initial Project Structure

```text
frontend/
  app/
  components/
  features/
  lib/
  services/
  types/
backend/
  src/
    Api/
    Application/
    Domain/
    Infrastructure/
  tests/
docs/
```

## Local Setup

### Prerequisites

- Node.js
- npm
- .NET SDK with `net8.0` targeting support

### Frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

The frontend runs on the default Next.js development URL:

```text
http://localhost:3000
```

Create a local environment file from the example and point it at the backend:

```bash
cp .env.example .env.local
```

Required frontend environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:5080
```

### Backend

```bash
cd backend
dotnet build AiWorkflowAutomationDashboard.slnx
dotnet run --project src/Api/Api.csproj
```

The backend API runs on:

```text
http://localhost:5080
```

Swagger is available in local development:

```text
http://localhost:5080/swagger
```

Initial backend MVP endpoints:

- GET /api/workflow-requests
- GET /api/workflow-requests/{id}
- POST /api/workflow-requests
- POST /api/workflow-requests/{id}/generate
- PUT /api/workflow-requests/{id}/review
- PUT /api/workflow-requests/{id}/archive

The current backend uses in-memory persistence for the first working workflow flow. Data is reset when the API process stops.

In local development, the in-memory backend starts with fake demo workflow requests so the dashboard, history and detail screens are immediately useful for demos.

### Run The Full App Locally

Terminal 1:

```bash
cd backend
dotnet run --project src/Api/Api.csproj
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

Manual test flow:

1. Start the backend.
2. Start the frontend.
3. Open Dashboard.
4. Create a new workflow request.
5. Navigate to the request detail page.
6. Follow the guided workflow from captured request to AI-generated output.
7. Start human review and edit the reviewed output.
8. Save reviewed output.
9. Continue to archive and archive the request.
10. Confirm the request appears correctly in History.

## Demo Data

The Development environment seeds realistic fake workflow requests into the in-memory repository:

- Client onboarding summary
- Internal weekly report
- Professional email response
- Process improvement action plan

This data is for local demos only and resets when the backend process stops.

## Screenshots

Screenshots should be captured later for GitHub, LinkedIn Featured and portfolio use.

Planned screenshot checklist:

- Dashboard
- New Request form
- Request History
- Request Detail before generation
- Request Detail after generation
- Request Detail after review

## What This Project Demonstrates

- Full-stack engineering
- AI-driven workflow automation
- Business process thinking
- Clean API design
- Reusable frontend architecture
- Human-in-the-loop AI workflows
- Maintainable backend architecture
- Portfolio-ready documentation
- Practical software delivery

## Initial MVP Scope

The first MVP will include:

- Dashboard page
- New request page
- Request history page
- Request detail page
- Mock AI generation
- Editable reviewed output
- Status tracking
- Copy output action

The first MVP will not include:

- Authentication
- Payments
- Multi-tenancy
- File upload
- OCR
- Advanced analytics
- Notifications
- Chatbot
- Deployment
- Docker
- CI/CD

## Status

In development.
