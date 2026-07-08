import type { WorkflowRequestListItem } from "@/types/workflow";

export const sampleWorkflowRequests: WorkflowRequestListItem[] = [
  {
    id: "demo-request",
    businessName: "Example Clinic",
    title: "Summarize intake notes",
    requestType: "BusinessSummary",
    desiredOutputType: "ExecutiveSummary",
    priority: "High",
    status: "Generated",
    updatedAt: "2026-07-07",
    reviewedOutput:
      "Draft reviewed summary for the operations team. Real generated content will come from the backend in a later phase.",
  },
  {
    id: "client-response",
    businessName: "Service Studio",
    title: "Prepare client response",
    requestType: "ClientResponse",
    desiredOutputType: "ClientFacingResponse",
    priority: "Medium",
    status: "Reviewed",
    updatedAt: "2026-07-07",
    reviewedOutput:
      "Reviewed client-facing response placeholder for the detail view.",
  },
  {
    id: "process-analysis",
    businessName: "Operations Team",
    title: "Document manual follow-up process",
    requestType: "ProcessAnalysis",
    desiredOutputType: "ActionPlan",
    priority: "Low",
    status: "Draft",
    updatedAt: "2026-07-07",
    reviewedOutput: "Draft placeholder awaiting AI-assisted generation.",
  },
];
