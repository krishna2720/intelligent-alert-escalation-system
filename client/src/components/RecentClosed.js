import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1";

const RecentClosed = ({ data }) => {
  const [selected, setSelected] = useState(null);

  const fetchDetails = async (alertId) => {
    try {
      const res = await axios.get(`${BASE_URL}/alerts/${alertId}`);
      setSelected(res.data.data);
    } catch (error) {
      console.error("Error fetching alert details:", error);
    }
  };

  return (
    <div className="card">
      <h3>Recent Auto Closed Alerts</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Alert ID</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {data.map((alert) => (
            <tr
              key={alert._id}
              onClick={() => fetchDetails(alert.alertId)}
              style={{ cursor: "pointer" }}
            >
              <td>{alert.alertId}</td>
              <td>{alert.sourceType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Simple Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelected(null)}>
              &times;
            </button>

            <h4>Alert Details</h4>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Severity:</strong> {selected.severity}</p>
            <p><strong>Driver:</strong> {selected.driverId}</p>

            <h5>History</h5>
            <ul>
              {selected.history?.map((h, idx) => (
                <li key={idx}>
                  {h.fromState || "START"} &rarr; {h.toState} ({h.reason})
                </li>
              ))}
            </ul>

            <h5>Metadata</h5>
            <pre style={{ background: "#eee", padding: "10px" }}>
              {JSON.stringify(selected.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentClosed;
/*
{ "_id": "6aa6e94b206e8844e1b6e518",
    "sourceType": "overspeed",
    "severity": "WARNING",
     "status": "AUTO_CLOSED",
     "driverId": "D105",
     "metadata": {
               "speed": 100
                },
    "escalationCount": 0,
    "history": [{  "fromState": null,
                    "toState": "OPEN",
                    "reason": "Alert created",
                    "changedAt": "2026-09-13T18:19:55.887Z"
                },
                {   "fromState": "OPEN",
                    "toState": "AUTO_CLOSED",
                    "reason": "Alert expired",
                    "changedAt": "2026-09-15T11:20:00.828Z"
                }
            ],
    "alertId": "17a6ef3c-0372-4698-bff0-4462df4bbf2a",
    "createdAt": "2026-09-13T18:19:55.888Z",
    "updatedAt": "2026-09-15T11:20:00.829Z",
     "__v": 1
  },
  {........} , {.........} , {.......} ,  
} 
*/