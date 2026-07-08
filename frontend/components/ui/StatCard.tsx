type StatCardProps = {
  label: string;
  value: string;
  note: string;
};

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <section className="panel stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </section>
  );
}
