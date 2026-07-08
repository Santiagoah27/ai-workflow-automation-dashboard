using AiWorkflowAutomationDashboard.Application.Ai;
using AiWorkflowAutomationDashboard.Domain.Entities;
using AiWorkflowAutomationDashboard.Domain.Enums;

namespace AiWorkflowAutomationDashboard.Infrastructure.Ai;

public sealed class MockAiWorkflowProcessor : IAiWorkflowProcessor
{
    private const string PromptVersion = "mock-workflow-v1";

    public Task<AiWorkflowResult> ProcessAsync(
        WorkflowRequest request,
        CancellationToken cancellationToken = default)
    {
        var output = request.DesiredOutputType switch
        {
            OutputType.ProfessionalEmail => BuildProfessionalEmail(request),
            OutputType.StructuredReport => BuildStructuredReport(request),
            OutputType.ActionPlan => BuildActionPlan(request),
            OutputType.ExecutiveSummary => BuildExecutiveSummary(request),
            OutputType.ClientFacingResponse => BuildClientFacingResponse(request),
            _ => BuildExecutiveSummary(request)
        };

        return Task.FromResult(new AiWorkflowResult(output, PromptVersion));
    }

    private static string BuildProfessionalEmail(WorkflowRequest request)
    {
        return $"""
            Subject: Follow-up regarding {request.Title}

            Hello,

            Thank you for sharing the details with {request.BusinessName}. Based on the available context, the main priority is to address the request clearly, reduce back-and-forth and provide a practical next step.

            Summary:
            {request.Context}

            Recommended response:
            We have reviewed the information provided and recommend moving forward with a structured follow-up that confirms the need, clarifies any missing details and outlines the expected next action.

            Notes considered:
            {request.Notes}

            Best regards,
            {request.BusinessName}
            """;
    }

    private static string BuildStructuredReport(WorkflowRequest request)
    {
        return $"""
            # {request.Title}

            ## Business Context
            {request.Context}

            ## Key Inputs
            {request.Notes}

            ## Observations
            - The request benefits from a structured review process.
            - The source information should remain traceable.
            - The final output should be reviewed before business use.

            ## Recommended Next Step
            Prepare a reviewed version of this report and confirm whether additional business details are required.
            """;
    }

    private static string BuildActionPlan(WorkflowRequest request)
    {
        return $"""
            # Action Plan: {request.Title}

            1. Review the provided business context for accuracy.
            2. Confirm the expected audience and desired outcome.
            3. Convert the raw notes into a clear business-ready format.
            4. Assign an owner for the next internal step.
            5. Review and approve the final output before sharing.

            Context:
            {request.Context}

            Notes:
            {request.Notes}
            """;
    }

    private static string BuildExecutiveSummary(WorkflowRequest request)
    {
        return $"""
            # Executive Summary

            {request.BusinessName} needs a clear, reviewed output for "{request.Title}". The available context indicates a workflow that can be improved by converting unstructured information into a consistent business artifact.

            The recommended approach is to use the provided notes as source material, generate a structured draft and keep human review as the final approval step.

            Primary context:
            {request.Context}
            """;
    }

    private static string BuildClientFacingResponse(WorkflowRequest request)
    {
        return $"""
            Hello,

            Thank you for reaching out. We reviewed the information related to {request.Title} and prepared the following response based on the details currently available.

            We understand the main need as follows:
            {request.Context}

            Based on that, the next recommended step is to confirm the remaining details and proceed with a clear, documented action plan.

            Thank you,
            {request.BusinessName}
            """;
    }
}
