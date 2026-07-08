import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { sampleWorkflowRequests } from "@/lib/sampleWorkflowRequests";

type RequestDetailPlaceholderProps = {
  requestId: string;
};

export function RequestDetailPlaceholder({
  requestId,
}: RequestDetailPlaceholderProps) {
  const request =
    sampleWorkflowRequests.find((item) => item.id === requestId) ??
    sampleWorkflowRequests[0];

  return (
    <div className="content-stack">
      <PageHeader
        title="Request Detail"
        description="A placeholder detail view for reviewing original input, generated output and reviewed output as separate workflow artifacts."
      />

      <section className="detail-grid">
        <article className="panel">
          <h2 className="panel-title">{request.title}</h2>
          <p>
            <strong>Business:</strong> {request.businessName}
          </p>
          <p>
            <strong>Type:</strong> {request.requestType}
          </p>
          <p>
            <strong>Priority:</strong> {request.priority}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`badge ${request.status.toLowerCase()}`}>
              {request.status}
            </span>
          </p>
        </article>

        <article className="panel">
          <h2 className="panel-title">Reviewed output</h2>
          <textarea
            className="textarea"
            defaultValue={request.reviewedOutput}
            aria-label="Reviewed output"
          />
          <div className="button-row">
            <button className="button" type="button">
              Copy placeholder
            </button>
            <button className="button secondary" type="button">
              Mark reviewed
            </button>
          </div>
        </article>
      </section>

      <EmptyState
        title="AI generation is not wired yet"
        description="The next implementation phase will connect this page to the backend API and mock AI workflow processor."
      />
    </div>
  );
}
