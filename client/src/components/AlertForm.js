import { useState } from "react";
import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const AlertForm = ({ onAlertCreated }) => {
  const [sourceType, setSourceType] = useState("");
  const [severity, setSeverity] = useState("WARNING");
  const [driverId, setDriverId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${BASE_URL}/alerts`, {
        sourceType: sourceType.trim(),
        severity,
        driverId: driverId.trim(),
      });

      setSuccess(`Alert created: ${response.data.data.alertId}`);
      setSourceType("");
      setDriverId("");
      await onAlertCreated();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create alert. Check the server connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h3>Generate Alert</h3>
      <form className="alert-form" onSubmit={handleSubmit}>
        <label>
          Source type
          <select
            name="sourceType"
            value={sourceType}
            onChange={(event) => setSourceType(event.target.value)}
            required
          >
            <option value="" disabled>Select source type</option>
            <option value="overspeed">Overspeed</option>
            <option value="compliance">Compliance</option>
            <option value="feedback_negative">Negative feedback</option>
          </select>
        </label>
        <label>
          Severity
          <select
            name="severity"
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </label>
        <label>
          Driver ID
          <input
            name="driverId"
            value={driverId}
            onChange={(event) => setDriverId(event.target.value)}
            placeholder="Enter driver ID"
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create alert"}
        </button>
        {error && <p className="form-feedback error" role="alert">{error}</p>}
        {success && <p className="form-feedback success" role="status">{success}</p>}
      </form>
    </section>
  );
};

export default AlertForm;
