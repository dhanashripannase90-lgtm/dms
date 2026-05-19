import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, requestOtp } from "../services/api";
import { saveAuthData } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";
import DmsLogo from "../components/DmsLogo";

const UserIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const MailIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);
const LockIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const KeyIcon = ({ size = 16, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
);
const EyeIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
const EyeOffIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
);
const SunIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
);
const MoonIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);

function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleRequestOtp = async () => {
    if (!form.email) { setError("Please enter your email to request an OTP."); return; }
    setLoading(true); setError("");
    try {
      await requestOtp({ email: form.email, purpose: "REGISTER" });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) { handleRequestOtp(); return; }
    setLoading(true); setError("");
    try {
      const { data } = await register({ name: form.name, email: form.email, password: form.password, otp: form.otp });
      saveAuthData(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const pwStrength = form.password.length === 0 ? null : form.password.length < 6 ? "weak" : "ok";

  return (
    <div className="auth-shell" style={{ position: "relative" }}>
      <div className="mesh-bg">
        <div className="mesh-glow" style={{ top: "-10%", right: "0%", background: "var(--cyan-glow)", width: "900px", height: "900px" }} />
        <div className="mesh-glow" style={{ bottom: "-10%", left: "0%", background: "var(--violet-glow)", animationDelay: "-4s" }} />
      </div>

      <button className="theme-btn" onClick={toggle}
        style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 100, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        aria-label="Toggle theme">
        {theme === "dark" ? <SunIcon color="var(--violet)" size={22} /> : <MoonIcon color="var(--violet)" size={22} />}
      </button>

      <div className="glass-panel animate-slide-up" style={{ width: "100%", maxWidth: "460px", padding: "clamp(1.5rem, 5vw, 3rem)", position: "relative", zIndex: 10, margin: "0 1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
          <DmsLogo size={56} />
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, marginTop: "1rem", marginBottom: "0.4rem", letterSpacing: "-1px", textAlign: "center" }}>Join DMS Portal</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "center" }}>Start managing your documents like a pro.</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.5rem", borderRadius: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label className="field-label" style={{ marginLeft: "0.5rem" }}>Full Name</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", display: "flex", color: "var(--text-muted)" }}><UserIcon size={16} /></span>
              <input className="input-premium" type="text" placeholder="Your full name"
                required value={form.name} onChange={set("name")} style={{ paddingLeft: "2.8rem" }} />
            </div>
          </div>
          <div>
            <label className="field-label" style={{ marginLeft: "0.5rem" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", display: "flex", color: "var(--text-muted)" }}><MailIcon size={16} /></span>
              <input className="input-premium" type="email" placeholder="name@company.com"
                required value={form.email} onChange={set("email")} style={{ paddingLeft: "2.8rem" }} />
            </div>
          </div>
          <div>
            <label className="field-label" style={{ marginLeft: "0.5rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", display: "flex", color: "var(--text-muted)" }}><KeyIcon size={16} /></span>
              <input className="input-premium" type={showPw ? "text" : "password"}
                placeholder="At least 6 characters" required minLength={6}
                value={form.password} onChange={set("password")} style={{ paddingLeft: "2.8rem", paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShowPw((p) => !p)}
                style={{ position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
                {showPw ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
            {pwStrength && (
              <div style={{ padding: "0.5rem 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "100px", overflow: "hidden" }}>
                  <div style={{ width: pwStrength === "weak" ? "30%" : "100%", height: "100%", background: pwStrength === "weak" ? "#ef4444" : "#10b981", transition: "width 0.3s ease" }} />
                </div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: pwStrength === "weak" ? "#ef4444" : "#10b981" }}>
                  {pwStrength === "weak" ? "Weak" : "Strong enough"}
                </span>
              </div>
            )}
          </div>
          {otpSent && (
            <div className="animate-slide-up">
              <label className="field-label" style={{ marginLeft: "0.5rem" }}>Verification OTP</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", display: "flex", color: "var(--text-muted)" }}><LockIcon size={16} /></span>
                <input className="input-premium" type="text" placeholder="Enter 6-digit OTP"
                  required value={form.otp} onChange={set("otp")} style={{ paddingLeft: "2.8rem" }} />
              </div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>OTP sent to {form.email}</div>
            </div>
          )}
          <button className="btn-premium btn-full" type="submit" disabled={loading} style={{ padding: "0.9rem", fontSize: "1rem", marginTop: "0.5rem", borderRadius: "100px" }}>
            {loading ? <><span className="spinner" /> {otpSent ? "Creating account..." : "Sending OTP..."}</> : (otpSent ? "Verify & Create Account →" : "Request OTP")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--violet)", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
        </div>
        <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
          <Link to="/" style={{ color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
