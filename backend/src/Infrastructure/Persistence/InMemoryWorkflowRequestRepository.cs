using AiWorkflowAutomationDashboard.Application.WorkflowRequests;
using AiWorkflowAutomationDashboard.Domain.Entities;

namespace AiWorkflowAutomationDashboard.Infrastructure.Persistence;

public sealed class InMemoryWorkflowRequestRepository : IWorkflowRequestRepository
{
    private readonly object _syncRoot = new();
    private readonly Dictionary<Guid, WorkflowRequest> _requests = [];

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
}
