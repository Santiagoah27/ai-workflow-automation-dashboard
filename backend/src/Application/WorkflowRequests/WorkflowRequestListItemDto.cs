using AiWorkflowAutomationDashboard.Domain.Enums;

namespace AiWorkflowAutomationDashboard.Application.WorkflowRequests;

public sealed record WorkflowRequestListItemDto(
    Guid Id,
    string BusinessName,
    string Title,
    RequestType RequestType,
    OutputType DesiredOutputType,
    Priority Priority,
    RequestStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? ProcessedAt);
