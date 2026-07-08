"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { getWorkflowRequests } from "@/services/workflowRequestsApi";
import type { WorkflowRequestListItem } from "@/types/workflowRequest";
import { formatDate, formatEnum } from "@/lib/format";

export function RequestHistory() {
  const [requests, setRequests] = useState<WorkflowRequestListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="content-stack">
      <PageHeader
        title="Request History"
        description="Review every workflow request moving through draft, generation, human review and archive states."
      />

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!isLoading && !error && requests.length === 0 ? (
        <EmptyState
          title="No requests found"
          description="Created workflow requests will appear here with their current status and timestamps."
        />
      ) : null}

      {!isLoading && !error && requests.length > 0 ? (
        <Card>
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
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.title}</td>
                    <td>{request.businessName}</td>
                    <td>{formatEnum(request.requestType)}</td>
                    <td>{formatEnum(request.desiredOutputType)}</td>
                    <td>{request.priority}</td>
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
        </Card>
      ) : null}
    </div>
  );
}
