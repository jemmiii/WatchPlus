import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./MonitorDetails.css";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Activity,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";
import type { Check, Monitor } from "../types";
import "./MonitorDetails.css";

function MonitorDetails() {
  const { id } = useParams<{ id: string }>();

  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const [monitorsResponse, historyResponse] =
        await Promise.all([
          api.get("/monitors"),
          api.get(`/monitors/${id}/history`),
        ]);

      const currentMonitor = monitorsResponse.data.find(
        (item: Monitor) => item._id === id
      );

      setMonitor(currentMonitor || null);
      setChecks(historyResponse.data.reverse());
    } catch (error) {
      console.error("Failed to load monitor details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="details-loading">
        <RefreshCw size={22} className="loading-icon" />
        <span>Loading monitor data...</span>
      </div>
    );
  }

  if (!monitor) {
    return (
      <div className="details-not-found">
        <AlertTriangle size={30} />
        <h2>Monitor not found</h2>

        <Link to="/dashboard">
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
      </div>
    );
  }

  const successfulChecks = checks.filter(
    (check) => check.status === "up"
  ).length;

  const failedChecks = checks.filter(
    (check) => check.status === "down"
  ).length;

  const averageResponse =
    checks.length > 0
      ? Math.round(
          checks.reduce(
            (sum, check) => sum + check.responseTime,
            0
          ) / checks.length
        )
      : 0;

  const chartData = checks.map((check) => ({
    time: new Date(check.checkedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    responseTime: check.responseTime,
    status: check.status,
  }));

  return (
    <div className="details-page">
      <header className="details-header">
        <div className="details-header-left">
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <div className="details-title">
            <div
              className={`details-status-icon ${
                monitor.status === "up"
                  ? "status-up"
                  : "status-down"
              }`}
            >
              <Activity size={21} />
            </div>

            <div>
              <div className="details-name-row">
                <h1>{monitor.name}</h1>

                <span
                  className={`status-pill ${
                    monitor.status === "up"
                      ? "pill-up"
                      : "pill-down"
                  }`}
                >
                  <span />
                  {monitor.status === "up"
                    ? "Operational"
                    : "Down"}
                </span>
              </div>

              <a
                href={monitor.url}
                target="_blank"
                rel="noreferrer"
                className="details-url"
              >
                {monitor.url}
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>

        <button
          className="refresh-details"
          onClick={fetchDetails}
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      <section className="details-stats">
        <div className="details-stat-card">
          <div className="details-stat-icon green">
            <CheckCircle2 size={18} />
          </div>

          <span>Current uptime</span>
          <strong>{monitor.uptime.toFixed(2)}%</strong>
        </div>

        <div className="details-stat-card">
          <div className="details-stat-icon purple">
            <Clock3 size={18} />
          </div>

          <span>Latest response</span>
          <strong>{monitor.responseTime}ms</strong>
        </div>

        <div className="details-stat-card">
          <div className="details-stat-icon blue">
            <Activity size={18} />
          </div>

          <span>Average response</span>
          <strong>{averageResponse}ms</strong>
        </div>

        <div className="details-stat-card">
          <div className="details-stat-icon orange">
            <AlertTriangle size={18} />
          </div>

          <span>Failed checks</span>
          <strong>{failedChecks}</strong>
        </div>
      </section>

      <section className="details-chart-card">
        <div className="details-card-heading">
          <div>
            <span>PERFORMANCE</span>
            <h2>Response time</h2>
            <p>
              Response latency across the latest checks.
            </p>
          </div>

          <div className="chart-legend">
            <span />
            Response time
          </div>
        </div>

        <div className="response-chart">
          {chartData.length === 0 ? (
            <div className="chart-empty">
              <Activity size={25} />
              <span>No monitoring data yet</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="responseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8b5cf6"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#202027"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  tick={{
                    fill: "#71717a",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#71717a",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  unit="ms"
                />

                <Tooltip
                  contentStyle={{
                    background: "#111114",
                    border: "1px solid #29292f",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "11px",
                  }}
                  formatter={(value) => [
                    `${value}ms`,
                    "Response",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="url(#responseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="history-card">
        <div className="details-card-heading">
          <div>
            <span>MONITORING HISTORY</span>
            <h2>Recent checks</h2>
          </div>

          <div className="history-summary">
            <span className="history-success">
              {successfulChecks} successful
            </span>

            <span className="history-failed">
              {failedChecks} failed
            </span>
          </div>
        </div>

        <div className="history-list">
          {checks.length === 0 ? (
            <div className="history-empty">
              No checks recorded yet.
            </div>
          ) : (
            checks
              .slice()
              .reverse()
              .slice(0, 10)
              .map((check) => (
                <div
                  className="history-row"
                  key={check._id}
                >
                  <div className="history-status">
                    <span
                      className={
                        check.status === "up"
                          ? "history-dot up"
                          : "history-dot down"
                      }
                    />

                    <div>
                      <strong>
                        {check.status === "up"
                          ? "Successful check"
                          : "Failed check"}
                      </strong>

                      <span>
                        {new Date(
                          check.checkedAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="history-value">
                    <strong>
                      {check.responseTime}ms
                    </strong>

                    <span>
                      {check.statusCode
                        ? `HTTP ${check.statusCode}`
                        : check.errorMessage ||
                          "Request failed"}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}

export default MonitorDetails;