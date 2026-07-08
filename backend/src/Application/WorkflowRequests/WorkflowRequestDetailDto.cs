using AiWorkflowAutomationDashboard.Domain.Enums;

namespace AiWorkflowAutomationDashboard.Application.WorkflowRequests;

public sealed record WorkflowRequestDetailDto(
    Guid Id,
    string BusinessName,
    string Title,
    RequestType RequestType,
    string Context,
    string Notes,
    OutputType DesiredOutputType,
    Priority Priority,
    RequestStatus Status,
    string? GeneratedOutput,
    string? ReviewedOutput,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? ProcessedAt,
    string? ErrorMessage);
