using AiWorkflowAutomationDashboard.Application.Ai;
using AiWorkflowAutomationDashboard.Application.WorkflowRequests;
using AiWorkflowAutomationDashboard.Infrastructure.Ai;
using AiWorkflowAutomationDashboard.Infrastructure.Persistence;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IWorkflowRequestRepository, InMemoryWorkflowRequestRepository>();
builder.Services.AddScoped<IWorkflowRequestService, WorkflowRequestService>();
builder.Services.AddScoped<IAiWorkflowProcessor, MockAiWorkflowProcessor>();
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
