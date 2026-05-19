import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { updateProfile, getMyDocuments, getFolders } from "../services/api";
import { getAuthData, saveAuthData } from "../utils/auth";

// Pixel-perfect, modern Lucide SVG Icons matching the premium theme
const UserIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const KeyIcon = ({ size = 16, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const ShieldIcon = ({ size = 16, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z" />
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

const SaveIcon = ({ size = 18, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

function ProfilePage() {
  const auth = getAuthData();
  const [name, setName] = useState(auth?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Live Stats State
  const [uploadsCount, setUploadsCount] = useState(0);
  const [foldersCount, setFoldersCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const [docsRes, foldersRes] = await Promise.all([
          getMyDocuments(),
          getFolders()
        ]);
        if (isMounted) {
          setUploadsCount(docsRes.data?.length || 0);
          setFoldersCount(foldersRes.data?.length || 0);
        }
      } catch (e) {
        console.error("Failed to fetch live profile stats:", e);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);



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
      <div className="page-content" style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "11rem", paddingBottom: "4rem", paddingLeft: "2rem", paddingRight: "2rem" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "3.5rem", textAlign: "center" }} className="animate-slide-up">
          <div style={{ display: "inline-flex", alignItems: "center", justifySelf: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "100px", color: "var(--violet)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "1rem" }}>
            <ShieldIcon size={14} color="var(--violet)" /> Secure Account Manager
          </div>
          <h1 className="page-title" style={{ fontSize: "2.8rem", fontWeight: 900, background: "linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Account Profile
          </h1>
          <p className="page-subtitle" style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>Update your identity settings and cryptographic passwords.</p>
        </div>

        {success && <div className="alert alert-success animate-fade" style={{ marginBottom: "2rem", boxShadow: "0 4px 20px rgba(16,185,129,0.15)" }}>✨ {success}</div>}
        {error && <div className="alert alert-error animate-fade" style={{ marginBottom: "2rem", boxShadow: "0 4px 20px rgba(239,68,68,0.15)" }}>⚠️ {error}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "2.5rem", alignItems: "stretch" }} className="profile-grid">

          {/* LEFT COLUMN: PREMIUM USER CARD */}
          <div className="glass-panel animate-slide-up" style={{ padding: "2.5rem 2rem", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid var(--border-strong)", height: "100%", justifyContent: "space-between" }}>

            {/* Status indicator */}
            <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.8rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "100px", zIndex: 10 }}>
              <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 8px #10b981" }} />
              <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase" }}>Online</span>
            </div>

            {/* Avatar & Name container to keep them grouped at the top */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginTop: "1rem" }}>
              {/* Glowing Avatar circle */}
              <div style={{ position: "relative", marginBottom: "2rem" }}>
                <div style={{ position: "absolute", inset: "-8px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", opacity: 0.35, filter: "blur(8px)" }} />
                <div style={{ width: "130px", height: "130px", fontSize: "3rem", background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, position: "relative", border: "4px solid var(--bg-surface)", boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)" }}>
                  {initials}
                </div>
              </div>

              <div style={{ textAlign: "center", width: "100%", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 0.4rem 0", color: "var(--text-primary)" }}>{name}</h3>
                <span className="badge badge-violet" style={{ fontSize: "0.75rem", padding: "0.35rem 1.2rem", border: "1px solid var(--violet-glow)", letterSpacing: "1.5px", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <KeyIcon size={12} color="var(--violet)" /> {auth?.role}
                </span>
              </div>
            </div>



            {/* Quick Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width: "100%", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", borderRadius: "12px", padding: "0.8rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>UPLOADS</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--violet)", marginTop: "0.2rem" }}>{uploadsCount} {uploadsCount === 1 ? "File" : "Files"}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", borderRadius: "12px", padding: "0.8rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>FOLDERS</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--cyan)", marginTop: "0.2rem" }}>{foldersCount} {foldersCount === 1 ? "Folder" : "Folders"}</div>
              </div>
            </div>

            {/* Account Details list at the bottom */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.2rem", background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border)", marginTop: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px" }}>ACCOUNT ID</span>
                <span style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 700, fontFamily: "monospace", textAlign: "right" }}>#{auth?.id || "N/A"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px" }}>SYSTEM EMAIL</span>
                <span style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 700, textAlign: "right", wordBreak: "break-all" }}>{auth?.email}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px" }}>PRIVILEGES</span>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.3rem 0.8rem", background: auth?.role === "ADMIN" ? "rgba(234, 179, 8, 0.1)" : "rgba(6, 182, 212, 0.1)", color: auth?.role === "ADMIN" ? "var(--gold)" : "var(--cyan)", border: auth?.role === "ADMIN" ? "1px solid var(--gold-glow)" : "1px solid var(--cyan-glow)", borderRadius: "6px", letterSpacing: "1px", display: "inline-block" }}>
                    {auth?.role === "ADMIN" ? "FULL ACCESS" : "STANDARD"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PREMIUM EDIT FORM */}
          <div className="glass-panel animate-slide-up" style={{ padding: "3rem", border: "1px solid var(--border-strong)", position: "relative" }}>

            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* Profile details section */}
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <UserIcon size={20} color="var(--violet)" /> Profile Information
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label className="field-label">System Username / Email</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
                        <MailIcon size={16} />
                      </span>
                      <input className="input-premium" value={auth?.email || ""} disabled style={{ paddingLeft: "3rem", opacity: 0.5, cursor: "not-allowed", borderStyle: "dashed" }} />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Role Classification</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
                        <ShieldIcon size={16} />
                      </span>
                      <input className="input-premium" value={auth?.role || ""} disabled style={{ paddingLeft: "3rem", opacity: 0.5, cursor: "not-allowed", borderStyle: "dashed", textTransform: "uppercase" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="field-label">Display Full Name</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
                      <UserIcon size={16} />
                    </span>
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
                  <LockIcon size={20} color="var(--violet)" /> Update Password
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>Leave these fields empty if you do not want to change your current password.</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label className="field-label">New Password</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
                        <KeyIcon size={16} />
                      </span>
                      <input type={showPass ? "text" : "password"} className="input-premium" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: "3rem" }} minLength={6} />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "1.2rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {showPass ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Confirm New Password</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
                        <KeyIcon size={16} />
                      </span>
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
                    <SaveIcon size={16} /> Save Changes
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
