using AiWorkflowAutomationDashboard.Application.Ai;
using AiWorkflowAutomationDashboard.Application.WorkflowRequests;
using AiWorkflowAutomationDashboard.Infrastructure.Ai;
using AiWorkflowAutomationDashboard.Infrastructure.Persistence;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
const string LocalFrontendCorsPolicy = "LocalFrontend";

builder.Services.AddSingleton<IWorkflowRequestRepository>(
    _ => new InMemoryWorkflowRequestRepository(builder.Environment.IsDevelopment()));
builder.Services.AddScoped<IWorkflowRequestService, WorkflowRequestService>();
builder.Services.AddScoped<IAiWorkflowProcessor, MockAiWorkflowProcessor>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(LocalFrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
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
    app.UseCors(LocalFrontendCorsPolicy);
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
