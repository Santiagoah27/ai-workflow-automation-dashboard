"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { getWorkflowRequests } from "@/services/workflowRequestsApi";
import type { RequestStatus, WorkflowRequestListItem } from "@/types/workflowRequest";
import { formatDate, formatEnum } from "@/lib/format";

const statusOptions: Array<RequestStatus | "All"> = [
  "All",
  "Draft",
  "Processing",
  "Generated",
  "Reviewed",
  "Archived",
  "Failed",
];

export function RequestHistory() {
  const [requests, setRequests] = useState<WorkflowRequestListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "All">("All");

  useEffect(() => {
    let isMounted = true;

    async function loadRequests() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getWorkflowRequests();

        if (isMounted) {
          setRequests(data);
        }
      } catch (currentError) {
        if (isMounted) {
          setError(
            currentError instanceof Error
              ? currentError.message
              : "Unable to load request history.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleRequests = requests.filter((request) => {
    const matchesQuery = `${request.title} ${request.businessName}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "All" || request.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="content-stack">
      <PageHeader
        title="Request History"
        description="Keep traceability of processed requests, reviewed outputs and archive status."
      />

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!isLoading && !error && requests.length === 0 ? (
        <EmptyState
          title="No requests found"
          description="Created workflow requests will appear here with their current status, priority and timestamps."
          action={
            <Link className="button" href="/requests/new">
              Create request
            </Link>
          }
        />
      ) : null}

      {!isLoading && !error && requests.length > 0 ? (
        <Card className="history-card">
          <div className="toolbar">
            <div className="field compact">
              <label htmlFor="historySearch">Search</label>
              <input
                className="input"
                id="historySearch"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or business"
                type="search"
                value={query}
              />
            </div>
            <div className="field compact">
              <label htmlFor="statusFilter">Status</label>
              <select
                className="select"
                id="statusFilter"
                onChange={(event) =>
                  setStatusFilter(event.target.value as RequestStatus | "All")
                }
                value={statusFilter}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {visibleRequests.length === 0 ? (
            <EmptyState
              title="No matching requests"
              description="Adjust the search or status filter to see more workflow requests."
            />
          ) : null}
          {visibleRequests.length > 0 ? (
            <div className="table-wrap">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Business</th>
                    <th>Request Type</th>
                    <th>Output Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.title}</td>
                      <td>{request.businessName}</td>
                      <td>{formatEnum(request.requestType)}</td>
                      <td>{formatEnum(request.desiredOutputType)}</td>
                      <td>
                        <PriorityBadge priority={request.priority} />
                      </td>
                      <td>
                        <Badge status={request.status} />
                      </td>
                      <td>{formatDate(request.createdAt)}</td>
                      <td>{formatDate(request.updatedAt)}</td>
                      <td>
                        <Link className="text-link" href={`/requests/${request.id}`}>
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
