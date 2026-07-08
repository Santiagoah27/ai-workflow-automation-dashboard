namespace AiWorkflowAutomationDashboard.Application.WorkflowRequests;

public interface IWorkflowRequestService
{
    Task<WorkflowRequestResult<IReadOnlyCollection<WorkflowRequestListItemDto>>> GetListAsync(
        CancellationToken cancellationToken = default);

    Task<WorkflowRequestResult<WorkflowRequestDetailDto>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<WorkflowRequestResult<WorkflowRequestDetailDto>> CreateAsync(
        CreateWorkflowRequestDto dto,
        CancellationToken cancellationToken = default);

    Task<WorkflowRequestResult<WorkflowRequestDetailDto>> GenerateAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<WorkflowRequestResult<WorkflowRequestDetailDto>> ReviewAsync(
        Guid id,
        ReviewWorkflowRequestDto dto,
        CancellationToken cancellationToken = default);

    Task<WorkflowRequestResult<WorkflowRequestDetailDto>> ArchiveAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
