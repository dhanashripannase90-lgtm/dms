import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { approveDocument, getPendingDocuments, rejectDocument } from "../services/api";

const CAT_BADGE = { GENERAL: "badge-gray", FINANCE: "badge-green", LEGAL: "badge-amber", HR: "badge-cyan" };

function ApprovalQueuePage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState({});

  const load = async () => {
    setLoading(true); setError("");
    try { const { data } = await getPendingDocuments(); setDocs(data || []); }
    catch (e) { setError(e.response?.data?.message || "Failed to load pending documents"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    setProcessing(p => ({ ...p, [id + "_approve"]: true }));
    try { await approveDocument(id); await load(); }
    catch (e) { 
      const msg = e.response?.data?.message || e.message || "Approval failed";
      setError(`Failed to approve: ${msg}`);
      console.error("Approval error:", e);
    }
    finally { setProcessing(p => ({ ...p, [id + "_approve"]: false })); }
  };

  const handleReject = async (id) => {
    const remarks = window.prompt("Rejection reason (optional):");
    if (remarks === null) return; // cancelled
    setProcessing(p => ({ ...p, [id + "_reject"]: true }));
    try { await rejectDocument(id, remarks); await load(); }
    catch (e) { setError(e.response?.data?.message || "Rejection failed"); }
    finally { setProcessing(p => ({ ...p, [id + "_reject"]: false })); }
  };

  const fileIcon = (type) => {
    if (!type) return "📄";
    if (type === "application/pdf") return "📕";
    if (type.includes("word")) return "📘";
    if (type.includes("excel") || type.includes("spreadsheet")) return "📗";
    if (type.startsWith("image/")) return "🖼️";
    return "📄";
  };

  return (
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <div>
            <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Approval Queue</h1>
            <p className="page-subtitle">
              {loading ? "Loading..." : `${docs.length} document${docs.length !== 1 ? "s" : ""} awaiting review.`}
            </p>
          </div>
          {docs.length > 0 && (
            <div style={{ padding: "0.5rem 1.2rem", borderRadius: "50px", background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)", fontWeight: 700 }}>
              ⏳ {docs.length} Pending
            </div>
          )}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        <div className="glass-panel" style={{ padding: "2rem" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1, 2, 3, 4].map(i => <div key={i} className="sk" style={{ height: "5rem" }} />)}
            </div>
          ) : docs.length === 0 ? (
            <div style={{ padding: "5rem", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>✅</div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem" }}>All Clear!</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                No documents pending approval. The queue is empty.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {docs.map(doc => (
                <div key={doc.id} style={{
                  padding: "1.5rem 2rem", borderRadius: "16px", background: "var(--bg-input)",
                  border: "1px solid rgba(245,158,11,0.2)", display: "flex", gap: "1.5rem",
                  alignItems: "center", flexWrap: "wrap"
                }}>
                  <div style={{ fontSize: "2.5rem" }}>{fileIcon(doc.fileType)}</div>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <p style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.3rem" }}>{doc.fileName}</p>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span className={`badge ${CAT_BADGE[doc.category] || "badge-gray"}`}>{doc.category}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>by {doc.uploadedByName || doc.uploadedBy}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>• {new Date(doc.uploadDate).toLocaleDateString()}</span>
                      {doc.folderName && <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>📁 {doc.folderName}</span>}
                    </div>
                    {doc.description && <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.5rem", fontStyle: "italic" }}>"{doc.description}"</p>}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button className="btn-premium" onClick={() => handleApprove(doc.id)}
                      disabled={processing[doc.id + "_approve"]}
                      style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 8px 16px rgba(16,185,129,0.3)", padding: "0.6rem 1.5rem" }}>
                      {processing[doc.id + "_approve"] ? "..." : "✅ Approve"}
                    </button>
                    <button className="btn btn-secondary btn-md" onClick={() => handleReject(doc.id)}
                      disabled={processing[doc.id + "_reject"]}
                      style={{ borderRadius: "50px", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>
                      {processing[doc.id + "_reject"] ? "..." : "❌ Reject"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApprovalQueuePage;
