"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState } from "@/components/ui/LoadingState";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import {
  archiveWorkflowRequest,
  generateWorkflowRequest,
  getWorkflowRequestById,
  reviewWorkflowRequest,
} from "@/services/workflowRequestsApi";
import type { RequestStatus, WorkflowRequestDetail } from "@/types/workflowRequest";
import { formatDate, formatEnum } from "@/lib/format";

type RequestDetailProps = {
  requestId: string;
};

type ActionName = "generate" | "review" | "archive" | "copy" | null;

const workflowSteps: Array<{
  status: RequestStatus;
  label: string;
}> = [
  { status: "Draft", label: "Request captured" },
  { status: "Generated", label: "Output generated" },
  { status: "Reviewed", label: "Human reviewed" },
  { status: "Archived", label: "Archived" },
];

export function RequestDetail({ requestId }: RequestDetailProps) {
  const [request, setRequest] = useState<WorkflowRequestDetail | null>(null);
  const [reviewedOutput, setReviewedOutput] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<ActionName>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
          setIsReviewing(!data.reviewedOutput && Boolean(data.generatedOutput));
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

  const nextStep = useMemo(() => {
    if (!request) {
      return null;
    }

    if (request.status === "Archived") {
      return {
        title: "Archived",
        helper: "This request has been archived.",
        primaryLabel: null,
      };
    }

    if (request.status === "Failed") {
      return {
        title: "Retry generation",
        helper: request.errorMessage ?? "Generation failed. Retry with the captured business context.",
        primaryLabel: "Retry generation",
      };
    }

    if (request.status === "Draft" && !request.generatedOutput) {
      return {
        title: "Generate a first draft",
        helper: "Generate a first draft from the captured business context.",
        primaryLabel: "Generate AI output",
      };
    }

    if (request.status === "Generated" && !request.reviewedOutput) {
      return {
        title: isReviewing ? "Save reviewed output" : "Review and approve",
        helper: isReviewing
          ? "Save the human-approved final output."
          : "Review the AI-generated draft and save the approved version.",
        primaryLabel: isReviewing ? "Save reviewed output" : "Start review",
      };
    }

    if (request.status === "Reviewed") {
      return {
        title: "Ready to archive",
        helper: "The output has been reviewed and can now be archived.",
        primaryLabel: "Archive request",
      };
    }

    return {
      title: "Review workflow status",
      helper: "Check the request details and choose the next available action.",
      primaryLabel: null,
    };
  }, [isReviewing, request]);

  async function runAction(
    action: Exclude<ActionName, null>,
    task: () => Promise<void>,
  ) {
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
      setIsReviewing(!updated.reviewedOutput && Boolean(updated.generatedOutput));
      setNotice("Generated output is ready for review.");
    });
  }

  function handleStartReview() {
    if (!request?.generatedOutput) {
      setError("Generate output before starting review.");
      return;
    }

    setReviewedOutput(request.reviewedOutput ?? request.generatedOutput);
    setIsReviewing(true);
    setError(null);
    setNotice("Generated output copied into the review editor.");
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
      setIsReviewing(false);
      setNotice("Reviewed output saved.");
    });
  }

  async function handleArchive() {
    await runAction("archive", async () => {
      const updated = await archiveWorkflowRequest(requestId);
      setRequest(updated);
      setIsReviewing(false);
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

  function handlePrimaryNextAction() {
    if (!request) {
      return;
    }

    if (request.status === "Draft" || request.status === "Failed") {
      handleGenerate();
      return;
    }

    if (request.status === "Generated") {
      if (isReviewing) {
        handleReview();
      } else {
        handleStartReview();
      }
      return;
    }

    if (request.status === "Reviewed") {
      handleArchive();
    }
  }

  function getStepClass(stepStatus: RequestStatus) {
    if (!request) {
      return "detail-step";
    }

    const isActive =
      request.status === stepStatus ||
      (request.status === "Failed" && stepStatus === "Draft");

    return `detail-step ${isActive ? "active" : ""}`.trim();
  }

  return (
    <div className="request-detail-page">
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
          <header className="detail-header">
            <div>
              <Link className="text-link detail-back-link" href="/history">
                Back to history
              </Link>
              <div className="detail-title-row">
                <h1>{request.title}</h1>
                <Badge status={request.status} />
                <PriorityBadge priority={request.priority} />
              </div>
              <p>{request.businessName}</p>
            </div>
            <dl className="detail-timestamps" aria-label="Request timestamps">
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
          </header>

          <section className="detail-control-row">
            <nav className="detail-stepper" aria-label="Workflow progress">
              {workflowSteps.map((step, index) => (
                <span className={getStepClass(step.status)} key={step.status}>
                  <span>{index + 1}</span>
                  {step.label}
                </span>
              ))}
            </nav>

            {nextStep ? (
              <section className="next-step-panel" aria-label="Next step">
                <div>
                  <strong>{nextStep.title}</strong>
                  <p>{nextStep.helper}</p>
                </div>
                {nextStep.primaryLabel ? (
                  <Button
                    disabled={
                      activeAction !== null ||
                      (request.status === "Generated" &&
                        isReviewing &&
                        !reviewedOutput.trim())
                    }
                    onClick={handlePrimaryNextAction}
                    type="button"
                  >
                    {getPrimaryButtonLabel(nextStep.primaryLabel, activeAction)}
                  </Button>
                ) : null}
              </section>
            ) : null}
          </section>

          {request.status === "Failed" && request.errorMessage ? (
            <ErrorMessage message={request.errorMessage} />
          ) : null}

          <section className="detail-workspace">
            <aside className="detail-left-column">
              <Card className="compact-card">
                <h2 className="panel-title">Original input</h2>
                <dl className="compact-meta">
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
                    <dd>
                      <PriorityBadge priority={request.priority} />
                    </dd>
                  </div>
                </dl>
                <div className="compact-output-block">
                  <h3>Context</h3>
                  <p>{request.context}</p>
                  <h3>Notes</h3>
                  <p>{request.notes || "No notes provided."}</p>
                </div>
              </Card>
            </aside>

            <main className="detail-right-column">
              <Card className="compact-card output-card">
                <div className="compact-panel-heading">
                  <h2 className="panel-title">AI-generated output</h2>
                  <div className="button-row compact-actions">
                    {request.generatedOutput ? (
                      <>
                        <Button
                          disabled={activeAction !== null}
                          onClick={() => handleCopy(request.generatedOutput)}
                          type="button"
                          variant="secondary"
                        >
                          Copy
                        </Button>
                        {request.status !== "Archived" ? (
                          <Button
                            disabled={activeAction !== null}
                            onClick={handleGenerate}
                            type="button"
                            variant="secondary"
                          >
                            {activeAction === "generate"
                              ? "Regenerating..."
                              : "Regenerate"}
                          </Button>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>

                {request.generatedOutput ? (
                  <pre className="compact-output-pre">{request.generatedOutput}</pre>
                ) : (
                  <EmptyState
                    title="No generated output yet"
                    description="Generate a first draft from the captured business context."
                    action={
                      request.status === "Draft" ? (
                        <Button
                          disabled={activeAction !== null}
                          onClick={handleGenerate}
                          type="button"
                        >
                          {activeAction === "generate"
                            ? "Generating..."
                            : "Generate AI output"}
                        </Button>
                      ) : null
                    }
                  />
                )}
              </Card>

              <Card className="compact-card output-card">
                <div className="compact-panel-heading">
                  <div>
                    <h2 className="panel-title">Human-reviewed output</h2>
                    <p className="panel-copy">
                      Keep AI-generated and human-reviewed outputs separated.
                    </p>
                  </div>
                  <div className="button-row compact-actions">
                    {request.reviewedOutput && !isReviewing ? (
                      <>
                        <Button
                          disabled={activeAction !== null}
                          onClick={() => handleCopy(request.reviewedOutput)}
                          type="button"
                          variant="secondary"
                        >
                          Copy reviewed
                        </Button>
                        {request.status !== "Archived" ? (
                          <Button
                            disabled={activeAction !== null}
                            onClick={() => setIsReviewing(true)}
                            type="button"
                            variant="secondary"
                          >
                            Edit
                          </Button>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>

                {!request.generatedOutput ? (
                  <EmptyState
                    title="Review starts after generation"
                    description="Generate output first, then review and approve the final version."
                  />
                ) : null}

                {request.generatedOutput && !request.reviewedOutput && !isReviewing ? (
                  <EmptyState
                    title="This request is ready for review"
                    description="Start review to copy the generated draft into an editable final output."
                    action={
                      <Button
                        disabled={activeAction !== null}
                        onClick={handleStartReview}
                        type="button"
                      >
                        Start review
                      </Button>
                    }
                  />
                ) : null}

                {isReviewing ? (
                  <div className="review-editor">
                    <textarea
                      className="textarea reviewed-output compact-reviewed-output"
                      onChange={(event) => setReviewedOutput(event.target.value)}
                      placeholder="Edit the generated output before saving the human-approved version."
                      value={reviewedOutput}
                    />
                    <div className="button-row">
                      <Button
                        disabled={activeAction !== null || !reviewedOutput.trim()}
                        onClick={handleReview}
                        type="button"
                      >
                        {activeAction === "review"
                          ? "Saving..."
                          : "Save reviewed output"}
                      </Button>
                      <Button
                        disabled={activeAction !== null}
                        onClick={() => {
                          setReviewedOutput(
                            request.reviewedOutput ?? request.generatedOutput ?? "",
                          );
                          setIsReviewing(false);
                        }}
                        type="button"
                        variant="secondary"
                      >
                        Cancel review
                      </Button>
                    </div>
                  </div>
                ) : null}

                {request.reviewedOutput && !isReviewing ? (
                  <pre className="compact-output-pre reviewed">
                    {request.reviewedOutput}
                  </pre>
                ) : null}
              </Card>
            </main>
          </section>
        </>
      ) : null}
    </div>
  );
}

function getPrimaryButtonLabel(label: string, activeAction: ActionName) {
  if (activeAction === "generate") {
    return label === "Retry generation" ? "Retrying..." : "Generating...";
  }

  if (activeAction === "review") {
    return "Saving...";
  }

  if (activeAction === "archive") {
    return "Archiving...";
  }

  return label;
}
