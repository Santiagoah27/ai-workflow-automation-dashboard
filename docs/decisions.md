# Decision Log

This file records important technical and product decisions made during the project.

## Decision 001: Start with a portfolio-ready MVP

The first version will focus on a simple but complete workflow automation experience instead of building a large product.

Reason:

A small, polished and complete project is better for portfolio and freelance positioning than a large unfinished application.

## Decision 002: Use mock AI provider first

The project will start with a mock AI workflow processor before adding a real AI provider.

Reason:

This keeps the app easy to run locally, avoids API key requirements, prevents unnecessary costs and demonstrates proper AI provider abstraction.

## Decision 003: Keep human review in the workflow

Generated output and reviewed output will be stored separately.

Reason:

AI-generated content should be reviewed by a human before being considered final. This also demonstrates responsible AI workflow design.

## Decision 004: Exclude authentication from the first MVP

Authentication will not be included in the initial MVP.

Reason:

The goal is to demonstrate workflow automation, AI-assisted generation and request tracking. Authentication would add complexity without improving the first portfolio version.

## Decision 005: Use SQLite for local development

SQLite will be used first for the local demo.

Reason:

It makes the project easier to run, review and demonstrate without external database setup.

## Decision 006: Use in-memory persistence for the initial backend MVP

The first working backend flow uses an in-memory workflow request repository.

Reason:

This allows the backend request lifecycle, mock AI generation, review flow and archive flow to be tested before introducing EF Core and SQLite. The repository abstraction keeps the later database implementation straightforward without adding persistence complexity too early.

## Decision 007: Enable Swagger for local backend testing

Swagger is enabled for local development.

Reason:

Swagger provides a simple way to test the backend API endpoints directly and verify the request lifecycle independently from the frontend.

## Decision 008: Configure frontend API access through an environment variable

The frontend uses `NEXT_PUBLIC_API_BASE_URL` for the backend API base URL.

Reason:

This keeps API configuration out of UI components, supports local development cleanly and avoids hardcoded backend URLs throughout the frontend.

## Decision 009: Use local-only CORS for frontend development

The backend allows requests from the local Next.js development origins only.

Reason:

The frontend needs to call the backend during local development, but the project should avoid broad CORS settings before deployment requirements are known.

## Decision 010: Keep the UI business-tool focused

The frontend polish prioritizes clear workflow visibility, professional forms, readable status badges and traceable request detail views.

Reason:

The project is intended to communicate practical freelance value. A restrained internal-tool experience is more useful for this portfolio project than a decorative or marketing-heavy interface.

## Decision 011: Seed fake development data for demos

The in-memory repository seeds realistic fake workflow requests in Development.

Reason:

The dashboard and history screens should be meaningful immediately during demos, while avoiding real business data and keeping persistence simple.

## Decision 012: Avoid advanced analytics in the MVP

The dashboard uses simple status summary cards instead of advanced charts or analytics.

Reason:

The MVP should demonstrate workflow automation and human review clearly without adding visual or technical complexity that is not required for the current product story.
