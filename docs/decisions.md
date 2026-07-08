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

The backend MVP is not integrated with the frontend yet, so Swagger provides a simple way to test the API endpoints and demonstrate the request lifecycle.
