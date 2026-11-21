import { useCallback, useEffect, useState } from "react";

import axios from "axios";  //frontend nd backend connection

import Summary from "./components/Summary.js";
import TopDrivers from "./components/TopDrivers.js";
import Trends from "./components/Trends.js";
import RecentClosed from "./components/RecentClosed.js";
import RuleConfig from "./components/RuleConfiguration.js";
import AlertForm from "./components/AlertForm.js";

const BASE_URL = "http://localhost:5000/api/v1";      //our backend server url so can fetch data on our frontend

function App() {
  const [summaryData, setSummaryData] = useState([]);
  const [driverStats, setDriverStats] = useState([]);
  const [closedAlerts, setClosedAlerts] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ruleConfig, setRuleConfig] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
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

      try {
        const rules = await axios.get(`${BASE_URL}/dashboard/rules`);
        setRuleConfig(rules.data.data);
      } catch (ruleErr) {
        console.warn("Unable to load dashboard rules", ruleErr);
      }
      setError(null);
    } catch (err) {
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="app-layout">
      <aside className="alert-sidebar">
        <AlertForm onAlertCreated={loadDashboard} />
      </aside>
      <main className="dashboard">
        <div className="title">Intelligent Alert Dashboard</div>
        {loading ? (
          <div className="card">Loading dashboard...</div>
        ) : error ? (
          <div className="card" role="alert">{error}</div>
        ) : (
          <>
            <Summary data={summaryData} />
            <TopDrivers data={driverStats} />
            <Trends data={trendData} />
            <RecentClosed data={closedAlerts} />
            {ruleConfig && <RuleConfig rules={ruleConfig} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
