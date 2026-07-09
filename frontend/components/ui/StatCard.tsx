type StatCardProps = {
  label: string;
  value: string;
  note: string;
  tone?: "neutral" | "draft" | "generated" | "reviewed" | "failed" | "archived";
};

export function StatCard({ label, value, note, tone = "neutral" }: StatCardProps) {
  return (
    <section className={`panel stat-card ${tone}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </section>
  );
}
