import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Monitor,
  Pause,
  Play,
  Plus,
  Server,
  Settings,
  ShieldCheck,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

import api from "../services/api";
import type {
  DashboardOverview,
  Monitor as MonitorType,
} from "../types";

function Dashboard() {
  const [overview, setOverview] =
    useState<DashboardOverview | null>(null);

  const [monitors, setMonitors] =
    useState<MonitorType[]>([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "overview" | "monitors" | "analytics"
  >("overview");

  const dashboardMainRef = useRef<HTMLElement | null>(null);
  const overviewRef = useRef<HTMLElement | null>(null);
  const analyticsRef = useRef<HTMLElement | null>(null);
  const monitorsRef = useRef<HTMLElement | null>(null);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setIntervalValue] = useState("60");
  const [actionLoading, setActionLoading] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("watchplus_user") || "{}"
  );

  const fetchDashboard = async () => {
    try {
      const [overviewResponse, monitorsResponse] =
        await Promise.all([
          api.get("/dashboard/overview"),
          api.get("/monitors"),
        ]);

      setOverview(overviewResponse.data);
      setMonitors(monitorsResponse.data);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const refresh = setInterval(fetchDashboard, 30000);

    return () => clearInterval(refresh);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("watchplus_token");
    localStorage.removeItem("watchplus_user");

    window.location.href = "/";
  };

  const scrollToSection = (
    section: "overview" | "monitors" | "analytics"
  ) => {
    const target =
      section === "overview"
        ? overviewRef.current
        : section === "monitors"
          ? monitorsRef.current
          : analyticsRef.current;

    if (!target) return;

    setActiveSection(section);
    setMobileSidebar(false);

    const main = dashboardMainRef.current;

    if (main) {
      const mainStyles = window.getComputedStyle(main);
      const isScrollable =
        main.scrollHeight > main.clientHeight &&
        (mainStyles.overflowY === "auto" ||
          mainStyles.overflowY === "scroll");

      if (isScrollable) {
        const top =
          target.getBoundingClientRect().top -
          main.getBoundingClientRect().top +
          main.scrollTop -
          24;

        main.scrollTo({
          top: Math.max(0, top),
          behavior: "smooth",
        });

        return;
      }
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleAddMonitor = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!name.trim() || !url.trim()) return;

    try {
      setActionLoading(true);

      await api.post("/monitors", {
        name,
        url,
        interval: Number(interval),
      });

      setName("");
      setUrl("");
      setIntervalValue("60");
      setShowModal(false);

      await fetchDashboard();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Unable to create monitor"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handlePauseResume = async (
    monitor: MonitorType
  ) => {
    try {
      const action = monitor.isActive
        ? "pause"
        : "resume";

      await api.patch(
        `/monitors/${monitor._id}/${action}`
      );

      await fetchDashboard();
    } catch (error) {
      console.error(
        "Monitor action failed:",
        error
      );
    }
  };

  const handleDelete = async (
    monitorId: string
  ) => {
    const confirmed = window.confirm(
      "Delete this monitor and its monitoring history?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/monitors/${monitorId}`
      );

      await fetchDashboard();
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );
    }
  };

  return (
    <div className="dashboard-shell">

      {/* Mobile overlay */}
      {mobileSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setMobileSidebar(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`dashboard-sidebar ${
          mobileSidebar
            ? "sidebar-open"
            : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            W
          </div>

          <div>
            <strong>
              WatchPlus
            </strong>

            <span>
              API observability
            </span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">
            WORKSPACE
          </span>

          <button
            type="button"
            className={`sidebar-link ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() => scrollToSection("overview")}
          >
            <LayoutDashboard size={17} />
            Overview
          </button>

          <button
            type="button"
            className={`sidebar-link ${
              activeSection === "monitors" ? "active" : ""
            }`}
            onClick={() => scrollToSection("monitors")}
          >
            <Monitor size={17} />
            Monitors
          </button>

          <button
            type="button"
            className={`sidebar-link ${
              activeSection === "analytics" ? "active" : ""
            }`}
            onClick={() => scrollToSection("analytics")}
          >
            <BarChart3 size={17} />
            Analytics
          </button>
        </div>

        <div className="sidebar-section sidebar-bottom">
          <span className="sidebar-label">
            ACCOUNT
          </span>

          <button className="sidebar-link">
            <Settings size={17} />
            Settings
          </button>

          <button
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {(user.name || "J")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {user.name || "User"}
            </strong>

            <span>
              {user.email ||
                "user@example.com"}
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main ref={dashboardMainRef} className="dashboard-main" id="overview">

        <header ref={overviewRef} className="dashboard-header">

          <button
            className="mobile-menu"
            onClick={() =>
              setMobileSidebar(true)
            }
          >
            <Menu size={20} />
          </button>

          <div>

            <div className="header-eyebrow">
              <span className="live-dot" />
              LIVE MONITORING
            </div>

            <h1>
              Good morning,{" "}
              {user.name || "Jemin"}.
            </h1>

            <p>
              Here's what's happening across
              your monitored services.
            </p>

          </div>

          <button
            className="add-monitor-button"
            onClick={() =>
              setShowModal(true)
            }
          >
            <Plus size={18} />
            Add monitor
          </button>

        </header>

        {/* STATS */}
        <section ref={analyticsRef} className="stats-grid" id="analytics">

          <div className="stat-card">

            <div className="stat-top">
              <span>
                Total monitors
              </span>

              <div className="stat-icon purple">
                <Server size={18} />
              </div>
            </div>

            <strong>
              {loading
                ? "--"
                : overview?.totalMonitors ??
                  0}
            </strong>

            <div className="stat-footer">
              <TrendingUp size={14} />
              <span>
                Active workspace
              </span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-top">
              <span>
                Online
              </span>

              <div className="stat-icon green">
                <CheckCircle2 size={18} />
              </div>
            </div>

            <strong>
              {loading
                ? "--"
                : overview?.onlineMonitors ??
                  0}
            </strong>

            <div className="stat-footer success">
              <span className="mini-live-dot" />
              <span>
                Systems operational
              </span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-top">
              <span>
                Average uptime
              </span>

              <div className="stat-icon blue">
                <ShieldCheck size={18} />
              </div>
            </div>

            <strong>
              {loading
                ? "--"
                : `${overview?.averageUptime ?? 0}%`}
            </strong>

            <div className="stat-footer">
              <Activity size={14} />
              <span>
                Across all monitors
              </span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-top">
              <span>
                Avg. response
              </span>

              <div className="stat-icon orange">
                <Zap size={18} />
              </div>
            </div>

            <strong>
              {loading
                ? "--"
                : `${overview?.averageResponseTime ?? 0}ms`}
            </strong>

            <div className="stat-footer">
              <Clock3 size={14} />
              <span>
                Latest measurements
              </span>
            </div>

          </div>

        </section>

        {/* MONITORS */}
        <section ref={monitorsRef} className="monitors-section" id="monitors">

          <div className="section-heading">

            <div>
              <h2>
                Your monitors
              </h2>

              <p>
                Keep an eye on the health
                of your endpoints.
              </p>
            </div>

            <button
              className="filter-button"
              onClick={fetchDashboard}
            >
              Last 30 seconds
              <ChevronDown size={15} />
            </button>

          </div>

          {monitors.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                <Monitor size={25} />
              </div>

              <h3>
                No monitors yet
              </h3>

              <p>
                Add your first API endpoint
                and start monitoring its
                health.
              </p>

              <button
                className="add-monitor-button"
                onClick={() =>
                  setShowModal(true)
                }
              >
                <Plus size={17} />
                Add your first monitor
              </button>

            </div>

          ) : (

            <div className="monitor-grid">

              {monitors.map((monitor) => (

                <article
                  className="monitor-card"
                  key={monitor._id}
                >

                  <div className="monitor-card-header">

                    <div className="monitor-title">

                      <div
                        className={`monitor-status-icon ${
                          monitor.status ===
                          "up"
                            ? "status-up"
                            : monitor.status ===
                              "down"
                            ? "status-down"
                            : "status-unknown"
                        }`}
                      >
                        <Monitor size={18} />
                      </div>

                      <div>

                        <h3>
                          {monitor.name}
                        </h3>

                        <a
                          href={monitor.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {monitor.url}
                          <ArrowUpRight
                            size={12}
                          />
                        </a>

                      </div>

                    </div>

                    <div
                      className={`status-pill ${
                        monitor.status ===
                        "up"
                          ? "pill-up"
                          : monitor.status ===
                            "down"
                          ? "pill-down"
                          : "pill-unknown"
                      }`}
                    >
                      <span />

                      {monitor.status ===
                      "up"
                        ? "Operational"
                        : monitor.status ===
                          "down"
                        ? "Down"
                        : "Unknown"}
                    </div>

                  </div>

                  <div className="monitor-metrics">

                    <div>
                      <span>
                        Uptime
                      </span>

                      <strong>
                        {monitor.uptime.toFixed(
                          2
                        )}
                        %
                      </strong>
                    </div>

                    <div>
                      <span>
                        Response
                      </span>

                      <strong>
                        {monitor.responseTime}
                        ms
                      </strong>
                    </div>

                    <div>
                      <span>
                        Interval
                      </span>

                      <strong>
                        {monitor.interval}s
                      </strong>
                    </div>

                  </div>

                  <div className="monitor-card-footer">

                    <span>
                      {monitor.lastChecked
                        ? `Checked ${new Date(
                            monitor.lastChecked
                          ).toLocaleTimeString()}`
                        : "Not checked yet"}
                    </span>

                    <div className="monitor-actions">

                      {/* VIEW DETAILS */}
                      <Link
                        to={`/monitor/${monitor._id}`}
                        className="view-details-button"
                      >
                        View details
                        <ArrowUpRight
                          size={13}
                        />
                      </Link>

                      {/* PAUSE / RESUME */}
                      <button
                        title={
                          monitor.isActive
                            ? "Pause"
                            : "Resume"
                        }
                        onClick={() =>
                          handlePauseResume(
                            monitor
                          )
                        }
                      >
                        {monitor.isActive ? (
                          <Pause size={14} />
                        ) : (
                          <Play size={14} />
                        )}
                      </button>

                      {/* DELETE */}
                      <button
                        title="Delete"
                        className="delete-action"
                        onClick={() =>
                          handleDelete(
                            monitor._id
                          )
                        }
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* ADD MONITOR MODAL */}
      {showModal && (

        <div
          className="modal-backdrop"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="monitor-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="modal-kicker">
                  NEW MONITOR
                </span>

                <h2>
                  Add endpoint
                </h2>

                <p>
                  Start tracking the health
                  of an API.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleAddMonitor}
            >

              <div className="modal-field">

                <label>
                  Monitor name
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Production API"
                  required
                />

              </div>

              <div className="modal-field">

                <label>
                  Endpoint URL
                </label>

                <input
                  type="url"
                  value={url}
                  onChange={(event) =>
                    setUrl(
                      event.target.value
                    )
                  }
                  placeholder="https://api.example.com/health"
                  required
                />

              </div>

              <div className="modal-field">

                <label>
                  Check interval
                </label>

                <select
                  value={interval}
                  onChange={(event) =>
                    setIntervalValue(
                      event.target.value
                    )
                  }
                >
                  <option value="30">
                    Every 30 seconds
                  </option>

                  <option value="60">
                    Every 1 minute
                  </option>

                  <option value="300">
                    Every 5 minutes
                  </option>

                  <option value="600">
                    Every 10 minutes
                  </option>
                </select>

              </div>

              <button
                type="submit"
                className="modal-submit"
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Creating..."
                  : "Create monitor"}

                {!actionLoading && (
                  <ArrowUpRight
                    size={17}
                  />
                )}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;