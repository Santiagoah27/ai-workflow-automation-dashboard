"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { PageHeader } from "@/components/ui/PageHeader";
import { createWorkflowRequest } from "@/services/workflowRequestsApi";
import {
  outputTypeOptions,
  priorityOptions,
  requestTypeOptions,
  type CreateWorkflowRequestPayload,
} from "@/types/workflowRequest";
import { formatEnum } from "@/lib/format";

const initialForm: CreateWorkflowRequestPayload = {
  businessName: "",
  title: "",
  requestType: "DocumentGeneration",
  context: "",
  notes: "",
  desiredOutputType: "ProfessionalEmail",
  priority: "Medium",
};

export function NewRequestForm() {
  const router = useRouter();
  const [form, setForm] = useState<CreateWorkflowRequestPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const created = await createWorkflowRequest({
        ...form,
        businessName: form.businessName.trim(),
        title: form.title.trim(),
        context: form.context.trim(),
        notes: form.notes.trim(),
      });

      router.push(`/requests/${created.id}`);
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : "Unable to create workflow request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="content-stack">
      <PageHeader
        title="New Request"
        description="Capture structured business context before generating an AI-assisted output for review."
      />

      {error ? <ErrorMessage message={error} /> : null}

      <Card>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="businessName">Business name</label>
            <input
              className="input"
              id="businessName"
              name="businessName"
              onChange={(event) =>
                setForm({ ...form, businessName: event.target.value })
              }
              placeholder="Example Clinic"
              type="text"
              value={form.businessName}
            />
          </div>

          <div className="field">
            <label htmlFor="title">Request title</label>
            <input
              className="input"
              id="title"
              name="title"
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Prepare client follow-up"
              type="text"
              value={form.title}
            />
          </div>

          <div className="field">
            <label htmlFor="requestType">Request type</label>
            <select
              className="select"
              id="requestType"
              name="requestType"
              onChange={(event) =>
                setForm({
                  ...form,
                  requestType:
                    event.target.value as CreateWorkflowRequestPayload["requestType"],
                })
              }
              value={form.requestType}
            >
              {requestTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {formatEnum(option)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="desiredOutputType">Desired output type</label>
            <select
              className="select"
              id="desiredOutputType"
              name="desiredOutputType"
              onChange={(event) =>
                setForm({
                  ...form,
                  desiredOutputType:
                    event.target
                      .value as CreateWorkflowRequestPayload["desiredOutputType"],
                })
              }
              value={form.desiredOutputType}
            >
              {outputTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {formatEnum(option)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select
              className="select"
              id="priority"
              name="priority"
              onChange={(event) =>
                setForm({
                  ...form,
                  priority:
                    event.target.value as CreateWorkflowRequestPayload["priority"],
                })
              }
              value={form.priority}
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="field full">
            <label htmlFor="context">Business context</label>
            <textarea
              className="textarea"
              id="context"
              name="context"
              onChange={(event) =>
                setForm({ ...form, context: event.target.value })
              }
              placeholder="Describe the situation, audience, constraints and desired business outcome."
              value={form.context}
            />
          </div>

          <div className="field full">
            <label htmlFor="notes">Notes</label>
            <textarea
              className="textarea"
              id="notes"
              name="notes"
              onChange={(event) =>
                setForm({ ...form, notes: event.target.value })
              }
              placeholder="Paste raw notes, source details or internal context."
              value={form.notes}
            />
          </div>

          <div className="field full">
            <div className="button-row">
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating..." : "Create request"}
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => {
                  setForm(initialForm);
                  setError(null);
                }}
                type="button"
                variant="secondary"
              >
                Clear
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

function validateForm(form: CreateWorkflowRequestPayload) {
  if (!form.businessName.trim()) {
    return "Business name is required.";
  }

  if (!form.title.trim()) {
    return "Request title is required.";
  }

  if (!form.context.trim()) {
    return "Business context is required.";
  }

  return null;
}
