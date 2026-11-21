import { useCallback, useEffect, useState } from "react";

import axios from "axios";  //frontend nd backend connection

import Summary from "./components/Summary.js";
import TopDrivers from "./components/TopDrivers.js";
import Trends from "./components/Trends.js";
import RecentClosed from "./components/RecentClosed.js";
import RuleConfig from "./components/RuleConfiguration.js";
import AlertForm from "./components/AlertForm.js";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

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
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">IA</div>
          <div>
            <strong>Alert Management</strong>
            <span>System</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#severity-summary">Severity Summary</a>
          <a href="#top-offenders">Top Offenders</a>
          <a href="#recent-auto-closed">Recent Auto Closed Alerts</a>
          <a href="#alert-trends">Alert Trends</a>
          <a href="#generate-alert">Generate Alert</a>
          <a href="#rules">Dynamic Rules Configuration</a>
        </nav>
        <div className="sidebar-status">
          <span className="status-dot" />
          <div>
            <strong>Active</strong>
            <span>Live</span>
          </div>
        </div>
      </aside>
      <main className="dashboard" id="dashboard">
        <header className="dashboard-header">
          <h1>Intelligent Alert Dashboard</h1>
          <p>Real-time threat monitoring and alert analysis</p>
        </header>

        {!loading && !error && (
          <section className="dashboard-top-grid">
            <div id="severity-summary">
              <Summary data={summaryData} />
            </div>
            <div id="top-offenders">
              <TopDrivers data={driverStats} />
            </div>
            <div id="recent-auto-closed" className="recent-alerts">
              <RecentClosed data={closedAlerts} />
            </div>
          </section>
        )}

        <section className="dashboard-bottom-grid">
          <div className="dashboard-main-column">
            {loading ? (
              <div className="card">Loading dashboard...</div>
            ) : error ? (
              <div className="card" role="alert">{error}</div>
            ) : (
              <>
                <div id="alert-trends">
                  <Trends data={trendData} />
                </div>
                {ruleConfig && (
                  <div id="rules">
                    <RuleConfig rules={ruleConfig} />
                  </div>
                )}
              </>
            )}
          </div>
          <aside className="alert-column" id="generate-alert">
            <AlertForm onAlertCreated={loadDashboard} />
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;
