import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestOtp, resetPassword } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleRequestOtp = async () => {
    if (!form.email) {
      setError("Please enter your email to request an OTP.");
      return;
    }
    setLoading(true); setError(""); setSuccess("");
    try {
      await requestOtp({ email: form.email, purpose: "RESET_PASSWORD" });
      setOtpSent(true);
      setSuccess("OTP has been sent to your email.");
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
    setLoading(true); setError(""); setSuccess("");
    try {
      await resetPassword({
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword
      });
      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell" style={{ position: "relative" }}>
      <div className="mesh-bg">
        <div className="mesh-glow" style={{ top: "0%", left: "0%", background: "var(--violet-glow)", width: "800px", height: "800px" }} />
        <div className="mesh-glow" style={{ bottom: "0%", right: "0%", background: "var(--gold-glow)", animationDelay: "-3s" }} />
      </div>

      <button className="theme-btn" onClick={toggle}
        style={{ position: "absolute", top: "2rem", right: "2rem", zIndex: 100, border: "none", background: "none", fontSize: "1.5rem" }}
        aria-label="Toggle theme">
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      <div className="glass-panel animate-slide-up" style={{ width: "100%", maxWidth: "450px", padding: "3rem", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="brand-icon" style={{ width: "60px", height: "60px", fontSize: "1.5rem", margin: "0 auto 1.5rem" }}>D</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-1px" }}>Reset Password</h1>
          <p style={{ color: "var(--text-secondary)" }}>Securely recover your account.</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.5rem", borderRadius: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" style={{ marginBottom: "1.5rem", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10b981", padding: "1rem" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label className="field-label" style={{ marginLeft: "0.5rem" }}>Email Address</label>
            <input className="input-premium" type="email" placeholder="name@company.com"
              required value={form.email} onChange={set("email")} disabled={otpSent} />
          </div>
          
          {otpSent && (
            <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label className="field-label" style={{ marginLeft: "0.5rem" }}>Verification OTP</label>
                <input className="input-premium" type="text" placeholder="Enter 6-digit OTP"
                  required value={form.otp} onChange={set("otp")} />
              </div>
              
              <div>
                <label className="field-label" style={{ marginLeft: "0.5rem" }}>New Password</label>
                <div style={{ position: "relative" }}>
                  <input className="input-premium" type={showPw ? "text" : "password"}
                    placeholder="At least 6 characters" required minLength={6}
                    value={form.newPassword} onChange={set("newPassword")} style={{ paddingRight: "3.5rem" }} />
                  <button type="button" onClick={() => setShowPw((p) => !p)}
                    style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <button className="btn-premium btn-full" type="submit" disabled={loading} style={{ padding: "1rem", fontSize: "1rem", marginTop: "1rem" }}>
            {loading ? <><span className="spinner" /> {otpSent ? "Resetting..." : "Sending OTP..."}</> : (otpSent ? "Reset Password →" : "Request OTP")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Remembered your password?{" "}
          <Link to="/login" style={{ color: "var(--violet)", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
