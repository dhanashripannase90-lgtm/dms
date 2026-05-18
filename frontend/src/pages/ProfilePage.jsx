import { useState } from "react";
import Navbar from "../components/Navbar";
import { updateProfile } from "../services/api";
import { getAuthData, saveAuthData } from "../utils/auth";

function ProfilePage() {
  const auth = getAuthData();
  const [name, setName] = useState(auth?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const res = await updateProfile({ name, password: password || null });
      const updatedAuth = { ...auth, name: res.data.name };
      saveAuthData(updatedAuth);
      
      setSuccess("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update profile.");
    } finally {
      setBusy(false);
    }
  };

  const initials = name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className="page-shell animate-fade" style={{ background: "radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, rgba(5, 5, 10, 0) 50%), var(--bg)" }}>
      <Navbar />
      <div className="page-content" style={{ maxWidth: "1200px", margin: "0 auto", padding: "7.5rem 2rem 4rem" }}>
        
        {/* Page Header */}
        <div style={{ marginBottom: "3.5rem", textAlign: "center" }} className="animate-slide-up">
          <div style={{ display: "inline-flex", alignItems: "center", justifySelf: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "100px", color: "var(--violet)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "1rem" }}>
            🛡️ Secure Account Manager
          </div>
          <h1 className="page-title" style={{ fontSize: "2.8rem", fontWeight: 900, background: "linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Account Profile
          </h1>
          <p className="page-subtitle" style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>Update your identity settings and cryptographic passwords.</p>
        </div>

        {success && <div className="alert alert-success animate-fade" style={{ marginBottom: "2rem", boxShadow: "0 4px 20px rgba(16,185,129,0.15)" }}>✨ {success}</div>}
        {error && <div className="alert alert-error animate-fade" style={{ marginBottom: "2rem", boxShadow: "0 4px 20px rgba(239,68,68,0.15)" }}>⚠️ {error}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 2fr", gap: "2.5rem", alignItems: "start" }}>
          
          {/* LEFT COLUMN: PREMIUM USER CARD */}
          <div className="glass-panel animate-slide-up" style={{ padding: "2.5rem 2rem", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid var(--border-strong)" }}>
            
            {/* Status indicator */}
            <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.8rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "100px" }}>
              <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 8px #10b981" }} />
              <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase" }}>Online</span>
            </div>

            {/* Glowing Avatar circle */}
            <div style={{ position: "relative", marginBottom: "2rem", marginTop: "1rem" }}>
              <div style={{ position: "absolute", inset: "-8px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", opacity: 0.35, filter: "blur(8px)" }} />
              <div style={{ width: "130px", height: "130px", fontSize: "3rem", background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, position: "relative", border: "4px solid var(--bg-surface)", boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)" }}>
                {initials}
              </div>
            </div>

            <div style={{ textAlign: "center", width: "100%", marginBottom: "2.5rem" }}>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 0.4rem 0", color: "var(--text-primary)" }}>{name}</h3>
              <span className="badge badge-violet" style={{ fontSize: "0.75rem", padding: "0.35rem 1.2rem", border: "1px solid var(--violet-glow)", letterSpacing: "1.5px" }}>
                🔑 {auth?.role}
              </span>
            </div>

            {/* Account Details list */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.2rem", background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>ACCOUNT ID</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 700, fontFamily: "monospace" }}>#{auth?.id || "N/A"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>SYSTEM EMAIL</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 700 }}>{auth?.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>PRIVILEGES</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: auth?.role === "ADMIN" ? "rgba(234, 179, 8, 0.1)" : "rgba(6, 182, 212, 0.1)", color: auth?.role === "ADMIN" ? "var(--gold)" : "var(--cyan)", border: auth?.role === "ADMIN" ? "1px solid var(--gold-glow)" : "1px solid var(--cyan-glow)", borderRadius: "4px" }}>
                  {auth?.role === "ADMIN" ? "FULL ACCESS" : "STANDARD"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PREMIUM EDIT FORM */}
          <div className="glass-panel animate-slide-up" style={{ padding: "3rem", border: "1px solid var(--border-strong)", position: "relative" }}>
            
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              {/* Profile details section */}
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>👤</span> Profile Information
                </h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label className="field-label">System Username / Email</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem", color: "var(--text-muted)" }}>✉️</span>
                      <input className="input-premium" value={auth?.email || ""} disabled style={{ paddingLeft: "3rem", opacity: 0.5, cursor: "not-allowed", borderStyle: "dashed" }} />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Role Classification</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem", color: "var(--text-muted)" }}>🛡️</span>
                      <input className="input-premium" value={auth?.role || ""} disabled style={{ paddingLeft: "3rem", opacity: 0.5, cursor: "not-allowed", borderStyle: "dashed", textTransform: "uppercase" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="field-label">Display Full Name</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem", color: "var(--text-muted)" }}>👤</span>
                    <input className="input-premium" value={name} onChange={e => setName(e.target.value)} placeholder="Type your full name" style={{ paddingLeft: "3rem" }} required />
                  </div>
                </div>
              </div>

              {/* Decorative separator */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Credentials Security</span>
                <span style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              </div>

              {/* Password update section */}
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>🔒</span> Update Password
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>Leave these fields empty if you do not want to change your current password.</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label className="field-label">New Password</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem", color: "var(--text-muted)" }}>🔑</span>
                      <input type={showPass ? "text" : "password"} className="input-premium" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: "3rem" }} minLength={6} />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "1.2rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.1rem" }}>
                        {showPass ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Confirm New Password</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem", color: "var(--text-muted)" }}>🔑</span>
                      <input type={showPass ? "text" : "password"} className="input-premium" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: "3rem" }} minLength={6} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button type="submit" className="btn-premium" disabled={busy} style={{ marginTop: "1rem", alignSelf: "flex-end", padding: "0.9rem 2.5rem", borderRadius: "100px", fontSize: "1rem", fontWeight: 700, gap: "0.6rem" }}>
                {busy ? (
                  <>
                    <span className="spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    💾 Save Changes
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
