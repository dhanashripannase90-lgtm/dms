import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getDashboardStats, getDocuments } from "../services/api";
import { 
  UserGroupIcon, 
  FileIcon, 
  ClockIcon, 
  CheckIcon, 
  XIcon, 
  ChartIcon, 
  TagIcon, 
  UploadIcon 
} from "../components/Icons";

const CAT_BADGE = { GENERAL: "badge-gray", FINANCE: "badge-green", LEGAL: "badge-amber", HR: "badge-cyan" };

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentDocs, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [sr, dr] = await Promise.all([getDashboardStats(), getDocuments()]);
        setStats(sr.data);
        setRecent((dr.data || []).slice(0, 6));
      } catch (e) { setError(e.response?.data?.message || "Failed to load dashboard"); }
      finally { setLoading(false); }
    })();
  }, []);

  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers ?? 0, icon: <UserGroupIcon size={28} color="var(--violet)" />, color: "var(--violet)", link: "/admin/users" },
    { label: "Total Documents", value: stats.totalDocuments ?? 0, icon: <FileIcon size={28} color="var(--cyan)" />, color: "var(--cyan)", link: "/documents" },
    { label: "Pending Approval", value: stats.pendingDocuments ?? 0, icon: <ClockIcon size={28} color="#f59e0b" />, color: "#f59e0b", link: "/admin/approval" },
    { label: "Approved", value: stats.approvedDocuments ?? 0, icon: <CheckIcon size={28} color="#10b981" />, color: "#10b981", link: "/documents" },
    { label: "Rejected", value: stats.rejectedDocuments ?? 0, icon: <XIcon size={28} color="#ef4444" />, color: "#ef4444", link: "/documents" },
  ] : [];

  return (
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content">
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Admin Console</h1>
          <p className="page-subtitle">Comprehensive system management and document oversight.</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        {/* Quick Links */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {[
            { to: "/admin/approval", label: "Approval Queue", icon: <ClockIcon size={16} />, color: "#f59e0b" },
            { to: "/admin/users", label: "User Management", icon: <UserGroupIcon size={16} />, color: "var(--violet)" },
            { to: "/admin/audit-logs", label: "Audit Logs", icon: <ChartIcon size={16} />, color: "var(--cyan)" },
            { to: "/admin/tags", label: "Tag Management", icon: <TagIcon size={16} />, color: "var(--gold)" },
            { to: "/upload", label: "Upload Document", icon: <UploadIcon size={16} />, color: "#10b981" },
          ].map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: "0.6rem 1.4rem", borderRadius: "50px", textDecoration: "none",
              background: l.color + "22", color: l.color, border: `1px solid ${l.color}44`,
              fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s ease",
              display: "inline-flex", alignItems: "center", gap: "0.5rem"
            }}>{l.icon}{l.label}</Link>
          ))}
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {loading ? (
            [1, 2, 3, 4, 5].map(i => <div key={i} className="sk" style={{ height: 130, borderRadius: 20 }} />)
          ) : statCards.map(card => (
            <Link key={card.label} to={card.link} style={{ textDecoration: "none", display: "block", height: "100%" }}>
              <div className="stat-card-premium" style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p className="stat-label">{card.label}</p>
                    <p className="stat-value" style={{ fontSize: "2.5rem", color: card.color }}>{card.value}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", background: "var(--bg-input)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {!loading && stats && (
            <div className="stat-card-premium" style={{ border: "1px solid var(--gold-glow)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p className="stat-label" style={{ marginBottom: "1rem" }}>By Category</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                {Object.entries(stats.documentsByCategory || {}).map(([k, v]) => (
                  <span key={k} className={`badge ${CAT_BADGE[k] || "badge-gray"}`} style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>{k}: {v}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Docs */}
        <div className={`glass-panel ${!loading ? "page-transition-active" : "page-transition-enter"}`} style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Recent Activity</h2>
            <Link to="/documents" style={{ textDecoration: "none" }}>
              <span className="badge-violet badge" style={{ cursor: "pointer" }}>VIEW ALL</span>
            </Link>
          </div>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1, 2, 3, 4].map(i => <div key={i} className="sk" style={{ height: "3.5rem" }} />)}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="premium-table">
                <thead>
                  <tr style={{ background: "none" }}>
                    {["Document", "Category", "Status", "Contributor"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!recentDocs.length ? (
                    <tr><td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No documents yet.</td></tr>
                  ) : recentDocs.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                          <span style={{ color: "var(--cyan)" }}>
                            <FileIcon size={20} />
                          </span>
                          {d.fileName}
                        </span>
                      </td>
                      <td><span className={`badge ${CAT_BADGE[d.category] || "badge-gray"}`}>{d.category}</span></td>
                      <td>
                        <span style={{
                          padding: "0.25rem 0.7rem", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 700,
                          background: d.status === "APPROVED" ? "rgba(16,185,129,0.15)" : d.status === "PENDING" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                          color: d.status === "APPROVED" ? "#10b981" : d.status === "PENDING" ? "#f59e0b" : "#ef4444",
                        }}>{d.status}</span>
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>{d.uploadedByName || d.uploadedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
