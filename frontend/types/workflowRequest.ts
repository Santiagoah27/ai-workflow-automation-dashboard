export type RequestType =
  | "DocumentGeneration"
  | "BusinessSummary"
  | "ClientResponse"
  | "InternalReport"
  | "ProcessAnalysis";

export type OutputType =
  | "ProfessionalEmail"
  | "StructuredReport"
  | "ActionPlan"
  | "ExecutiveSummary"
  | "ClientFacingResponse";

export type RequestStatus =
  | "Draft"
  | "Processing"
  | "Generated"
  | "Reviewed"
  | "Archived"
  | "Failed";

export type Priority = "Low" | "Medium" | "High";

export type WorkflowRequestListItem = {
  id: string;
  businessName: string;
  title: string;
  requestType: RequestType;
  desiredOutputType: OutputType;
  priority: Priority;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
};

export type WorkflowRequestDetail = WorkflowRequestListItem & {
  context: string;
  notes: string;
  generatedOutput: string | null;
  reviewedOutput: string | null;
  errorMessage: string | null;
};

export type CreateWorkflowRequestPayload = {
  businessName: string;
  title: string;
  requestType: RequestType;
  context: string;
  notes: string;
  desiredOutputType: OutputType;
  priority: Priority;
};

export type ReviewWorkflowRequestPayload = {
  reviewedOutput: string;
};

export const requestTypeOptions: RequestType[] = [
  "DocumentGeneration",
  "BusinessSummary",
  "ClientResponse",
  "InternalReport",
  "ProcessAnalysis",
];

export const outputTypeOptions: OutputType[] = [
  "ProfessionalEmail",
  "StructuredReport",
  "ActionPlan",
  "ExecutiveSummary",
  "ClientFacingResponse",
];

export const priorityOptions: Priority[] = ["Low", "Medium", "High"];
