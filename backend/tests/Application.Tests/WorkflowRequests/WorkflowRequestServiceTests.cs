using AiWorkflowAutomationDashboard.Application.WorkflowRequests;
using AiWorkflowAutomationDashboard.Domain.Entities;
using AiWorkflowAutomationDashboard.Domain.Enums;
using AiWorkflowAutomationDashboard.Infrastructure.Ai;
using Xunit;

namespace Application.Tests.WorkflowRequests;

public sealed class WorkflowRequestServiceTests
{
    [Fact]
    public async Task CreateAsync_WithValidInput_PersistsDraftRequestWithUtcTimestamps()
    {
        var repository = new FakeWorkflowRequestRepository();
        var service = CreateService(repository);

        var result = await service.CreateAsync(CreateValidRequest());

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);

        var storedRequest = await repository.GetByIdAsync(result.Value.Id);

        Assert.NotNull(storedRequest);
        Assert.Equal("Acme Operations", storedRequest.BusinessName);
        Assert.Equal("Weekly operations summary", storedRequest.Title);
        Assert.Equal(RequestStatus.Draft, storedRequest.Status);
        Assert.Equal(DateTimeKind.Utc, storedRequest.CreatedAt.Kind);
        Assert.Equal(DateTimeKind.Utc, storedRequest.UpdatedAt.Kind);
        Assert.Null(storedRequest.GeneratedOutput);
        Assert.Null(storedRequest.ReviewedOutput);
        Assert.Null(storedRequest.ProcessedAt);
        Assert.Null(storedRequest.ErrorMessage);
    }

    [Fact]
    public async Task GenerateAsync_ForDraftRequest_StoresGeneratedOutputAndMarksGenerated()
    {
        var repository = new FakeWorkflowRequestRepository();
        var service = CreateService(repository);
        var createResult = await service.CreateAsync(CreateValidRequest());
        var requestId = createResult.Value!.Id;

        var result = await service.GenerateAsync(requestId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal(RequestStatus.Generated, result.Value.Status);
        Assert.False(string.IsNullOrWhiteSpace(result.Value.GeneratedOutput));
        Assert.Null(result.Value.ErrorMessage);
        Assert.NotNull(result.Value.ProcessedAt);
        Assert.Equal(DateTimeKind.Utc, result.Value.ProcessedAt!.Value.Kind);
        Assert.True(result.Value.UpdatedAt >= result.Value.CreatedAt);
    }

    [Fact]
    public async Task ReviewAsync_ForGeneratedRequest_StoresReviewedOutputAndMarksReviewed()
    {
        var repository = new FakeWorkflowRequestRepository();
        var service = CreateService(repository);
        var createResult = await service.CreateAsync(CreateValidRequest());
        var requestId = createResult.Value!.Id;
        var generateResult = await service.GenerateAsync(requestId);
        var generatedUpdatedAt = generateResult.Value!.UpdatedAt;

        var result = await service.ReviewAsync(
            requestId,
            new ReviewWorkflowRequestDto("Final reviewed output for business use."));

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal(RequestStatus.Reviewed, result.Value.Status);
        Assert.Equal("Final reviewed output for business use.", result.Value.ReviewedOutput);
        Assert.True(result.Value.UpdatedAt >= generatedUpdatedAt);
        Assert.Null(result.Value.ErrorMessage);
    }

    [Fact]
    public async Task ReviewAsync_WithEmptyReviewedOutput_ReturnsValidationFailure()
    {
        var repository = new FakeWorkflowRequestRepository();
        var service = CreateService(repository);
        var createResult = await service.CreateAsync(CreateValidRequest());
        var requestId = createResult.Value!.Id;
        await service.GenerateAsync(requestId);

        var result = await service.ReviewAsync(
            requestId,
            new ReviewWorkflowRequestDto("   "));

        var storedRequest = await repository.GetByIdAsync(requestId);

        Assert.False(result.IsSuccess);
        Assert.Equal(WorkflowRequestErrorType.Validation, result.ErrorType);
        Assert.Equal("ReviewedOutput is required.", result.ErrorMessage);
        Assert.NotNull(storedRequest);
        Assert.Equal(RequestStatus.Generated, storedRequest.Status);
        Assert.Null(storedRequest.ReviewedOutput);
    }

    [Fact]
    public async Task ArchiveAsync_ForReviewedRequest_MarksArchivedAndKeepsRequestRetrievable()
    {
        var repository = new FakeWorkflowRequestRepository();
        var service = CreateService(repository);
        var createResult = await service.CreateAsync(CreateValidRequest());
        var requestId = createResult.Value!.Id;
        await service.GenerateAsync(requestId);
        var reviewResult = await service.ReviewAsync(
            requestId,
            new ReviewWorkflowRequestDto("Approved archive-ready output."));
        var reviewedUpdatedAt = reviewResult.Value!.UpdatedAt;

        var result = await service.ArchiveAsync(requestId);
        var retrievedResult = await service.GetByIdAsync(requestId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal(RequestStatus.Archived, result.Value.Status);
        Assert.True(result.Value.UpdatedAt >= reviewedUpdatedAt);
        Assert.True(retrievedResult.IsSuccess);
        Assert.Equal(RequestStatus.Archived, retrievedResult.Value!.Status);
        Assert.Equal("Approved archive-ready output.", retrievedResult.Value.ReviewedOutput);
    }

    [Fact]
    public async Task MissingRequests_ReturnNotFoundForReadAndWorkflowActions()
    {
        var service = CreateService(new FakeWorkflowRequestRepository());
        var missingId = Guid.NewGuid();

        var getResult = await service.GetByIdAsync(missingId);
        var generateResult = await service.GenerateAsync(missingId);
        var reviewResult = await service.ReviewAsync(
            missingId,
            new ReviewWorkflowRequestDto("Reviewed output."));
        var archiveResult = await service.ArchiveAsync(missingId);

        AssertNotFound(getResult);
        AssertNotFound(generateResult);
        AssertNotFound(reviewResult);
        AssertNotFound(archiveResult);
    }

    private static WorkflowRequestService CreateService(
        IWorkflowRequestRepository repository)
    {
        return new WorkflowRequestService(repository, new MockAiWorkflowProcessor());
    }

    private static CreateWorkflowRequestDto CreateValidRequest()
    {
        return new CreateWorkflowRequestDto(
            "Acme Operations",
            "Weekly operations summary",
            RequestType.InternalReport,
            "Summarize open operational items, risks and owner follow-ups.",
            "Include client onboarding blockers and process cleanup tasks.",
            OutputType.StructuredReport,
            Priority.Medium);
    }

    private static void AssertNotFound(
        WorkflowRequestResult<WorkflowRequestDetailDto> result)
    {
        Assert.False(result.IsSuccess);
        Assert.Equal(WorkflowRequestErrorType.NotFound, result.ErrorType);
        Assert.Equal("Workflow request was not found.", result.ErrorMessage);
    }

    private sealed class FakeWorkflowRequestRepository : IWorkflowRequestRepository
    {
        private readonly Dictionary<Guid, WorkflowRequest> _requests = new();

        public Task<IReadOnlyCollection<WorkflowRequest>> GetListAsync(
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult<IReadOnlyCollection<WorkflowRequest>>(
                _requests.Values.ToArray());
        }

        public Task<WorkflowRequest?> GetByIdAsync(
            Guid id,
            CancellationToken cancellationToken = default)
        {
            _requests.TryGetValue(id, out var request);
            return Task.FromResult(request);
        }

        public Task AddAsync(
            WorkflowRequest request,
            CancellationToken cancellationToken = default)
        {
            _requests.Add(request.Id, request);
            return Task.CompletedTask;
        }

        public Task UpdateAsync(
            WorkflowRequest request,
            CancellationToken cancellationToken = default)
        {
            _requests[request.Id] = request;
            return Task.CompletedTask;
        }
    }
}
