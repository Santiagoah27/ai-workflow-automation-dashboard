using AiWorkflowAutomationDashboard.Application.Ai;
using AiWorkflowAutomationDashboard.Application.WorkflowRequests;
using AiWorkflowAutomationDashboard.Infrastructure.Ai;
using AiWorkflowAutomationDashboard.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
const string LocalFrontendCorsPolicy = "LocalFrontend";

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=workflow-automation.db";

builder.Services.AddDbContext<WorkflowDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddScoped<IWorkflowRequestRepository, EfWorkflowRequestRepository>();
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

await WorkflowDatabaseInitializer.InitializeAsync(
    app.Services,
    app.Environment.IsDevelopment());

app.Run();
