import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { deleteUser, getUsers, updateUserRole } from "../services/api";

/* ─── Confirm Modal ──────────────────────────────────────── */
function ConfirmModal({ emoji, title, message, confirmLabel, confirmClass, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const go = async () => { setBusy(true); await onConfirm(); setBusy(false); };
  return (
    <div className="modal-backdrop animate-fade" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="glass-panel animate-slide-up" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "450px", padding: "2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{emoji}</div>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>{title}</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2.5rem" }}>{message}</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-secondary btn-md" onClick={onClose} style={{ flex: 1, borderRadius: "50px" }}>Cancel</button>
          <button className={`btn-premium`} onClick={go} disabled={busy} style={{ flex: 1, background: confirmClass === 'btn-danger-sm' ? 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)' : 'var(--gold-gradient)', color: confirmClass === 'btn-danger-sm' ? '#fff' : '#000' }}>
            {busy ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDelTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const { data } = await getUsers(); setUsers(data || []); }
    catch (e) { setError(e.response?.data?.message || "Failed to fetch users"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const doDelete = async () => { await deleteUser(deleteTarget.id); setDelTarget(null); await load(); };
  const doRole = async () => {
    const next = roleTarget.role === "ADMIN" ? "USER" : "ADMIN";
    await updateUserRole(roleTarget.id, next); setRoleTarget(null); await load();
  };

  return (
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content" style={{ marginTop: "4rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>User Management</h1>
          <p className="page-subtitle">{users.length} authenticated identities in system.</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        <div className="glass-panel" style={{ padding: "2rem" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1, 2, 3, 4].map(i => <div key={i} className="sk" style={{ height: "4.5rem" }} />)}
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: "5rem", textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)" }}>No managed identities found.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="premium-table">
                <thead>
                  <tr style={{ background: "none" }}>
                    <th style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Identity</th>
                    <th style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Email</th>
                    <th style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Administrative Role</th>
                    <th style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const initials = u.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div className="avatar" style={{ width: "40px", height: "40px", fontSize: "0.8rem" }}>{initials}</div>
                            <span style={{ fontWeight: 700 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === "ADMIN" ? "badge-violet" : "badge-cyan"}`} style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>{u.role}</span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.6rem" }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setRoleTarget(u)} style={{ borderRadius: "50px", color: "var(--gold)", borderColor: "var(--gold-glow)" }}>Change Role</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setDelTarget(u)} style={{ borderRadius: "50px", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.2)" }}>Revoke Access</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmModal emoji="🛡️" title="Revoke User Access?"
          message={`Are you sure you want to permanently delete the identity for ${deleteTarget.name}? This user will lose all vault access.`}
          confirmLabel="Revoke Access" confirmClass="btn-danger-sm"
          onClose={() => setDelTarget(null)} onConfirm={doDelete} />
      )}
      {roleTarget && (
        <ConfirmModal emoji="🔄" title="Modify Permissions?"
          message={`Transition ${roleTarget.name} from ${roleTarget.role} to ${roleTarget.role === "ADMIN" ? "USER" : "ADMIN"} status?`}
          confirmLabel="Confirm Transition" confirmClass="btn-warning-sm"
          onClose={() => setRoleTarget(null)} onConfirm={doRole} />
      )}
    </div>
  );
}

export default UserManagementPage;
