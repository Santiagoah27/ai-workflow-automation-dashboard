using AiWorkflowAutomationDashboard.Domain.Entities;
using AiWorkflowAutomationDashboard.Domain.Enums;
using AiWorkflowAutomationDashboard.Infrastructure.Ai;
using Xunit;

namespace Application.Tests.Ai;

public sealed class MockAiWorkflowProcessorTests
{
    public static TheoryData<OutputType, string[]> OutputExpectations => new()
    {
        { OutputType.ProfessionalEmail, new[] { "Subject:", "Hello", "Best regards" } },
        { OutputType.StructuredReport, new[] { "## Business Context", "## Recommended Next Step" } },
        { OutputType.ActionPlan, new[] { "# Action Plan", "1.", "5." } },
        { OutputType.ExecutiveSummary, new[] { "# Executive Summary", "Primary context" } },
        { OutputType.ClientFacingResponse, new[] { "Thank you for reaching out", "next recommended step" } }
    };

    [Theory]
    [MemberData(nameof(OutputExpectations))]
    public async Task ProcessAsync_GeneratesMeaningfulOutputForEachOutputType(
        OutputType outputType,
        string[] expectedFragments)
    {
        var processor = new MockAiWorkflowProcessor();
        var request = CreateRequest(outputType);

        var result = await processor.ProcessAsync(request);

        Assert.False(string.IsNullOrWhiteSpace(result.Output));
        Assert.Equal("mock-workflow-v1", result.PromptVersion);

        foreach (var expectedFragment in expectedFragments)
        {
            Assert.Contains(expectedFragment, result.Output);
        }
    }

    [Fact]
    public async Task ProcessAsync_ChangesOutputByDesiredOutputType()
    {
        var processor = new MockAiWorkflowProcessor();
        var outputTypes = Enum.GetValues<OutputType>();
        var outputs = new List<string>();

        foreach (var outputType in outputTypes)
        {
            var result = await processor.ProcessAsync(CreateRequest(outputType));
            outputs.Add(result.Output);
        }

        Assert.Equal(outputTypes.Length, outputs.Distinct().Count());
    }

    private static WorkflowRequest CreateRequest(OutputType outputType)
    {
        return new WorkflowRequest
        {
            Id = Guid.NewGuid(),
            BusinessName = "Northstar Services",
            Title = "Client onboarding follow-up",
            RequestType = RequestType.ClientResponse,
            Context = "The client needs next steps after submitting onboarding information.",
            Notes = "Mention missing tax details and expected review timeline.",
            DesiredOutputType = outputType,
            Priority = Priority.High,
            Status = RequestStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
