import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAuditLogs } from "../services/api";

const ACTION_STYLE = {
  UPLOAD:          { color: "#6366f1", icon: "⬆️" },
  DOWNLOAD:        { color: "#14b8a6", icon: "⬇️" },
  DELETE:          { color: "#ef4444", icon: "🗑️" },
  APPROVE:         { color: "#10b981", icon: "✅" },
  REJECT:          { color: "#f59e0b", icon: "❌" },
  UPDATE:          { color: "#a855f7", icon: "✏️" },
  REPLACE_VERSION: { color: "#3b82f6", icon: "🔄" },
};

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  const load = async (p = 0) => {
    setLoading(true); setError("");
    try {
      const { data } = await getAuditLogs(p, pageSize);
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) { setError(e.response?.data?.message || "Failed to load audit logs"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [page]);

  return (
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content">
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Audit Logs</h1>
          <p className="page-subtitle">Complete activity trail for all document operations.</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        {/* Legend */}
        <div className="glass-panel" style={{ padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>ACTIONS:</span>
          {Object.entries(ACTION_STYLE).map(([action, style]) => (
            <span key={action} style={{ fontSize: "0.8rem", fontWeight: 600, color: style.color }}>
              {style.icon} {action}
            </span>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: "2rem" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[...Array(8)].map((_, i) => <div key={i} className="sk" style={{ height: "3.5rem" }} />)}
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: "5rem", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📋</div>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>No activity logs found.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {logs.map(log => {
                const style = ACTION_STYLE[log.action] || { color: "var(--text-secondary)", icon: "📌" };
                return (
                  <div key={log.id} style={{
                    display: "flex", gap: "1.5rem", alignItems: "center",
                    padding: "1rem 1.5rem", borderRadius: "12px", background: "var(--bg-input)",
                    border: "1px solid var(--border)", flexWrap: "wrap"
                  }}>
                    <span style={{ fontSize: "1.5rem" }}>{style.icon}</span>
                    <span style={{
                      padding: "0.25rem 0.75rem", borderRadius: "50px", fontSize: "0.75rem",
                      fontWeight: 700, background: style.color + "22", color: style.color,
                      border: `1px solid ${style.color}44`, minWidth: "110px", textAlign: "center"
                    }}>{log.action}</span>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      {log.documentName && (
                        <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.1rem" }}>
                          📄 {log.documentName}
                        </p>
                      )}
                      {log.details && <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{log.details}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.85rem" }}>{log.performedBy}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "2rem", alignItems: "center" }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0} style={{ borderRadius: "50px" }}>← Prev</button>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Page {page + 1} of {totalPages}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1} style={{ borderRadius: "50px" }}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditLogPage;
