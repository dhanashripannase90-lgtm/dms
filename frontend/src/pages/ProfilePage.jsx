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
      // Update local storage so the UI header updates immediately
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
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>👤 Profile Settings</h1>
          <p className="page-subtitle">Manage your personal account details and credentials.</p>
        </div>

        {success && <div className="alert alert-success" style={{ marginBottom: "2rem" }}>{success}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        <div className="glass-panel" style={{ padding: "3rem", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "center" }}>
          {/* Avatar Section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center" }}>
            <div className="avatar" style={{ width: "120px", height: "120px", fontSize: "2.5rem", background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}>
              {initials}
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0.5rem 0 0.2rem 0" }}>{name}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "1px" }}>{auth?.role}</p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label className="field-label">Email Address</label>
                <input className="input-premium" value={auth?.email || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
              </div>
              <div>
                <label className="field-label">Role</label>
                <input className="input-premium" value={auth?.role || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed", textTransform: "uppercase" }} />
              </div>
            </div>

            <div>
              <label className="field-label">Full Name</label>
              <input className="input-premium" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" required />
            </div>

            <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "1rem 0" }} />
            
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0" }}>Change Password <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--text-muted)" }}>(Leave blank to keep current)</span></h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label className="field-label">New Password</label>
                <input type="password" className="input-premium" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength={6} />
              </div>
              <div>
                <label className="field-label">Confirm New Password</label>
                <input type="password" className="input-premium" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" minLength={6} />
              </div>
            </div>

            <button type="submit" className="btn-premium" disabled={busy} style={{ marginTop: "1rem", alignSelf: "flex-end", minWidth: "150px" }}>
              {busy ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
