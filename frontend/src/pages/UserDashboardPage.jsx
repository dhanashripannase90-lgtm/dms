import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { deleteDocument, downloadDocument, getMyDocuments } from "../services/api";
import { getAuthData } from "../utils/auth";

const CAT_BADGE = { GENERAL: "badge-gray", FINANCE: "badge-green", LEGAL: "badge-amber", HR: "badge-cyan" };
const CAT_ICON = { GENERAL: "📁", FINANCE: "💰", LEGAL: "⚖️", HR: "👤" };
const STATUS_STYLE = {
  APPROVED: { background: "rgba(16,185,129,0.15)", color: "#10b981" },
  PENDING:  { background: "rgba(245,158,11,0.15)", color: "#f59e0b" },
  REJECTED: { background: "rgba(239,68,68,0.15)",  color: "#ef4444" },
};

function UserDashboardPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const auth = getAuthData();

  const load = async () => {
    try { const { data } = await getMyDocuments(); setDocs(data || []); }
    catch (e) { setError(e.response?.data?.message || "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const greet = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  const handleDownload = async (doc) => {
    try {
      const { data } = await downloadDocument(doc.id);
      const url = URL.createObjectURL(new Blob([data], { type: doc.fileType || "application/octet-stream" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: doc.fileName });
      a.click(); URL.revokeObjectURL(url);
    } catch { setError("Download failed."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document permanently?")) return;
    try { await deleteDocument(id); await load(); }
    catch (e) { setError(e.response?.data?.message || "Delete failed."); }
  };

  return (
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", marginBottom: "3rem" }}>
          <div>
            <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>{greet()}, {auth?.name?.split(" ")[0] || "User"} ✨</h1>
            <p className="page-subtitle">Your personalized document repository.</p>
          </div>
          <Link to="/upload" className="btn-premium" style={{ textDecoration: "none" }}>
            <span>➕</span> New Upload
          </Link>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="stat-card-premium" style={{ border: "1px solid var(--violet-glow)" }}>
            <p className="stat-label">TOTAL UPLOADS</p>
            <p className="stat-value" style={{ color: "var(--violet)" }}>{loading ? "—" : docs.length}</p>
          </div>
          <div className="stat-card-premium">
            <p className="stat-label">APPROVED</p>
            <p className="stat-value" style={{ color: "#10b981", fontSize: "1.8rem" }}>{loading ? "—" : docs.filter(d => d.status === "APPROVED").length}</p>
          </div>
          <div className="stat-card-premium">
            <p className="stat-label">PENDING</p>
            <p className="stat-value" style={{ color: "#f59e0b", fontSize: "1.8rem" }}>{loading ? "—" : docs.filter(d => d.status === "PENDING").length}</p>
          </div>
          {["GENERAL", "FINANCE", "LEGAL", "HR"].map(cat => (
            <div key={cat} className="stat-card-premium">
              <p className="stat-label">{cat}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <p className="stat-value" style={{ fontSize: "1.8rem" }}>{loading ? "—" : docs.filter(d => d.category === cat).length}</p>
                <span style={{ fontSize: "1.5rem" }}>{CAT_ICON[cat]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* My Documents  */}
        <div className={`glass-panel ${!loading ? "page-transition-active" : "page-transition-enter"}`} style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>My Documents</h2>
            <Link to="/documents" style={{ textDecoration: "none", color: "var(--violet)", fontSize: "0.9rem", fontWeight: 600 }}>View All →</Link>
          </div>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1, 2, 3, 4].map(i => <div key={i} className="sk" style={{ height: "3.5rem" }} />)}
            </div>
          ) : docs.length === 0 ? (
            <div style={{ padding: "5rem", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📭</div>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", marginBottom: "2rem" }}>Your vault is currently empty.</p>
              <Link to="/upload" className="btn-gold" style={{ textDecoration: "none" }}>Upload Your First File</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="premium-table">
                <thead>
                  <tr style={{ background: "none" }}>
                    {["File", "Category", "Status", "Date", "Actions"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docs.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                          <span style={{ fontSize: "1.3rem" }}>📄</span>{d.fileName}
                        </span>
                      </td>
                      <td><span className={`badge ${CAT_BADGE[d.category] || "badge-gray"}`}>{d.category}</span></td>
                      <td>
                        <span style={{ padding: "0.25rem 0.7rem", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 700, ...STATUS_STYLE[d.status] }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{new Date(d.uploadDate).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(d)}
                            style={{ borderRadius: "50px", color: "var(--cyan)", borderColor: "var(--cyan-glow)" }}>Download</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(d.id)}
                            style={{ borderRadius: "50px", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}>Delete</button>
                        </div>
                      </td>
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

export default UserDashboardPage;
