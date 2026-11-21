import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Trends = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Total Alerts",
        data: data.map((item) => item.total),
        borderColor: "#4f8cff",
        borderDash: [5, 5],
        tension: 0.1,
      },
      {
        label: "Escalations",
        data: data.map((item) => item.escalated),
        borderColor: "#ef4444",
        tension: 0.1,
      },
      {
        label: "Auto Closed",
        data: data.map((item) => item.autoClosed),
        borderColor: "#22c55e",
        tension: 0.1,
      },
      {
        label: "Resolved",
        data: data.map((item) => item.resolved),
        borderColor: "#a855f7",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#cbd5e1" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(148, 163, 184, 0.12)" },
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(148, 163, 184, 0.12)" },
      },
    },
  };

  return (
    <div className="card">
      <h3>Alert Trends</h3>
      <div className="trend-chart">
        <Line data={chartData} options={chartOptions} />
      </div>
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