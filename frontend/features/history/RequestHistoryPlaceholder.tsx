import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { sampleWorkflowRequests } from "@/lib/sampleWorkflowRequests";

export function RequestHistoryPlaceholder() {
  return (
    <div className="content-stack">
      <PageHeader
        title="Request History"
        description="A placeholder history view for reviewed, generated and draft workflow requests. API integration will be added in a later phase."
      />

      <section className="panel">
        <h2 className="panel-title">Workflow request list</h2>
        <div className="table-wrap">
          <table className="request-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Desired Output</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleWorkflowRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.title}</td>
                  <td>{request.desiredOutputType}</td>
                  <td>
                    <span className={`badge ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{request.updatedAt}</td>
                  <td>
                    <Link href={`/requests/${request.id}`}>Open</Link>
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
