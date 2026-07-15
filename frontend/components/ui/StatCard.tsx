type StatCardProps = {
  label: string;
  value: string;
  note: string;
  tone?: "neutral" | "draft" | "generated" | "reviewed" | "failed" | "archived";
};

export function StatCard({ label, value, note, tone = "neutral" }: StatCardProps) {
  return (
    <section className={`panel stat-card ${tone}`}>
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        <span className="stat-indicator" aria-hidden="true" />
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </section>
  );
}
