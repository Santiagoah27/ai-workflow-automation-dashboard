using AiWorkflowAutomationDashboard.Domain.Enums;

namespace AiWorkflowAutomationDashboard.Application.WorkflowRequests;

public sealed record CreateWorkflowRequestDto(
    string BusinessName,
    string Title,
    RequestType RequestType,
    string Context,
    string Notes,
    OutputType DesiredOutputType,
    Priority Priority);
