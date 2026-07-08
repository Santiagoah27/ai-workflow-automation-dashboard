using AiWorkflowAutomationDashboard.Application.Ai;
using AiWorkflowAutomationDashboard.Domain.Entities;
using AiWorkflowAutomationDashboard.Domain.Enums;

namespace AiWorkflowAutomationDashboard.Application.WorkflowRequests;

public sealed class WorkflowRequestService : IWorkflowRequestService
{
    private const string GenerationFailureMessage =
        "AI generation failed. Please review the request and try again.";

    private readonly IWorkflowRequestRepository _repository;
    private readonly IAiWorkflowProcessor _aiWorkflowProcessor;

    public WorkflowRequestService(
        IWorkflowRequestRepository repository,
        IAiWorkflowProcessor aiWorkflowProcessor)
    {
        _repository = repository;
        _aiWorkflowProcessor = aiWorkflowProcessor;
    }

    public async Task<WorkflowRequestResult<IReadOnlyCollection<WorkflowRequestListItemDto>>> GetListAsync(
        CancellationToken cancellationToken = default)
    {
        var requests = await _repository.GetListAsync(cancellationToken);
        var dto = requests
            .OrderByDescending(request => request.UpdatedAt)
            .Select(MapToListItem)
            .ToArray();

        return WorkflowRequestResult<IReadOnlyCollection<WorkflowRequestListItemDto>>.Success(dto);
    }

    public async Task<WorkflowRequestResult<WorkflowRequestDetailDto>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var request = await _repository.GetByIdAsync(id, cancellationToken);

        return request is null
            ? NotFound()
            : WorkflowRequestResult<WorkflowRequestDetailDto>.Success(MapToDetail(request));
    }

    public async Task<WorkflowRequestResult<WorkflowRequestDetailDto>> CreateAsync(
        CreateWorkflowRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        var validationError = ValidateCreate(dto);
        if (validationError is not null)
        {
            return ValidationFailure(validationError);
        }

        var now = DateTime.UtcNow;
        var request = new WorkflowRequest
        {
            Id = Guid.NewGuid(),
            BusinessName = dto.BusinessName.Trim(),
            Title = dto.Title.Trim(),
            RequestType = dto.RequestType,
            Context = dto.Context.Trim(),
            Notes = dto.Notes.Trim(),
            DesiredOutputType = dto.DesiredOutputType,
            Priority = dto.Priority,
            Status = RequestStatus.Draft,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _repository.AddAsync(request, cancellationToken);

        return WorkflowRequestResult<WorkflowRequestDetailDto>.Success(MapToDetail(request));
    }

    public async Task<WorkflowRequestResult<WorkflowRequestDetailDto>> GenerateAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var request = await _repository.GetByIdAsync(id, cancellationToken);
        if (request is null)
        {
            return NotFound();
        }

        request.Status = RequestStatus.Processing;
        request.ErrorMessage = null;
        request.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(request, cancellationToken);

        try
        {
            var result = await _aiWorkflowProcessor.ProcessAsync(request, cancellationToken);

            request.GeneratedOutput = result.Output;
            request.Status = RequestStatus.Generated;
            request.ProcessedAt = DateTime.UtcNow;
            request.UpdatedAt = request.ProcessedAt.Value;
            request.ErrorMessage = null;
        }
        catch
        {
            request.Status = RequestStatus.Failed;
            request.ErrorMessage = GenerationFailureMessage;
            request.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(request, cancellationToken);

            return WorkflowRequestResult<WorkflowRequestDetailDto>.Failure(
                WorkflowRequestErrorType.GenerationFailed,
                GenerationFailureMessage);
        }

        await _repository.UpdateAsync(request, cancellationToken);

        return WorkflowRequestResult<WorkflowRequestDetailDto>.Success(MapToDetail(request));
    }

    public async Task<WorkflowRequestResult<WorkflowRequestDetailDto>> ReviewAsync(
        Guid id,
        ReviewWorkflowRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.ReviewedOutput))
        {
            return ValidationFailure("ReviewedOutput is required.");
        }

        var request = await _repository.GetByIdAsync(id, cancellationToken);
        if (request is null)
        {
            return NotFound();
        }

        request.ReviewedOutput = dto.ReviewedOutput.Trim();
        request.Status = RequestStatus.Reviewed;
        request.UpdatedAt = DateTime.UtcNow;
        request.ErrorMessage = null;

        await _repository.UpdateAsync(request, cancellationToken);

        return WorkflowRequestResult<WorkflowRequestDetailDto>.Success(MapToDetail(request));
    }

    public async Task<WorkflowRequestResult<WorkflowRequestDetailDto>> ArchiveAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var request = await _repository.GetByIdAsync(id, cancellationToken);
        if (request is null)
        {
            return NotFound();
        }

        request.Status = RequestStatus.Archived;
        request.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(request, cancellationToken);

        return WorkflowRequestResult<WorkflowRequestDetailDto>.Success(MapToDetail(request));
    }

    private static string? ValidateCreate(CreateWorkflowRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.BusinessName))
        {
            return "BusinessName is required.";
        }

        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return "Title is required.";
        }

        if (string.IsNullOrWhiteSpace(dto.Context))
        {
            return "Context is required.";
        }

        if (!Enum.IsDefined(dto.RequestType))
        {
            return "RequestType must be valid.";
        }

        if (!Enum.IsDefined(dto.DesiredOutputType))
        {
            return "DesiredOutputType must be valid.";
        }

        if (!Enum.IsDefined(dto.Priority))
        {
            return "Priority must be valid.";
        }

        return null;
    }

    private static WorkflowRequestListItemDto MapToListItem(WorkflowRequest request)
    {
        return new WorkflowRequestListItemDto(
            request.Id,
            request.BusinessName,
            request.Title,
            request.RequestType,
            request.DesiredOutputType,
            request.Priority,
            request.Status,
            request.CreatedAt,
            request.UpdatedAt,
            request.ProcessedAt);
    }

    private static WorkflowRequestDetailDto MapToDetail(WorkflowRequest request)
    {
        return new WorkflowRequestDetailDto(
            request.Id,
            request.BusinessName,
            request.Title,
            request.RequestType,
            request.Context,
            request.Notes,
            request.DesiredOutputType,
            request.Priority,
            request.Status,
            request.GeneratedOutput,
            request.ReviewedOutput,
            request.CreatedAt,
            request.UpdatedAt,
            request.ProcessedAt,
            request.ErrorMessage);
    }

    private static WorkflowRequestResult<WorkflowRequestDetailDto> NotFound()
    {
        return WorkflowRequestResult<WorkflowRequestDetailDto>.Failure(
            WorkflowRequestErrorType.NotFound,
            "Workflow request was not found.");
    }

    private static WorkflowRequestResult<WorkflowRequestDetailDto> ValidationFailure(
        string errorMessage)
    {
        return WorkflowRequestResult<WorkflowRequestDetailDto>.Failure(
            WorkflowRequestErrorType.Validation,
            errorMessage);
    }
}
