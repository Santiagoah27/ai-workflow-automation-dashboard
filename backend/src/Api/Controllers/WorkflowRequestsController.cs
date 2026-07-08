using AiWorkflowAutomationDashboard.Application.WorkflowRequests;
using Microsoft.AspNetCore.Mvc;

namespace AiWorkflowAutomationDashboard.Api.Controllers;

[ApiController]
[Route("api/workflow-requests")]
public sealed class WorkflowRequestsController : ControllerBase
{
    private readonly IWorkflowRequestService _workflowRequests;

    public WorkflowRequestsController(IWorkflowRequestService workflowRequests)
    {
        _workflowRequests = workflowRequests;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<WorkflowRequestListItemDto>>> GetList(
        CancellationToken cancellationToken)
    {
        var result = await _workflowRequests.GetListAsync(cancellationToken);

        return ToActionResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<WorkflowRequestDetailDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _workflowRequests.GetByIdAsync(id, cancellationToken);

        return ToActionResult(result);
    }

    [HttpPost]
    public async Task<ActionResult<WorkflowRequestDetailDto>> Create(
        CreateWorkflowRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _workflowRequests.CreateAsync(dto, cancellationToken);

        if (!result.IsSuccess || result.Value is null)
        {
            return ToActionResult(result);
        }

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Value.Id },
            result.Value);
    }

    [HttpPost("{id:guid}/generate")]
    public async Task<ActionResult<WorkflowRequestDetailDto>> Generate(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _workflowRequests.GenerateAsync(id, cancellationToken);

        return ToActionResult(result);
    }

    [HttpPut("{id:guid}/review")]
    public async Task<ActionResult<WorkflowRequestDetailDto>> Review(
        Guid id,
        ReviewWorkflowRequestDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _workflowRequests.ReviewAsync(id, dto, cancellationToken);

        return ToActionResult(result);
    }

    [HttpPut("{id:guid}/archive")]
    public async Task<ActionResult<WorkflowRequestDetailDto>> Archive(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _workflowRequests.ArchiveAsync(id, cancellationToken);

        return ToActionResult(result);
    }

    private ActionResult<T> ToActionResult<T>(WorkflowRequestResult<T> result)
    {
        if (result.IsSuccess && result.Value is not null)
        {
            return Ok(result.Value);
        }

        return result.ErrorType switch
        {
            WorkflowRequestErrorType.NotFound => NotFound(ToErrorResponse(result)),
            WorkflowRequestErrorType.Validation => BadRequest(ToErrorResponse(result)),
            WorkflowRequestErrorType.GenerationFailed => StatusCode(
                StatusCodes.Status500InternalServerError,
                ToErrorResponse(result)),
            _ => StatusCode(
                StatusCodes.Status500InternalServerError,
                new { error = "An unexpected error occurred." })
        };
    }

    private static object ToErrorResponse<T>(WorkflowRequestResult<T> result)
    {
        return new { error = result.ErrorMessage ?? "The request could not be completed." };
    }
}
