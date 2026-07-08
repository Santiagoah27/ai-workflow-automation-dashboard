namespace AiWorkflowAutomationDashboard.Application.WorkflowRequests;

public sealed record WorkflowRequestResult<T>(
    T? Value,
    WorkflowRequestErrorType ErrorType,
    string? ErrorMessage)
{
    public bool IsSuccess => ErrorType == WorkflowRequestErrorType.None;

    public static WorkflowRequestResult<T> Success(T value)
    {
        return new WorkflowRequestResult<T>(
            value,
            WorkflowRequestErrorType.None,
            null);
    }

    public static WorkflowRequestResult<T> Failure(
        WorkflowRequestErrorType errorType,
        string errorMessage)
    {
        return new WorkflowRequestResult<T>(default, errorType, errorMessage);
    }
}
