import type { RequestStatus } from "@/types/workflowRequest";

type BadgeProps = {
  status: RequestStatus;
};

export function Badge({ status }: BadgeProps) {
  return <span className={`badge ${status.toLowerCase()}`}>{status}</span>;
}
