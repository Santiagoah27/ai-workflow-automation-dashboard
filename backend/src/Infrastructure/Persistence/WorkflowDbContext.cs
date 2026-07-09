using AiWorkflowAutomationDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AiWorkflowAutomationDashboard.Infrastructure.Persistence;

public sealed class WorkflowDbContext : DbContext
{
    public WorkflowDbContext(DbContextOptions<WorkflowDbContext> options)
        : base(options)
    {
    }

    public DbSet<WorkflowRequest> WorkflowRequests => Set<WorkflowRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var utcDateTimeConverter = new ValueConverter<DateTime, DateTime>(
            dateTime => dateTime,
            dateTime => DateTime.SpecifyKind(dateTime, DateTimeKind.Utc));

        var nullableUtcDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
            dateTime => dateTime,
            dateTime => dateTime.HasValue
                ? DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Utc)
                : null);

        modelBuilder.Entity<WorkflowRequest>(entity =>
        {
            entity.HasKey(request => request.Id);

            entity.Property(request => request.BusinessName)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(request => request.Title)
                .HasMaxLength(240)
                .IsRequired();

            entity.Property(request => request.RequestType)
                .HasConversion<string>()
                .HasMaxLength(80)
                .IsRequired();

            entity.Property(request => request.Context)
                .IsRequired();

            entity.Property(request => request.Notes)
                .IsRequired();

            entity.Property(request => request.DesiredOutputType)
                .HasConversion<string>()
                .HasMaxLength(80)
                .IsRequired();

            entity.Property(request => request.Priority)
                .HasConversion<string>()
                .HasMaxLength(40)
                .IsRequired();

            entity.Property(request => request.Status)
                .HasConversion<string>()
                .HasMaxLength(40)
                .IsRequired();

            entity.Property(request => request.GeneratedOutput);

            entity.Property(request => request.ReviewedOutput);

            entity.Property(request => request.CreatedAt)
                .HasConversion(utcDateTimeConverter)
                .IsRequired();

            entity.Property(request => request.UpdatedAt)
                .HasConversion(utcDateTimeConverter)
                .IsRequired();

            entity.Property(request => request.ProcessedAt)
                .HasConversion(nullableUtcDateTimeConverter);

            entity.Property(request => request.ErrorMessage)
                .HasMaxLength(500);

            entity.HasIndex(request => request.Status);
            entity.HasIndex(request => request.UpdatedAt);
        });
    }
}
