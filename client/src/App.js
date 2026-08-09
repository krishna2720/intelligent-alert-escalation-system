import { useEffect, useState } from "react";
import axios from "axios";
import Summary from "./components/Summary.js";
import TopDrivers from "./components/TopDrivers.js";
import Trends from "./components/Trends.js";
import RecentClosed from "./components/RecentClosed.js";
import RuleConfig from "./components/RuleConfiguration.js";

const BASE_URL = "http://localhost:5000/api/v1";

function App() {
  const [summaryData, setSummaryData] = useState([]);
  const [driverStats, setDriverStats] = useState([]);
  const [closedAlerts, setClosedAlerts] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ruleConfig, setRuleConfig] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Core metric APIs
      const [summary, drivers, closed, trends] = await Promise.all([
        axios.get(`${BASE_URL}/dashboard/summary`),
        axios.get(`${BASE_URL}/dashboard/top-drivers`),
        axios.get(`${BASE_URL}/dashboard/recent-auto-closed`),
        axios.get(`${BASE_URL}/dashboard/trends`),
      ]);

      setSummaryData(summary.data.data);
      setDriverStats(drivers.data.data);
      setClosedAlerts(closed.data.data);
      setTrendData(trends.data.data);

      // Protected/Optional Rules API - isolated call
      try {
        const rules = await axios.get(`${BASE_URL}/dashboard/rules`);
        setRuleConfig(rules.data.data);
      } catch (ruleErr) {
        console.warn("Rules endpoint protected or unavailable");
      }
    } catch (err) {
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="title">Intelligent Alert Dashboard</div>

      <Summary data={summaryData} />
      <TopDrivers data={driverStats} />
      <Trends data={trendData} />
      <RecentClosed data={closedAlerts} />
      {ruleConfig && <RuleConfig rules={ruleConfig} />}
    </div>
  );
}

export default App;