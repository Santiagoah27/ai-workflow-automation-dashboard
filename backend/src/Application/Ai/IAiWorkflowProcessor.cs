using AiWorkflowAutomationDashboard.Domain.Entities;

namespace AiWorkflowAutomationDashboard.Application.Ai;

public interface IAiWorkflowProcessor
{
    Task<AiWorkflowResult> ProcessAsync(
        WorkflowRequest request,
        CancellationToken cancellationToken = default);
}
