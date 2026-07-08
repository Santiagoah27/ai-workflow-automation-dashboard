using AiWorkflowAutomationDashboard.Domain.Enums;

namespace AiWorkflowAutomationDashboard.Domain.Entities;

public sealed class WorkflowRequest
{
    public Guid Id { get; set; }

    public string BusinessName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public RequestType RequestType { get; set; }

    public string Context { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;

    public OutputType DesiredOutputType { get; set; }

    public Priority Priority { get; set; }

    public RequestStatus Status { get; set; }

    public string? GeneratedOutput { get; set; }

    public string? ReviewedOutput { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public string? ErrorMessage { get; set; }
}
