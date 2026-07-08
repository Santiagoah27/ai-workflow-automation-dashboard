"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  archiveWorkflowRequest,
  generateWorkflowRequest,
  getWorkflowRequestById,
  reviewWorkflowRequest,
} from "@/services/workflowRequestsApi";
import type { WorkflowRequestDetail } from "@/types/workflowRequest";
import { formatDate, formatEnum } from "@/lib/format";

type RequestDetailProps = {
  requestId: string;
};

type ActionName = "generate" | "review" | "archive" | "copy" | null;

export function RequestDetail({ requestId }: RequestDetailProps) {
  const [request, setRequest] = useState<WorkflowRequestDetail | null>(null);
  const [reviewedOutput, setReviewedOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<ActionName>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadRequest() {
    const data = await getWorkflowRequestById(requestId);
    setRequest(data);
    setReviewedOutput(data.reviewedOutput ?? data.generatedOutput ?? "");
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialRequest() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getWorkflowRequestById(requestId);

        if (isMounted) {
          setRequest(data);
          setReviewedOutput(data.reviewedOutput ?? data.generatedOutput ?? "");
        }
      } catch (currentError) {
        if (isMounted) {
          setError(
            currentError instanceof Error
              ? currentError.message
              : "Unable to load workflow request.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialRequest();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  async function runAction(action: Exclude<ActionName, null>, task: () => Promise<void>) {
    try {
      setActiveAction(action);
      setError(null);
      setNotice(null);
      await task();
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : "The action could not be completed.",
      );
    } finally {
      setActiveAction(null);
    }
  }

  async function handleGenerate() {
    await runAction("generate", async () => {
      const updated = await generateWorkflowRequest(requestId);
      setRequest(updated);
      setReviewedOutput(updated.reviewedOutput ?? updated.generatedOutput ?? "");
      setNotice("Generated output is ready for review.");
    });
  }

  async function handleReview() {
    if (!reviewedOutput.trim()) {
      setError("Reviewed output is required.");
      return;
    }

    await runAction("review", async () => {
      const updated = await reviewWorkflowRequest(requestId, {
        reviewedOutput: reviewedOutput.trim(),
      });
      setRequest(updated);
      setReviewedOutput(updated.reviewedOutput ?? "");
      setNotice("Reviewed output saved.");
    });
  }

  async function handleArchive() {
    await runAction("archive", async () => {
      const updated = await archiveWorkflowRequest(requestId);
      setRequest(updated);
      setNotice("Request archived.");
    });
  }

  async function handleCopy(value: string | null) {
    if (!value) {
      setError("There is no output to copy yet.");
      return;
    }

    await runAction("copy", async () => {
      await navigator.clipboard.writeText(value);
      setNotice("Output copied.");
    });
  }

  return (
    <div className="content-stack">
      <PageHeader
        title="Request Detail"
        description="Review original inputs, generated output and the human-approved final version."
      />

      {isLoading ? <LoadingState message="Loading request detail..." /> : null}
      {error ? <ErrorMessage message={error} /> : null}
      {notice ? <section className="success-message">{notice}</section> : null}

      {!isLoading && !error && !request ? (
        <EmptyState
          title="Request not found"
          description="The selected workflow request could not be found."
        />
      ) : null}

      {request ? (
        <>
          <section className="detail-grid">
            <Card>
              <div className="panel-heading">
                <h2 className="panel-title">{request.title}</h2>
                <Badge status={request.status} />
              </div>
              <dl className="meta-list">
                <div>
                  <dt>Business</dt>
                  <dd>{request.businessName}</dd>
                </div>
                <div>
                  <dt>Request type</dt>
                  <dd>{formatEnum(request.requestType)}</dd>
                </div>
                <div>
                  <dt>Desired output</dt>
                  <dd>{formatEnum(request.desiredOutputType)}</dd>
                </div>
                <div>
                  <dt>Priority</dt>
                  <dd>{request.priority}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatDate(request.createdAt)}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{formatDate(request.updatedAt)}</dd>
                </div>
                <div>
                  <dt>Processed</dt>
                  <dd>{formatDate(request.processedAt)}</dd>
                </div>
              </dl>
              {request.errorMessage ? (
                <ErrorMessage message={request.errorMessage} />
              ) : null}
            </Card>

            <Card>
              <h2 className="panel-title">Actions</h2>
              <div className="button-row">
                <Button
                  disabled={activeAction !== null}
                  onClick={handleGenerate}
                  type="button"
                >
                  {activeAction === "generate" ? "Generating..." : "Generate AI output"}
                </Button>
                <Button
                  disabled={activeAction !== null}
                  onClick={handleReview}
                  type="button"
                  variant="secondary"
                >
                  {activeAction === "review" ? "Saving..." : "Save reviewed output"}
                </Button>
                <Button
                  disabled={activeAction !== null}
                  onClick={handleArchive}
                  type="button"
                  variant="danger"
                >
                  {activeAction === "archive" ? "Archiving..." : "Archive request"}
                </Button>
              </div>
              <Link className="text-link inline-link" href="/history">
                Back to history
              </Link>
            </Card>
          </section>

          <section className="detail-grid">
            <Card>
              <h2 className="panel-title">Original input</h2>
              <div className="output-block">
                <h3>Context</h3>
                <p>{request.context}</p>
                <h3>Notes</h3>
                <p>{request.notes || "No notes provided."}</p>
              </div>
            </Card>

            <Card>
              <div className="panel-heading">
                <h2 className="panel-title">Generated output</h2>
                <Button
                  disabled={activeAction !== null || !request.generatedOutput}
                  onClick={() => handleCopy(request.generatedOutput)}
                  type="button"
                  variant="secondary"
                >
                  Copy
                </Button>
              </div>
              <pre className="output-pre">
                {request.generatedOutput ?? "Generate AI output to create a draft."}
              </pre>
            </Card>
          </section>

          <Card>
            <div className="panel-heading">
              <h2 className="panel-title">Reviewed output</h2>
              <Button
                disabled={activeAction !== null || !reviewedOutput.trim()}
                onClick={() => handleCopy(reviewedOutput)}
                type="button"
                variant="secondary"
              >
                Copy
              </Button>
            </div>
            <textarea
              className="textarea reviewed-output"
              onChange={(event) => setReviewedOutput(event.target.value)}
              placeholder="Edit the generated output here before saving the reviewed version."
              value={reviewedOutput}
            />
          </Card>
        </>
      ) : null}
    </div>
  );
}
