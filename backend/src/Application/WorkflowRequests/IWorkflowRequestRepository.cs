using AiWorkflowAutomationDashboard.Domain.Entities;

namespace AiWorkflowAutomationDashboard.Application.WorkflowRequests;

public interface IWorkflowRequestRepository
{
    Task<IReadOnlyCollection<WorkflowRequest>> GetListAsync(
        CancellationToken cancellationToken = default);

    Task<WorkflowRequest?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        WorkflowRequest request,
        CancellationToken cancellationToken = default);

    Task UpdateAsync(
        WorkflowRequest request,
        CancellationToken cancellationToken = default);
}
