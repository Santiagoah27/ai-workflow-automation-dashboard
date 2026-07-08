import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { sampleWorkflowRequests } from "@/lib/sampleWorkflowRequests";

export function DashboardOverview() {
  return (
    <div className="content-stack">
      <PageHeader
        title="Dashboard"
        description="A portfolio-ready starting point for tracking structured workflow requests, AI-assisted outputs and human review status."
      />

      <section className="section-grid" aria-label="Workflow summary">
        <StatCard label="Open Requests" value="3" note="Placeholder metric" />
        <StatCard label="Generated Outputs" value="2" note="Awaiting review" />
        <StatCard label="Reviewed" value="1" note="Ready to use" />
      </section>

      <section className="panel">
        <h2 className="panel-title">Recent workflow requests</h2>
        <div className="table-wrap">
          <table className="request-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleWorkflowRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.title}</td>
                  <td>{request.requestType}</td>
                  <td>{request.priority}</td>
                  <td>
                    <span className={`badge ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/requests/${request.id}`}>View detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
