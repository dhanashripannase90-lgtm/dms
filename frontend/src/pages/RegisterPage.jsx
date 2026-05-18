import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, requestOtp } from "../services/api";
import { saveAuthData } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";

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
    if (!form.email) {
      setError("Please enter your email to request an OTP.");
      return;
    }
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
    if (!otpSent) {
      handleRequestOtp();
      return;
    }
    setLoading(true); setError("");
    try {
      const { data } = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        otp: form.otp
      });
      saveAuthData(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const pwStrength = form.password.length === 0 ? null : form.password.length < 6 ? "weak" : "ok";

  return (
    <div className="auth-shell" style={{ position: "relative" }}>
      {/* Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-glow" style={{ top: "-10%", right: "0%", background: "var(--cyan-glow)", width: "900px", height: "900px" }} />
        <div className="mesh-glow" style={{ bottom: "-10%", left: "0%", background: "var(--violet-glow)", animationDelay: "-4s" }} />
      </div>

      <button className="theme-btn" onClick={toggle}
        style={{ position: "absolute", top: "2rem", right: "2rem", zIndex: 100, border: "none", background: "none", fontSize: "1.5rem" }}
        aria-label="Toggle theme">
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      <div className="glass-panel animate-slide-up" style={{ width: "100%", maxWidth: "500px", padding: "3rem", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="brand-icon" style={{ width: "60px", height: "60px", fontSize: "1.5rem", margin: "0 auto 1.5rem" }}>D</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-1px" }}>Join DMS Portal</h1>
          <p style={{ color: "var(--text-secondary)" }}>Start managing your documents like a pro.</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.5rem", borderRadius: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label className="field-label" style={{ marginLeft: "0.5rem" }}>Full Name</label>
            <input className="input-premium" type="text" placeholder="Dishu Pannase"
              required value={form.name} onChange={set("name")} />
          </div>
          <div>
            <label className="field-label" style={{ marginLeft: "0.5rem" }}>Email Address</label>
            <input className="input-premium" type="email" placeholder="name@company.com"
              required value={form.email} onChange={set("email")} />
          </div>
          <div>
            <label className="field-label" style={{ marginLeft: "0.5rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input className="input-premium" type={showPw ? "text" : "password"}
                placeholder="At least 6 characters" required minLength={6}
                value={form.password} onChange={set("password")} style={{ paddingRight: "3.5rem" }} />
              <button type="button" onClick={() => setShowPw((p) => !p)}
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
            {pwStrength && (
              <div style={{ padding: "0.5rem 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "10px", overflow: "hidden" }}>
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
              <input className="input-premium" type="text" placeholder="Enter 6-digit OTP"
                required value={form.otp} onChange={set("otp")} />
              <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                OTP sent to {form.email}
              </div>
            </div>
          )}
          <button className="btn-premium btn-full" type="submit" disabled={loading} style={{ padding: "1rem", fontSize: "1rem", marginTop: "1rem" }}>
            {loading ? <><span className="spinner" /> {otpSent ? "Creating account..." : "Sending OTP..."}</> : (otpSent ? "Verify & Create Account →" : "Request OTP")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--violet)", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
        </div>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/" style={{ color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
