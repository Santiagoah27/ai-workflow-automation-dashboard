import type { Priority } from "@/types/workflowRequest";

type PriorityBadgeProps = {
  priority: Priority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <span className={`priority-badge ${priority.toLowerCase()}`}>{priority}</span>;
}
