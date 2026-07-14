# Case Study: AI Workflow Automation Dashboard

## Overview

AI Workflow Automation Dashboard is a full-stack portfolio project that demonstrates how repetitive business workflows can be converted into structured, traceable and AI-assisted internal tools.

The project showcases full-stack delivery with Next.js, React, TypeScript and .NET 8, while also demonstrating layered backend architecture, SQLite persistence, REST API design, AI provider abstraction, human-in-the-loop review and professional internal-tool UX.

## Context

Many teams still manage repetitive processes through Excel, email, WhatsApp, documents or unstructured notes. These tools are flexible, but they often make internal work harder to standardize, review and track.

This project was built as a portfolio project to explore how those workflows can be modeled as structured requests, processed through AI-assisted drafting and reviewed by a human before the final output is saved.

## Problem

Repetitive internal workflows often create practical business issues:

- Duplicated manual work
- Inconsistent outputs
- Lack of traceability
- Hard-to-review information
- Repetitive administrative effort

When requests arrive in unstructured formats, it becomes harder to know what was requested, what context was used, what output was generated and who reviewed the final version.

## Solution

AI Workflow Automation Dashboard provides a simple internal-tool experience for managing workflow requests from input to reviewed output.

Users can create structured requests, generate mock AI-assisted outputs, review and edit the result, save a human-reviewed version, track status and keep the request available in history.

The goal is not to replace human judgment. The goal is to demonstrate a workflow where AI helps produce a first draft while the user remains responsible for review, editing and approval.

## Product Workflow

The implemented workflow follows these steps:

1. Create a structured workflow request.
2. Add business context, notes and desired output type.
3. Generate a mock AI-assisted output.
4. Review the generated result.
5. Save the reviewed output.
6. Archive the completed request.
7. Preserve the request in history with status, timestamps and output separation.

## Technical Approach

The frontend is built with Next.js, React and TypeScript. It includes dashboard, request creation, request history and guided request detail views. The frontend calls the backend through a typed API service and uses environment-based API configuration.

The backend is built with .NET 8 Web API and follows a simple layered structure:

- API: controllers and HTTP request handling
- Application: workflow use cases, validation and orchestration
- Domain: workflow request entity and enums
- Infrastructure: EF Core persistence and AI provider implementations

SQLite is used for local persistence through Entity Framework Core. This keeps the project easy to run while still preserving request history, generated output, reviewed output and status changes across backend restarts.

The API exposes endpoints for listing workflow requests, retrieving detail, creating requests, generating output, saving reviewed output and archiving requests.

## AI Workflow Design

AI is treated as a workflow component, not as uncontrolled automation.

The project currently uses a mock AI provider for local demo purposes. The provider is hidden behind an AI workflow processor abstraction so a real provider can be added later without rewriting the workflow lifecycle.

The design keeps original input, generated output and reviewed output separated. This makes the AI-generated draft traceable while still allowing the final reviewed version to be controlled by the user.

## Human-in-the-Loop Review

Human review is a core part of the product design.

The app separates the generated draft from the reviewed output so the user can edit, approve and save the final version intentionally. This keeps the user in control, allows business context to be corrected before approval and makes the process easier to audit.

The request detail page uses a guided workflow so users see the relevant step at each stage: captured request, generated output, human review and archive.

## Quality and Validation

The project includes backend tests for core workflow behavior, including request creation, mock generation, review validation, archiving and not-found behavior.

Manual validation covers the full lifecycle from request creation to archive. The frontend includes loading, empty and error states, along with toast notifications for global action feedback.

SQLite persistence supports request history after backend restarts, which is important for demonstrating traceability and reviewed output retention.

## Key Engineering Decisions

- Use a mock AI provider first to keep the project easy to run locally.
- Use SQLite for local persistence instead of keeping request history only in memory.
- Keep authentication out of the MVP so the project stays focused on workflow automation.
- Keep the backend simple and layered across API, Application, Domain and Infrastructure.
- Store generated output separately from reviewed output.
- Prioritize a complete, polished MVP over unnecessary features.

## What This Project Demonstrates

- Business process automation thinking
- Full-stack delivery
- Clean API boundaries
- Layered backend architecture
- AI-driven workflow design
- Human-in-the-loop product thinking
- Internal-tool UX
- Practical documentation and portfolio presentation

## Future Improvements

- Real AI provider integration through the existing abstraction
- Authentication for real multi-user usage
- Advanced search and filters
- Export to PDF or document formats
- Deployment
- More automated tests
- More workflow templates

## Summary

This project demonstrates how manual business processes can be turned into structured, traceable and AI-assisted internal tools using modern full-stack engineering practices.
