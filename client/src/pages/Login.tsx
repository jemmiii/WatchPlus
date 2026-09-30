import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  MonitorCheck,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "watchplus_token",
        response.data.token
      );

      localStorage.setItem(
        "watchplus_user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      {/* LEFT PRODUCT PANEL */}
      <section className="auth-showcase">
        <div className="showcase-top">
          <div className="watchplus-logo">
            <div className="watchplus-logo-mark">W</div>

            <span>WatchPlus</span>
          </div>

          <div className="live-badge">
            <span />
            Systems operational
          </div>
        </div>

        <div className="showcase-content">
          <div className="eyebrow">
            <Activity size={15} />
            API OBSERVABILITY
          </div>

          <h1>
            Know when your
            <br />
            <span>APIs go down.</span>
          </h1>

          <p className="showcase-description">
            Monitor your endpoints, track response times,
            analyze uptime and catch incidents before your
            users do.
          </p>

          {/* MINI MONITOR CARD */}
          <div className="monitor-preview">
            <div className="preview-header">
              <div className="preview-service">
                <div className="service-icon">
                  <MonitorCheck size={17} />
                </div>

                <div>
                  <strong>Production API</strong>
                  <span>api.watchplus.dev</span>
                </div>
              </div>

              <div className="preview-status">
                <CheckCircle2 size={15} />
                Operational
              </div>
            </div>

            <div className="preview-chart">
              <div className="chart-grid grid-one" />
              <div className="chart-grid grid-two" />

              <svg
                viewBox="0 0 500 130"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="chartFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8b5cf6"
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 94 C35 90 45 62 78 70 C110 78 120 84 150 58 C180 32 195 65 225 55 C255 45 270 20 300 40 C330 60 350 54 375 32 C405 8 425 42 450 28 C470 17 485 25 500 14 L500 130 L0 130 Z"
                  fill="url(#chartFill)"
                />

                <path
                  d="M0 94 C35 90 45 62 78 70 C110 78 120 84 150 58 C180 32 195 65 225 55 C255 45 270 20 300 40 C330 60 350 54 375 32 C405 8 425 42 450 28 C470 17 485 25 500 14"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div className="preview-stats">
              <div>
                <span>Uptime</span>
                <strong>99.98%</strong>
              </div>

              <div>
                <span>Response</span>
                <strong>142ms</strong>
              </div>

              <div>
                <span>Checks</span>
                <strong>1,248</strong>
              </div>
            </div>
          </div>

          <div className="showcase-features">
            <div>
              <ShieldCheck size={17} />
              <span>Secure monitoring</span>
            </div>

            <div>
              <Activity size={17} />
              <span>Real-time metrics</span>
            </div>

            <div>
              <MonitorCheck size={17} />
              <span>Incident tracking</span>
            </div>
          </div>
        </div>

        <div className="showcase-footer">
          <span>Built for developers</span>

          <ArrowUpRight size={15} />
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className="auth-panel">
        <div className="mobile-logo">
          <div className="watchplus-logo-mark">W</div>
          <span>WatchPlus</span>
        </div>

        <div className="login-container">
          <div className="login-heading">
            <div className="login-kicker">WELCOME BACK</div>

            <h2>Sign in to your workspace</h2>

            <p>
              Continue monitoring your APIs and services.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="input-field">
              <div className="password-label">
                <label htmlFor="password">Password</label>
                <span>Secure login</span>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Sign in"}
              </span>

              {!loading && <ArrowUpRight size={18} />}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="signup-prompt">
            <span>Don't have a WatchPlus account?</span>

            <Link to="/register">
              Create account
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <p className="security-note">
            <ShieldCheck size={14} />
            Your credentials are protected with secure
            authentication.
          </p>
        </div>

        <div className="auth-panel-footer">
          <span>© 2026 WatchPlus</span>
          <span>API monitoring, simplified.</span>
        </div>
      </section>
    </div>
  );
}

export default Login;