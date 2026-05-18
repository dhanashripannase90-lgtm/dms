import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { saveAuthData } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";

// Pixel-perfect, modern Lucide SVG Icons matching the premium theme
const MailIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const KeyIcon = ({ size = 16, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const EyeIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const SunIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const LogoIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))", flexShrink: 0 }}>
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <path d="M12 2L2 7l10 5 10-5-10-5Z" fill="url(#logoGrad)" />
    <path d="M2 17l10 5 10-5" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>
);

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await login(form);
      saveAuthData(data);
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell" style={{ position: "relative" }}>
      {/* Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-glow" style={{ top: "0%", left: "0%", background: "var(--violet-glow)", width: "800px", height: "800px" }} />
        <div className="mesh-glow" style={{ bottom: "0%", right: "0%", background: "var(--gold-glow)", animationDelay: "-3s" }} />
      </div>

      <button className="theme-btn" onClick={toggle}
        style={{ position: "absolute", top: "2rem", right: "2rem", zIndex: 100, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        aria-label="Toggle theme">
        {theme === "dark" ? <SunIcon color="var(--violet)" size={24} /> : <MoonIcon color="var(--violet)" size={24} />}
      </button>

      <div className="glass-panel animate-slide-up" style={{ width: "100%", maxWidth: "450px", padding: "3rem", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2.5rem" }}>
          <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoIcon size={56} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-1px" }}>Welcome Back</h1>
          <p style={{ color: "var(--text-secondary)" }}>Securely access your document vault.</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.5rem", borderRadius: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label className="field-label" style={{ marginLeft: "0.5rem" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
                <MailIcon size={16} />
              </span>
              <input className="input-premium" type="email" placeholder="name@company.com"
                required value={form.email} onChange={set("email")} style={{ paddingLeft: "3rem" }} />
            </div>
          </div>
          
          <div>
            <label className="field-label" style={{ marginLeft: "0.5rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
                <KeyIcon size={16} />
              </span>
              <input className="input-premium" type={showPw ? "text" : "password"}
                placeholder="••••••••" required
                value={form.password} onChange={set("password")} style={{ paddingLeft: "3rem", paddingRight: "3.5rem" }} />
              <button type="button" onClick={() => setShowPw((p) => !p)}
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {showPw ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
            <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
              <Link to="/forgot-password" style={{ color: "var(--violet)", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>Forgot Password?</Link>
            </div>
          </div>
          
          <button className="btn-premium btn-full" type="submit" disabled={loading} style={{ padding: "1rem", fontSize: "1rem", marginTop: "1rem", borderRadius: "100px" }}>
            {loading ? <><span className="spinner" /> Signing in...</> : "Sign In →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--violet)", fontWeight: 700, textDecoration: "none" }}>Create one free</Link>
        </div>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/" style={{ color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
