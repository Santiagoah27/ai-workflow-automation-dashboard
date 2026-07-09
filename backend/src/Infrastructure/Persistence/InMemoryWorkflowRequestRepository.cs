using AiWorkflowAutomationDashboard.Application.WorkflowRequests;
using AiWorkflowAutomationDashboard.Domain.Entities;
using AiWorkflowAutomationDashboard.Domain.Enums;

namespace AiWorkflowAutomationDashboard.Infrastructure.Persistence;

public sealed class InMemoryWorkflowRequestRepository : IWorkflowRequestRepository
{
    private readonly object _syncRoot = new();
    private readonly Dictionary<Guid, WorkflowRequest> _requests = [];

    public InMemoryWorkflowRequestRepository(bool seedDemoData = false)
    {
        if (seedDemoData)
        {
            foreach (var request in CreateDemoRequests())
            {
                _requests[request.Id] = request;
            }
        }
    }

    public Task<IReadOnlyCollection<WorkflowRequest>> GetListAsync(
        CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            return Task.FromResult<IReadOnlyCollection<WorkflowRequest>>(
                _requests.Values.Select(Clone).ToArray());
        }
    }

    public Task<WorkflowRequest?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            return Task.FromResult(
                _requests.TryGetValue(id, out var request) ? Clone(request) : null);
        }
    }

    public Task AddAsync(
        WorkflowRequest request,
        CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            _requests[request.Id] = Clone(request);
        }

        return Task.CompletedTask;
    }

    public Task UpdateAsync(
        WorkflowRequest request,
        CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            _requests[request.Id] = Clone(request);
        }

        return Task.CompletedTask;
    }

    private static WorkflowRequest Clone(WorkflowRequest request)
    {
        return new WorkflowRequest
        {
            Id = request.Id,
            BusinessName = request.BusinessName,
            Title = request.Title,
            RequestType = request.RequestType,
            Context = request.Context,
            Notes = request.Notes,
            DesiredOutputType = request.DesiredOutputType,
            Priority = request.Priority,
            Status = request.Status,
            GeneratedOutput = request.GeneratedOutput,
            ReviewedOutput = request.ReviewedOutput,
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt,
            ProcessedAt = request.ProcessedAt,
            ErrorMessage = request.ErrorMessage
        };
    }

    private static IReadOnlyCollection<WorkflowRequest> CreateDemoRequests()
    {
        var now = DateTime.UtcNow;

        return
        [
            new WorkflowRequest
            {
                Id = Guid.Parse("11111111-1111-4111-8111-111111111111"),
                BusinessName = "Northstar Clinic",
                Title = "Client onboarding summary",
                RequestType = RequestType.BusinessSummary,
                Context = "A new patient completed intake and needs a concise internal summary for the operations team.",
                Notes = "Include appointment type, missing documents, follow-up owner and response expectations.",
                DesiredOutputType = OutputType.ExecutiveSummary,
                Priority = Priority.High,
                Status = RequestStatus.Generated,
                GeneratedOutput = "Northstar Clinic received a new intake request that needs operational follow-up. The team should confirm the appointment type, collect missing documents and assign an owner for next-step communication.",
                CreatedAt = now.AddDays(-3),
                UpdatedAt = now.AddDays(-2).AddHours(4),
                ProcessedAt = now.AddDays(-2).AddHours(4)
            },
            new WorkflowRequest
            {
                Id = Guid.Parse("22222222-2222-4222-8222-222222222222"),
                BusinessName = "Studio Ledger",
                Title = "Internal weekly report",
                RequestType = RequestType.InternalReport,
                Context = "The operations lead needs a weekly summary of completed client work, blockers and next actions.",
                Notes = "Mention three completed deliverables, two delayed approvals and one billing follow-up.",
                DesiredOutputType = OutputType.StructuredReport,
                Priority = Priority.Medium,
                Status = RequestStatus.Reviewed,
                GeneratedOutput = "Weekly operations report draft with completed work, blockers and recommended actions.",
                ReviewedOutput = "This week the team completed three client deliverables, is waiting on two approvals and should prioritize one billing follow-up before Friday.",
                CreatedAt = now.AddDays(-5),
                UpdatedAt = now.AddDays(-1).AddHours(2),
                ProcessedAt = now.AddDays(-4)
            },
            new WorkflowRequest
            {
                Id = Guid.Parse("33333333-3333-4333-8333-333333333333"),
                BusinessName = "Acme Services",
                Title = "Professional email response",
                RequestType = RequestType.ClientResponse,
                Context = "A client asked for a status update and needs a clear, polite response with next steps.",
                Notes = "Keep it concise. Confirm timeline, owner and expected decision date.",
                DesiredOutputType = OutputType.ProfessionalEmail,
                Priority = Priority.Medium,
                Status = RequestStatus.Draft,
                CreatedAt = now.AddDays(-1),
                UpdatedAt = now.AddDays(-1)
            },
            new WorkflowRequest
            {
                Id = Guid.Parse("44444444-4444-4444-8444-444444444444"),
                BusinessName = "OpsWorks Consulting",
                Title = "Process improvement action plan",
                RequestType = RequestType.ProcessAnalysis,
                Context = "The team wants to reduce repeated manual status updates across email and spreadsheets.",
                Notes = "Focus on intake standardization, owner assignment and weekly review cadence.",
                DesiredOutputType = OutputType.ActionPlan,
                Priority = Priority.Low,
                Status = RequestStatus.Archived,
                GeneratedOutput = "Action plan: standardize intake, assign owners, review weekly and track outcomes.",
                ReviewedOutput = "Use one intake form, assign a workflow owner, review open items weekly and archive completed requests for traceability.",
                CreatedAt = now.AddDays(-12),
                UpdatedAt = now.AddDays(-8),
                ProcessedAt = now.AddDays(-10)
            }
        ];
    }
}
