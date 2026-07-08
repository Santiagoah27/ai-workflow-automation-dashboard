"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { getWorkflowRequests } from "@/services/workflowRequestsApi";
import type {
  RequestStatus,
  WorkflowRequestListItem,
} from "@/types/workflowRequest";
import { formatDate, formatEnum } from "@/lib/format";

const dashboardStatuses: RequestStatus[] = [
  "Draft",
  "Generated",
  "Reviewed",
  "Failed",
];

export function DashboardOverview() {
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
              : "Unable to load workflow requests.",
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

  const counts = useMemo(() => {
    return dashboardStatuses.reduce(
      (summary, status) => ({
        ...summary,
        [status]: requests.filter((request) => request.status === status).length,
      }),
      {} as Record<RequestStatus, number>,
    );
  }, [requests]);

  const recentRequests = requests.slice(0, 5);

  return (
    <div className="content-stack">
      <PageHeader
        title="Dashboard"
        description="Track workflow volume, request status and the latest AI-assisted outputs at a glance."
      />

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!isLoading && !error ? (
        <>
          <section className="section-grid" aria-label="Workflow summary">
            <StatCard
              label="Total Requests"
              value={String(requests.length)}
              note="All tracked workflow requests"
            />
            <StatCard
              label="Draft"
              value={String(counts.Draft)}
              note="Created but not generated"
            />
            <StatCard
              label="Generated"
              value={String(counts.Generated)}
              note="Ready for human review"
            />
            <StatCard
              label="Reviewed"
              value={String(counts.Reviewed)}
              note="Approved edited outputs"
            />
            <StatCard
              label="Failed"
              value={String(counts.Failed)}
              note="Needs attention"
            />
          </section>

          {requests.length === 0 ? (
            <EmptyState
              title="No workflow requests yet"
              description="Create the first request to see operational status and recent activity here."
            />
          ) : (
            <Card>
              <div className="panel-heading">
                <h2 className="panel-title">Recent requests</h2>
                <Link className="text-link" href="/history">
                  View history
                </Link>
              </div>
              <div className="table-wrap">
                <table className="request-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Business</th>
                      <th>Output</th>
                      <th>Status</th>
                      <th>Updated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => (
                      <tr key={request.id}>
                        <td>{request.title}</td>
                        <td>{request.businessName}</td>
                        <td>{formatEnum(request.desiredOutputType)}</td>
                        <td>
                          <Badge status={request.status} />
                        </td>
                        <td>{formatDate(request.updatedAt)}</td>
                        <td>
                          <Link
                            className="text-link"
                            href={`/requests/${request.id}`}
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}
