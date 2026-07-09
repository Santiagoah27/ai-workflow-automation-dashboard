"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState } from "@/components/ui/LoadingState";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { useToast } from "@/components/ui/ToastProvider";
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
type WorkflowStep = "captured" | "generated" | "review" | "archive";
type TransitionDirection = "forward" | "back";

const workflowSteps: Array<{
  key: WorkflowStep;
  label: string;
}> = [
  { key: "captured", label: "Request captured" },
  { key: "generated", label: "AI output generated" },
  { key: "review", label: "Human reviewed" },
  { key: "archive", label: "Archived" },
];

export function RequestDetail({ requestId }: RequestDetailProps) {
  const { showToast } = useToast();
  const [request, setRequest] = useState<WorkflowRequestDetail | null>(null);
  const [activeStep, setActiveStep] = useState<WorkflowStep>("captured");
  const [transitionDirection, setTransitionDirection] =
    useState<TransitionDirection>("forward");
  const [reviewedOutput, setReviewedOutput] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<ActionName>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialRequest() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getWorkflowRequestById(requestId);

        if (isMounted) {
          setRequest(data);
          setReviewedOutput(data.reviewedOutput ?? "");
          setIsReviewing(false);
          setActiveStep(getInitialStep(data));
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

  function goToStep(step: WorkflowStep) {
    setTransitionDirection(getStepIndex(step) >= getStepIndex(activeStep) ? "forward" : "back");
    setActiveStep(step);
    setError(null);
  }

  async function runAction(
    action: Exclude<ActionName, null>,
    task: () => Promise<void>,
    errorMessage: string,
  ) {
    try {
      setActiveAction(action);
      setError(null);
      await task();
    } catch (currentError) {
      showToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setActiveAction(null);
    }
  }

  async function handleGenerate() {
    await runAction("generate", async () => {
      const updated = await generateWorkflowRequest(requestId);
      setRequest(updated);
      setReviewedOutput(updated.reviewedOutput ?? "");
      setIsReviewing(false);
      setTransitionDirection("forward");
      setActiveStep("generated");
      showToast({ message: "AI-generated output created.", type: "success" });
    }, "Could not generate output.");
  }

  function handleStartReview() {
    if (!request?.generatedOutput) {
      setError("Generate output before starting review.");
      return;
    }

    setReviewedOutput(request.reviewedOutput ?? request.generatedOutput);
    setIsReviewing(true);
    goToStep("review");
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
      setActiveStep("review");
      showToast({ message: "Reviewed output saved.", type: "success" });
    }, "Could not save reviewed output.");
  }

  async function handleArchive() {
    await runAction("archive", async () => {
      const updated = await archiveWorkflowRequest(requestId);
      setRequest(updated);
      setIsReviewing(false);
      setActiveStep("archive");
      showToast({ message: "Request archived.", type: "success" });
    }, "Could not archive request.");
  }

  async function handleCopy(value: string | null) {
    if (!value) {
      showToast({ message: "Could not copy to clipboard.", type: "error" });
      return;
    }

    await runAction("copy", async () => {
      await navigator.clipboard.writeText(value);
      showToast({ message: "Copied to clipboard.", type: "success" });
    }, "Could not copy to clipboard.");
  }

  function handleCancelReview() {
    setReviewedOutput(request?.reviewedOutput ?? request?.generatedOutput ?? "");
    setIsReviewing(false);
    goToStep("generated");
  }

  function renderActiveStep() {
    if (!request) {
      return null;
    }

    const panelClass = `guided-step-panel ${transitionDirection === "forward" ? "from-right" : "from-left"}`;

    return (
      <section
        aria-live="polite"
        className={panelClass}
        key={activeStep}
      >
        {activeStep === "captured" ? renderCapturedStep(request) : null}
        {activeStep === "generated" ? renderGeneratedStep(request) : null}
        {activeStep === "review" ? renderReviewStep(request) : null}
        {activeStep === "archive" ? renderArchiveStep(request) : null}
      </section>
    );
  }

  function renderCapturedStep(currentRequest: WorkflowRequestDetail) {
    const isFailed = currentRequest.status === "Failed";
    const canGenerate = isFailed || !currentRequest.generatedOutput;

    return (
      <div className="guided-step-card">
        <div className="guided-step-header">
          <div>
            <span className="step-eyebrow">Step 1</span>
            <h2>Review captured request</h2>
            <p>Review the captured request before generating an AI-assisted draft.</p>
          </div>
          <Badge status={currentRequest.status} />
        </div>

        {isFailed && currentRequest.errorMessage ? (
          <ErrorMessage message={currentRequest.errorMessage} />
        ) : null}

        <dl className="guided-meta-grid">
          <div>
            <dt>Business</dt>
            <dd>{currentRequest.businessName}</dd>
          </div>
          <div>
            <dt>Request type</dt>
            <dd>{formatEnum(currentRequest.requestType)}</dd>
          </div>
          <div>
            <dt>Desired output</dt>
            <dd>{formatEnum(currentRequest.desiredOutputType)}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>
              <PriorityBadge priority={currentRequest.priority} />
            </dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDate(currentRequest.createdAt)}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{formatDate(currentRequest.updatedAt)}</dd>
          </div>
        </dl>

        <div className="guided-copy-grid">
          <section>
            <h3>Context</h3>
            <p>{currentRequest.context}</p>
          </section>
          <section>
            <h3>Notes</h3>
            <p>{currentRequest.notes || "No notes provided."}</p>
          </section>
        </div>

        <div className="guided-actions">
          {canGenerate ? (
            <Button
              disabled={activeAction !== null}
              onClick={handleGenerate}
              type="button"
            >
              {activeAction === "generate"
                ? isFailed
                  ? "Retrying..."
                  : "Generating..."
                : isFailed
                  ? "Retry generation"
                  : "Generate AI output"}
            </Button>
          ) : (
            <Button onClick={() => goToStep("generated")} type="button">
              Continue to AI output
            </Button>
          )}
          <Link className="button secondary" href="/history">
            Back to history
          </Link>
        </div>
      </div>
    );
  }

  function renderGeneratedStep(currentRequest: WorkflowRequestDetail) {
    return (
      <div className="guided-step-card">
        <div className="guided-step-header">
          <div>
            <span className="step-eyebrow">Step 2</span>
            <h2>AI output generated</h2>
            <p>
              AI generated a first draft from the captured context. Review it
              before creating the approved version.
            </p>
          </div>
          <Badge status={currentRequest.status} />
        </div>

        {currentRequest.generatedOutput ? (
          <>
            <aside className="guided-summary">
              <strong>{currentRequest.title}</strong>
              <span>{formatEnum(currentRequest.desiredOutputType)}</span>
            </aside>
            <pre className="guided-output">{currentRequest.generatedOutput}</pre>
            <div className="guided-actions">
              {currentRequest.status === "Generated" ? (
                <Button
                  disabled={activeAction !== null}
                  onClick={handleStartReview}
                  type="button"
                >
                  Start human review
                </Button>
              ) : null}
              {currentRequest.status === "Reviewed" ? (
                <Button onClick={() => goToStep("review")} type="button">
                  View reviewed output
                </Button>
              ) : null}
              {currentRequest.status === "Archived" ? (
                <Button onClick={() => goToStep("archive")} type="button">
                  Back to archived request
                </Button>
              ) : null}
              <Button
                disabled={activeAction !== null}
                onClick={() => handleCopy(currentRequest.generatedOutput)}
                type="button"
                variant="secondary"
              >
                Copy generated output
              </Button>
              {currentRequest.status === "Generated" ? (
                <Button
                  disabled={activeAction !== null}
                  onClick={handleGenerate}
                  type="button"
                  variant="secondary"
                >
                  {activeAction === "generate" ? "Regenerating..." : "Regenerate output"}
                </Button>
              ) : null}
              <Button
                disabled={activeAction !== null}
                onClick={() => goToStep("captured")}
                type="button"
                variant="secondary"
              >
                Back to request input
              </Button>
              <Link className="button secondary" href="/history">
                Back to history
              </Link>
            </div>
          </>
        ) : (
          <EmptyState
            title="No generated output yet"
            description="Generate a first draft from the captured business context."
            action={
              <Button
                disabled={activeAction !== null}
                onClick={handleGenerate}
                type="button"
              >
                {activeAction === "generate" ? "Generating..." : "Generate AI output"}
              </Button>
            }
          />
        )}
      </div>
    );
  }

  function renderReviewStep(currentRequest: WorkflowRequestDetail) {
    const hasSavedReview = Boolean(currentRequest.reviewedOutput) && !isReviewing;

    return (
      <div className="guided-step-card">
        <div className="guided-step-header">
          <div>
            <span className="step-eyebrow">Step 3</span>
            <h2>Human reviewed</h2>
            <p>Edit and approve the final human-reviewed output.</p>
          </div>
          <Badge status={currentRequest.status} />
        </div>

        {!currentRequest.generatedOutput ? (
          <EmptyState
            title="Review starts after generation"
            description="Generate output first, then review and approve the final version."
            action={
              <Button
                onClick={() => goToStep("captured")}
                type="button"
                variant="secondary"
              >
                Back to request input
              </Button>
            }
          />
        ) : null}

        {currentRequest.generatedOutput && hasSavedReview ? (
          <>
            <section className="guided-confirmation">
              <h3>Human-reviewed output saved.</h3>
              <p>The approved version is stored separately from the AI-generated draft.</p>
            </section>
            <pre className="guided-output reviewed">{currentRequest.reviewedOutput}</pre>
            <div className="guided-actions">
              <Button onClick={() => goToStep("archive")} type="button">
                {currentRequest.status === "Archived"
                  ? "Back to archived request"
                  : "Continue to archive"}
              </Button>
              <Button
                disabled={activeAction !== null}
                onClick={() => handleCopy(currentRequest.reviewedOutput)}
                type="button"
                variant="secondary"
              >
                Copy reviewed output
              </Button>
              {currentRequest.status !== "Archived" ? (
                <Button
                  disabled={activeAction !== null}
                  onClick={() => {
                    setReviewedOutput(currentRequest.reviewedOutput ?? "");
                    setIsReviewing(true);
                  }}
                  type="button"
                  variant="secondary"
                >
                  Edit reviewed output
                </Button>
              ) : null}
              <Button
                onClick={() => goToStep("generated")}
                type="button"
                variant="secondary"
              >
                Back to AI output
              </Button>
              <Link className="button secondary" href="/history">
                Back to history
              </Link>
            </div>
          </>
        ) : null}

        {currentRequest.generatedOutput && !hasSavedReview ? (
          <div className="review-editor">
            <label className="field">
              <span>Reviewed output</span>
              <textarea
                className="textarea reviewed-output compact-reviewed-output"
                onChange={(event) => setReviewedOutput(event.target.value)}
                placeholder="Edit the generated output before saving the human-approved version."
                value={reviewedOutput}
              />
            </label>

            <details className="guided-reference">
              <summary>Show generated draft reference</summary>
              <pre className="guided-output reference">
                {currentRequest.generatedOutput}
              </pre>
            </details>

            <div className="guided-actions">
              <Button
                disabled={activeAction !== null || !reviewedOutput.trim()}
                onClick={handleReview}
                type="button"
              >
                {activeAction === "review" ? "Saving..." : "Save reviewed output"}
              </Button>
              <Button
                disabled={activeAction !== null}
                onClick={() => handleCancelReview()}
                type="button"
                variant="secondary"
              >
                Cancel review
              </Button>
              <Button
                disabled={activeAction !== null}
                onClick={() => goToStep("generated")}
                type="button"
                variant="secondary"
              >
                Back to AI output
              </Button>
              <Link className="button secondary" href="/history">
                Back to history
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  function renderArchiveStep(currentRequest: WorkflowRequestDetail) {
    const outputSummary =
      currentRequest.reviewedOutput ??
      currentRequest.generatedOutput ??
      "No reviewed output has been saved yet.";

    return (
      <div className="guided-step-card">
        <div className="guided-step-header">
          <div>
            <span className="step-eyebrow">Step 4</span>
            <h2>{currentRequest.status === "Archived" ? "Archived" : "Ready to archive"}</h2>
            <p>Archive the request once the reviewed output is complete.</p>
          </div>
          <Badge status={currentRequest.status} />
        </div>

        {currentRequest.status === "Archived" ? (
          <section className="guided-confirmation">
            <h3>This request has been archived.</h3>
            <p>The reviewed output remains available in request history for traceability.</p>
          </section>
        ) : currentRequest.status === "Reviewed" ? (
          <section className="guided-confirmation">
            <h3>This request has been reviewed and is ready to be archived.</h3>
            <p>Archiving closes the workflow while keeping the final output available.</p>
          </section>
        ) : (
          <EmptyState
            title="Archive comes after human review"
            description="Save a human-reviewed output before closing this workflow."
            action={
              <Button
                onClick={() =>
                  currentRequest.generatedOutput
                    ? goToStep("generated")
                    : goToStep("captured")
                }
                type="button"
                variant="secondary"
              >
                Back to current step
              </Button>
            }
          />
        )}

        <pre className="guided-output reviewed">{outputSummary}</pre>

        <div className="guided-actions">
          {currentRequest.status === "Reviewed" ? (
            <Button
              disabled={activeAction !== null}
              onClick={handleArchive}
              type="button"
              variant="danger"
            >
              {activeAction === "archive" ? "Archiving..." : "Archive request"}
            </Button>
          ) : null}
          {currentRequest.status === "Reviewed" ? (
            <Button
              onClick={() => goToStep("review")}
              type="button"
              variant="secondary"
            >
              Back to reviewed output
            </Button>
          ) : null}
          <Link className="button secondary" href="/history">
            Back to history
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="guided-detail-page">
      {isLoading ? <LoadingState message="Loading request detail..." /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {!isLoading && !error && !request ? (
        <EmptyState
          title="Request not found"
          description="The selected workflow request could not be found."
        />
      ) : null}

      {request ? (
        <>
          <header className="guided-detail-header">
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
          </header>

          <nav className="guided-stepper" aria-label="Workflow progress">
            {workflowSteps.map((step, index) => (
              <button
                className={getStepClass(step.key, activeStep, request)}
                disabled={!canNavigateToStep(step.key, activeStep, request)}
                key={step.key}
                onClick={() => goToStep(step.key)}
                type="button"
              >
                <span>{index + 1}</span>
                {step.label}
              </button>
            ))}
          </nav>

          {renderActiveStep()}
        </>
      ) : null}
    </div>
  );
}

function getInitialStep(request: WorkflowRequestDetail): WorkflowStep {
  if (request.status === "Archived" || request.status === "Reviewed") {
    return "archive";
  }

  if (request.status === "Generated") {
    return "generated";
  }

  return "captured";
}

function getStepIndex(step: WorkflowStep) {
  return workflowSteps.findIndex((workflowStep) => workflowStep.key === step);
}

function getStepClass(
  step: WorkflowStep,
  activeStep: WorkflowStep,
  request: WorkflowRequestDetail,
) {
  const isActive = step === activeStep;
  const isComplete = isStepComplete(step, request);
  const isFailed = request.status === "Failed" && step === "captured";

  return [
    "guided-step",
    isActive ? "active" : "",
    isComplete ? "complete" : "",
    isFailed ? "failed" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function canNavigateToStep(
  step: WorkflowStep,
  activeStep: WorkflowStep,
  request: WorkflowRequestDetail,
) {
  if (step === activeStep || step === "captured") {
    return true;
  }

  if (step === "generated") {
    return Boolean(request.generatedOutput);
  }

  if (step === "review") {
    return activeStep === "review" || Boolean(request.reviewedOutput);
  }

  return request.status === "Reviewed" || request.status === "Archived";
}

function isStepComplete(step: WorkflowStep, request: WorkflowRequestDetail) {
  if (step === "captured") {
    return true;
  }

  if (step === "generated") {
    return Boolean(request.generatedOutput);
  }

  if (step === "review") {
    return Boolean(request.reviewedOutput);
  }

  return request.status === "Archived";
}
