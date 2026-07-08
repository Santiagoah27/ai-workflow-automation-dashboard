import { PageHeader } from "@/components/ui/PageHeader";

export function NewRequestPlaceholder() {
  return (
    <div className="content-stack">
      <PageHeader
        title="New Request"
        description="A structured request form placeholder for capturing business context before AI-assisted processing is implemented."
      />

      <section className="panel">
        <h2 className="panel-title">Workflow request draft</h2>
        <form className="form-grid">
          <div className="field">
            <label htmlFor="businessName">Business name</label>
            <input
              className="input"
              id="businessName"
              name="businessName"
              placeholder="Example Clinic"
              type="text"
            />
          </div>

          <div className="field">
            <label htmlFor="title">Request title</label>
            <input
              className="input"
              id="title"
              name="title"
              placeholder="Summarize client intake notes"
              type="text"
            />
          </div>

          <div className="field">
            <label htmlFor="requestType">Request type</label>
            <select className="select" id="requestType" name="requestType">
              <option>Document generation</option>
              <option>Business summary</option>
              <option>Client response</option>
              <option>Internal report</option>
              <option>Process analysis</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="desiredOutputType">Desired output</label>
            <select
              className="select"
              id="desiredOutputType"
              name="desiredOutputType"
            >
              <option>Professional email</option>
              <option>Structured report</option>
              <option>Action plan</option>
              <option>Executive summary</option>
              <option>Client-facing response</option>
            </select>
          </div>

          <div className="field full">
            <label htmlFor="context">Business context</label>
            <textarea
              className="textarea"
              id="context"
              name="context"
              placeholder="Describe the workflow, audience and business goal."
            />
          </div>

          <div className="field full">
            <label htmlFor="notes">Notes</label>
            <textarea
              className="textarea"
              id="notes"
              name="notes"
              placeholder="Paste raw notes or source details here."
            />
          </div>

          <div className="field full">
            <div className="button-row">
              <button className="button" type="button">
                Save draft placeholder
              </button>
              <button className="button secondary" type="button">
                Clear
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
