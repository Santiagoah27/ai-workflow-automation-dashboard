using AiWorkflowAutomationDashboard.Application.WorkflowRequests;
using AiWorkflowAutomationDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AiWorkflowAutomationDashboard.Infrastructure.Persistence;

public sealed class EfWorkflowRequestRepository : IWorkflowRequestRepository
{
    private readonly WorkflowDbContext _dbContext;

    public EfWorkflowRequestRepository(WorkflowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<WorkflowRequest>> GetListAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.WorkflowRequests
            .AsNoTracking()
            .ToArrayAsync(cancellationToken);
    }

    public async Task<WorkflowRequest?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.WorkflowRequests
            .FirstOrDefaultAsync(request => request.Id == id, cancellationToken);
    }

    public async Task AddAsync(
        WorkflowRequest request,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.WorkflowRequests.AddAsync(request, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(
        WorkflowRequest request,
        CancellationToken cancellationToken = default)
    {
        _dbContext.WorkflowRequests.Update(request);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
