import type {
  CreateWorkflowRequestPayload,
  ReviewWorkflowRequestPayload,
  WorkflowRequestDetail,
  WorkflowRequestListItem,
} from "@/types/workflowRequest";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

type ApiErrorBody = {
  error?: string;
  title?: string;
};

export class WorkflowRequestsApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkflowRequestsApiError";
  }
}

export async function getWorkflowRequests() {
  return request<WorkflowRequestListItem[]>("/api/workflow-requests");
}

export async function getWorkflowRequestById(id: string) {
  return request<WorkflowRequestDetail>(`/api/workflow-requests/${id}`);
}

export async function createWorkflowRequest(
  payload: CreateWorkflowRequestPayload,
) {
  return request<WorkflowRequestDetail>("/api/workflow-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function generateWorkflowRequest(id: string) {
  return request<WorkflowRequestDetail>(
    `/api/workflow-requests/${id}/generate`,
    { method: "POST" },
  );
}

export async function reviewWorkflowRequest(
  id: string,
  payload: ReviewWorkflowRequestPayload,
) {
  return request<WorkflowRequestDetail>(`/api/workflow-requests/${id}/review`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function archiveWorkflowRequest(id: string) {
  return request<WorkflowRequestDetail>(
    `/api/workflow-requests/${id}/archive`,
    { method: "PUT" },
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new WorkflowRequestsApiError(
      "NEXT_PUBLIC_API_BASE_URL is not configured.",
    );
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new WorkflowRequestsApiError(await getErrorMessage(response));
  }

  return response.json() as Promise<T>;
}

async function getErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.error ?? body.title ?? "The request could not be completed.";
  } catch {
    return "The request could not be completed.";
  }
}
