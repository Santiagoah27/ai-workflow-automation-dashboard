"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
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
  "Archived",
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
        description="Turn repetitive work into structured requests, AI-assisted drafts and reviewed outputs your team can trace."
      />

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!isLoading && !error ? (
        <>
          <section className="section-grid" aria-label="Workflow summary">
            <StatCard
              label="Total requests"
              value={String(requests.length)}
              note="All workflow requests created in the system."
            />
            <StatCard
              label="Draft"
              value={String(counts.Draft)}
              note="Requests captured but not generated yet."
              tone="draft"
            />
            <StatCard
              label="Generated"
              value={String(counts.Generated)}
              note="AI-assisted output ready for review."
              tone="generated"
            />
            <StatCard
              label="Reviewed"
              value={String(counts.Reviewed)}
              note="Outputs reviewed or edited by the user."
              tone="reviewed"
            />
            <StatCard
              label="Failed"
              value={String(counts.Failed)}
              note="Requests that failed during generation."
              tone="failed"
            />
            <StatCard
              label="Archived"
              value={String(counts.Archived)}
              note="Completed requests kept for traceability."
              tone="archived"
            />
          </section>

          <section className="cta-panel">
            <div>
              <h2>Standardize the next repetitive request</h2>
              <p>
                Capture business context once, generate a consistent draft and keep
                reviewed output separate from the original input.
              </p>
            </div>
            <Link className="button" href="/requests/new">
              Create workflow request
            </Link>
          </section>

          {requests.length === 0 ? (
            <EmptyState
              title="No workflow requests yet"
              description="Create the first request to see operational status, recent activity and reviewed outputs here."
              action={
                <Link className="button" href="/requests/new">
                  Create first request
                </Link>
              }
            />
          ) : (
            <Card className="table-panel">
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
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Updated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="table-primary">{request.title}</td>
                        <td className="table-secondary">{request.businessName}</td>
                        <td>{formatEnum(request.desiredOutputType)}</td>
                        <td>
                          <PriorityBadge priority={request.priority} />
                        </td>
                        <td>
                          <Badge status={request.status} />
                        </td>
                        <td>{formatDate(request.updatedAt)}</td>
                        <td>
                          <Link
                            className="text-link row-action"
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
