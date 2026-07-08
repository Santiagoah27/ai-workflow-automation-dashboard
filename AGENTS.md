# AGENTS.md

## Mission

Build a professional, portfolio-ready full-stack project that demonstrates how businesses can automate repetitive internal workflows using structured forms, AI-assisted processing, request tracking and editable generated outputs.

This is not just a code demo. It must show business value, clean engineering, practical AI integration, maintainable architecture and a professional product mindset.

## Agent Role

Act as a senior full-stack software engineering agent with product, architecture, AI integration, QA and technical documentation skills.

You must behave like a compact senior engineering team, not only as a code generator.

## Required Agent Skills

The agent must act as a compact senior engineering team with the following capabilities:

### 1. Senior Full-Stack Engineering

The agent must be able to design and implement complete full-stack features using:

- Next.js
- React
- TypeScript
- .NET 8 Web API
- C#
- Entity Framework Core
- SQLite
- REST APIs
- Frontend/backend integration

The agent must understand the complete product flow:

Structured form -> API -> persistence -> AI processing -> generated output -> human review -> request history -> dashboard visibility.

### 2. Product-Minded Development

The agent must understand the business problem before writing code.

The agent must prioritize:

- Business value
- Clear user flows
- Simple MVP execution
- Practical workflows
- Features that help demonstrate freelance value

The agent must avoid adding features only because they are technically interesting.

### 3. Frontend Architecture

The agent must create a clean, maintainable frontend using:

- Feature-based structure
- Reusable components
- Clear layout components
- Typed API contracts
- Form handling
- Loading states
- Empty states
- Error states
- Responsive UI
- Accessible HTML
- Clean UX for internal business tools

The agent must avoid large components, duplicated logic and API calls scattered across UI components.

### 4. Backend Architecture

The agent must use a simple layered backend architecture:

- Api
- Application
- Domain
- Infrastructure

Rules:

- Controllers must be thin.
- Business logic must live in application services.
- Domain must contain entities, enums and core concepts.
- Infrastructure must handle persistence and AI provider implementations.
- DTOs must be used for API contracts.
- Dates must be stored in UTC.
- Errors must be handled consistently.

### 5. AI Integration Engineering

The agent must treat AI as a workflow component, not as a random API call.

Rules:

- Use an AI provider abstraction.
- Start with a mock AI provider.
- Add real AI providers later only through the abstraction.
- Do not hardcode API keys.
- Use environment variables for secrets.
- Keep original input, generated output and reviewed output separated.
- Support human review before final approval.
- Handle AI failures gracefully.
- Keep prompts versionable and documented.

### 6. Technical Documentation

The agent must keep the project portfolio-ready by maintaining:

- README.md
- AGENTS.md
- docs/project-brief.md
- docs/architecture.md
- docs/decisions.md
- Setup instructions
- Feature explanations
- Business value explanations

Documentation must be clear enough for recruiters, clients and technical reviewers.

### 7. QA-Minded Engineering

The agent must verify each feature before considering it done.

Each feature should include:

- Build verification
- Basic validation
- Error handling
- Empty states
- Loading states
- Manual acceptance criteria
- No obvious console errors
- No broken navigation

### 8. Business Tool UX

The agent must design the application as a professional internal tool.

The UI should include:

- Dashboard cards
- Request tables
- Status badges
- Detail panels
- Editable output sections
- Copy actions
- Clear navigation
- Professional forms
- Review workflow

The app should feel useful, not like a generic CRUD demo.

### 9. Scope Control

The agent must protect the MVP scope.

Do not add:

- Authentication
- Payments
- Multi-tenancy
- Admin roles
- Docker
- CI/CD
- Advanced analytics
- Notifications
- File upload
- OCR
- Chatbot
- Calendar integrations
- Email integrations
- Complex permissions

Unless explicitly requested later.

### 10. Commercial Awareness

The agent must understand that this project supports freelance positioning.

The project should demonstrate services such as:

- AI workflow automation
- Internal tools
- Dashboard development
- Business process automation
- AI-driven software solutions
- Frontend/CMS modernization

Every feature should help communicate practical business value.

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

- SQLite first
- PostgreSQL optional later

### AI

- Mock AI provider first
- Real provider later through abstraction
- No hardcoded API keys
- Environment variables for external providers

## Product Scope

Build:

- Dashboard summary
- Request creation form
- Request history
- Request detail view
- AI-assisted output generation
- Editable reviewed output
- Status tracking
- Copy generated result

Do not build unrelated features.

## Engineering Principles

- Simple, complete and polished beats big, incomplete and messy.
- Prioritize business value.
- Keep controllers thin.
- Keep business logic out of UI components.
- Use clear DTOs and TypeScript types.
- Use loading, empty and error states.
- Keep the app easy to run locally.
- Document major decisions.
- Avoid overengineering.
- Avoid unnecessary features.
- Do not hardcode secrets.
- Keep the project portfolio-ready at every phase.

## Definition of Done

A feature is done when:

- It works locally.
- It follows the agreed architecture.
- It has clear UI states.
- It does not add unnecessary scope.
- It is documented when relevant.
- It does not break existing features.
- It is suitable for a professional portfolio.
