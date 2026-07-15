import { Icon, type IconName } from "@/components/ui/Icon";

type StatCardProps = {
  label: string;
  value: string;
  note: string;
  tone?: "neutral" | "draft" | "generated" | "reviewed" | "failed" | "archived";
};

const iconByTone: Record<NonNullable<StatCardProps["tone"]>, IconName> = {
  neutral: "list",
  draft: "edit",
  generated: "sparkles",
  reviewed: "check",
  failed: "warning",
  archived: "archive",
};

export function StatCard({ label, value, note, tone = "neutral" }: StatCardProps) {
  return (
    <section className={`panel stat-card ${tone}`}>
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        <span className="stat-icon" aria-hidden="true">
          <Icon name={iconByTone[tone]} size={17} />
        </span>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </section>
  );
}
