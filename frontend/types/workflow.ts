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
  updatedAt: string;
  reviewedOutput: string;
};
