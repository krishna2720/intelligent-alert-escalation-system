import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from "chart.js";

import { Line } from "react-chartjs-2";

// Register required components
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,);

const Trends = ({ data }) => {
                        const chartData = {
                                   labels: data.map((item) => item._id),
                                   datasets: [ {  label: "Total Alerts",
                                                  data: data.map((item) => item.total),
                                                  borderColor: "#3498db",
                                                  tension: 0.1,
                                                },
                                               {  label: "Escalations",
                                                  data: data.map((item) => item.escalated),
                                                  borderColor: "#e74c3c",                                          
                                                  tension: 0.1,
                                                },
                                               {  label: "Auto Closed",
                                                  data: data.map((item) => item.autoClosed),
                                                  borderColor: "#2ecc71",
                                                  tension: 0.1,
                                                },
                                             ],
                          };

     return (
              <div className="card">
                          <h3>Alert Trends</h3>
                          <Line data={chartData} />
              </div>
            );
};

export default Trends;
/*
 [  {"_id": "2026-08-09","total": 3, "escalated": 0,"autoClosed": 3 },
    {"_id": "2026-09-12","total": 14,"escalated": 0,"autoClosed": 11 },
    {"_id": "2026-09-13","total": 12,"escalated": 1,"autoClosed": 8 },
    {"_id": "2026-09-14","total": 3,"escalated": 1,"autoClosed": 0  }
 ]
*/