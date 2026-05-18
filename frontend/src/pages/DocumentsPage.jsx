import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import {
  addTagToDocument, deleteDocument, downloadDocument, getDocuments,
  getTags, previewDocument, removeTagFromDocument, updateDocument,
  getDocumentVersions
} from "../services/api";
import { getAuthData } from "../utils/auth";

const CAT_BADGE = { GENERAL: "badge-gray", FINANCE: "badge-green", LEGAL: "badge-amber", HR: "badge-cyan" };
const STATUS_STYLE = {
  APPROVED: { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" },
  PENDING:  { background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" },
  REJECTED: { background: "rgba(239,68,68,0.15)",  color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
};

/* ─── Preview Modal ────────────────────────────────────────────────────────── */
/* ─── Preview Modal ────────────────────────────────────────────────────────── */
function PreviewModal({ doc, onClose }) {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    previewDocument(doc.id).then(({ data }) => {
      if (data.size === 0) throw new Error("Empty file");
      const blob = new Blob([data], { type: doc.fileType || "application/octet-stream" });
      setUrl(URL.createObjectURL(blob));
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
    return () => url && URL.revokeObjectURL(url);
  }, [doc.id]);

  const handleDownload = async () => {
    try {
      const { data } = await downloadDocument(doc.id);
      const blobUrl = URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch { alert("Download failed"); }
  };

  const isImage = doc.fileType?.startsWith("image/");
  const isPdf   = doc.fileType === "application/pdf";

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose} style={{ zIndex: 3000 }}>
      <div className="glass-panel animate-slide-up" onClick={e => e.stopPropagation()}
        style={{ width: "95vw", maxWidth: "1200px", height: "90vh", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>📄 {doc.fileName}</h3>
            <span className="badge badge-gray" style={{ fontSize: "0.7rem" }}>{doc.fileType}</span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn btn-secondary btn-sm" onClick={handleDownload} style={{ borderRadius: "50px" }}>Download</button>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.5rem" }}>✕</button>
          </div>
        </div>
        <div style={{ flex: 1, borderRadius: "12px", overflow: "hidden", background: "#1a1b26", position: "relative" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem", color: "var(--text-secondary)" }}>
              <span className="spinner" style={{ width: "40px", height: "40px" }} />
              <span>Preparing preview...</span>
            </div>
          ) : error ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1.5rem", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: "4rem" }}>❌</div>
              <p>Failed to load preview. This might be due to a server error or an unsupported file format.</p>
              <button className="btn-premium" onClick={handleDownload}>Download Instead</button>
            </div>
          ) : url && isPdf ? (
            <object data={url} type="application/pdf" width="100%" height="100%">
               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem" }}>
                  <p>Your browser cannot display this PDF directly.</p>
                  <button className="btn-premium" onClick={handleDownload}>Download PDF</button>
               </div>
            </object>
          ) : url && isImage ? (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
              <img src={url} alt={doc.fileName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1.5rem", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: "5rem" }}>📄</div>
              <p style={{ fontSize: "1.1rem" }}>No visual preview available for <strong>{doc.fileType}</strong></p>
              <button className="btn-premium" onClick={handleDownload}>Download File</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Version History Modal ────────────────────────────────────────────────── */
function VersionHistoryModal({ doc, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocumentVersions(doc.id).then(({ data }) => { setVersions(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [doc.id]);

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose} style={{ zIndex: 2500 }}>
      <div className="glass-panel animate-slide-up" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "600px", padding: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>🕒 Version History</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.5rem" }}>✕</button>
        </div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          <strong style={{ color: "var(--violet)" }}>{doc.fileName}</strong> — previous versions
        </p>
        {loading ? <div className="sk" style={{ height: "3rem" }} /> :
          versions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
              <p>No previous versions found. Version history is created when a file is replaced.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {versions.map(v => (
                <div key={v.id} style={{ padding: "1rem 1.5rem", background: "var(--bg-input)", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Version {v.versionNumber}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{v.fileName} · {v.uploadedBy}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{new Date(v.uploadedAt).toLocaleString()}</p>
                  </div>
                  <span className="badge badge-gray" style={{ fontSize: "0.75rem" }}>v{v.versionNumber}</span>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

/* ─── Edit Modal ───────────────────────────────────────────────────────────── */
function EditModal({ doc, onClose, onSave }) {
  const [cat, setCat] = useState(doc.category || "GENERAL");
  const [desc, setDesc] = useState(doc.description || "");
  const [busy, setBusy] = useState(false);
  const save = async () => { setBusy(true); await onSave(doc.id, { category: cat, description: desc }); setBusy(false); };
  return (
    <div className="modal-backdrop animate-fade" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="glass-panel animate-slide-up" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "500px", padding: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Edit Document</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.5rem" }}>✕</button>
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem", padding: "0.8rem", background: "var(--bg-input)", borderRadius: "10px" }}>
          <strong style={{ color: "var(--violet)" }}>File:</strong> {doc.fileName}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label className="field-label">Category</label>
            <select className="input-premium" value={cat} onChange={e => setCat(e.target.value)}>
              {["GENERAL", "FINANCE", "LEGAL", "HR"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="input-premium" rows={4} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Type a brief description..." />
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2.5rem" }}>
          <button className="btn btn-secondary btn-md" onClick={onClose} style={{ borderRadius: "50px" }}>Cancel</button>
          <button className="btn-premium" onClick={save} disabled={busy}>
            {busy ? <><span className="spinner" /> Saving...</> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Modal ─────────────────────────────────────────────────────────── */
function DeleteModal({ doc, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const del = async () => { setBusy(true); await onConfirm(doc.id); setBusy(false); };
  return (
    <div className="modal-backdrop animate-fade" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="glass-panel animate-slide-up" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "400px", padding: "2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>⚠️</div>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>Delete Document?</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2.5rem" }}>
          This will permanently delete <strong style={{ color: "var(--text-primary)" }}>{doc.fileName}</strong>.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-secondary btn-md" onClick={onClose} style={{ flex: 1, borderRadius: "50px" }}>Cancel</button>
          <button className="btn-premium" onClick={del} disabled={busy}
            style={{ flex: 1, background: "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)", boxShadow: "0 10px 20px rgba(239,68,68,0.3)" }}>
            {busy ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Tag Manager Modal ────────────────────────────────────────────────────── */
function TagManagerModal({ doc, allTags, onClose, onTagAdd, onTagRemove }) {
  const docTagIds = new Set((doc.tags || []).map(t => t.id));
  return (
    <div className="modal-backdrop animate-fade" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="glass-panel animate-slide-up" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "480px", padding: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>🏷️ Manage Tags</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.5rem" }}>✕</button>
        </div>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          <strong style={{ color: "var(--violet)" }}>{doc.fileName}</strong>
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {allTags.length === 0 && <p style={{ color: "var(--text-muted)" }}>No tags available. Ask an admin to create tags.</p>}
          {allTags.map(tag => {
            const isAttached = docTagIds.has(tag.id);
            return (
              <button key={tag.id} onClick={() => isAttached ? onTagRemove(doc.id, tag.id) : onTagAdd(doc.id, tag.id)}
                style={{
                  padding: "0.4rem 1rem", borderRadius: "50px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                  background: isAttached ? tag.color + "33" : "var(--bg-input)",
                  color: isAttached ? tag.color : "var(--text-secondary)",
                  border: `1px solid ${isAttached ? tag.color : "var(--border)"}`,
                  transition: "all 0.2s ease"
                }}>
                {isAttached ? "✓ " : ""}{tag.name}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: "2rem", textAlign: "right" }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: "50px" }}>Done</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
function DocumentsPage() {
  const auth = getAuthData();
  const [docs, setDocs] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [versionsDoc, setVersionsDoc] = useState(null);
  const [tagDoc, setTagDoc] = useState(null);

  const load = async (s = search, c = category) => {
    setLoading(true); setError("");
    try {
      const [docRes, tagRes] = await Promise.all([getDocuments(s, c), getTags()]);
      setDocs(docRes.data || []);
      setAllTags(tagRes.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load documents");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => load(search, category);
  const handleCategoryChange = (val) => { setCategory(val); load(search, val); };
  const handleView = (doc) => setPreviewDoc(doc);
  const handleDownload = async (doc) => {
    try {
      const { data } = await downloadDocument(doc.id);
      const url = URL.createObjectURL(new Blob([data], { type: doc.fileType || "application/octet-stream" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: doc.fileName });
      a.click(); URL.revokeObjectURL(url);
    } catch { setError("Download failed."); }
  };
  const handleSaveEdit = async (id, payload) => {
    try { await updateDocument(id, payload); setEditDoc(null); await load(); }
    catch (e) { setError(e.response?.data?.message || "Failed to update."); setEditDoc(null); }
  };
  const handleDelete = async (id) => {
    try { await deleteDocument(id); setDeleteDoc(null); await load(); }
    catch (e) { setError(e.response?.data?.message || "Failed to delete."); setDeleteDoc(null); }
  };
  const handleTagAdd = async (docId, tagId) => {
    try { await addTagToDocument(docId, tagId); await load(); } catch {}
  };
  const handleTagRemove = async (docId, tagId) => {
    try { await removeTagFromDocument(docId, tagId); await load(); } catch {}
  };

  const fileIcon = (type) => {
    if (!type) return "📄";
    if (type === "application/pdf") return "📕";
    if (type.includes("word")) return "📘";
    if (type.includes("excel") || type.includes("spreadsheet")) return "📗";
    if (type.includes("presentation") || type.includes("powerpoint")) return "📙";
    if (type.startsWith("image/")) return "🖼️";
    return "📄";
  };

  return (
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <div>
            <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Document Repository</h1>
            <p className="page-subtitle">{docs.length} documents in the system.</p>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        {/* Search + Filter */}
        <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
            <span style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>🔍</span>
            <input className="input-premium" style={{ paddingLeft: "3rem" }} placeholder="Search documents..."
              value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
          </div>
          <select className="input-premium" value={category} style={{ flex: "0 1 200px" }} onChange={e => handleCategoryChange(e.target.value)}>
            <option value="">All Categories</option>
            {["GENERAL", "FINANCE", "LEGAL", "HR"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn-premium" onClick={handleSearch} style={{ padding: "0.8rem 2.5rem" }}>Search</button>
        </div>

        {/* Table */}
        <div className={`glass-panel ${!loading ? "page-transition-active" : "page-transition-enter"}`} style={{ padding: "2rem" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="sk" style={{ height: "1.5rem", flex: 1 }} />)}
              </div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="sk" style={{ height: "4.5rem", width: "100%" }} />
              ))}
            </div>
          ) : docs.length === 0 ? (
            <div style={{ padding: "5rem", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📂</div>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem" }}>No documents found.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="premium-table">
                <thead>
                  <tr style={{ background: "none" }}>
                    {["Document", "Category", "Status", "Tags", "Uploaded By", "Date", "Actions"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docs.map(doc => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 600, maxWidth: "200px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span style={{ fontSize: "1.3rem" }}>{fileIcon(doc.fileType)}</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.fileName}</span>
                        </span>
                      </td>
                      <td><span className={`badge ${CAT_BADGE[doc.category] || "badge-gray"}`}>{doc.category}</span></td>
                      <td>
                        <span style={{ padding: "0.3rem 0.8rem", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 700, ...STATUS_STYLE[doc.status] }}>
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                          {(doc.tags || []).map(t => (
                            <span key={t.id} style={{ padding: "0.2rem 0.6rem", borderRadius: "50px", fontSize: "0.7rem", fontWeight: 600, background: t.color + "22", color: t.color, border: `1px solid ${t.color}44` }}>
                              {t.name}
                            </span>
                          ))}
                          {(doc.tags || []).length === 0 && <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>}
                        </div>
                      </td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{doc.uploadedByName || doc.uploadedBy}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleView(doc)} style={{ borderRadius: "50px" }}>Preview</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(doc)} style={{ borderRadius: "50px", color: "var(--cyan)", borderColor: "var(--cyan-glow)" }}>Download</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditDoc(doc)} style={{ borderRadius: "50px", color: "var(--gold)", borderColor: "var(--gold-glow)" }}>Edit</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setTagDoc(doc)} style={{ borderRadius: "50px", color: "var(--violet)", borderColor: "var(--violet-glow)" }}>Tags</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setVersionsDoc(doc)} style={{ borderRadius: "50px" }}>History</button>
                          {(auth?.role === "ADMIN" || doc.uploadedBy === auth?.email) && (
                            <button className="btn btn-secondary btn-sm" onClick={() => setDeleteDoc(doc)} style={{ borderRadius: "50px", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}>Delete</button>
                          )}
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

      {previewDoc && <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
      {versionsDoc && <VersionHistoryModal doc={versionsDoc} onClose={() => setVersionsDoc(null)} />}
      {editDoc && <EditModal doc={editDoc} onClose={() => setEditDoc(null)} onSave={handleSaveEdit} />}
      {deleteDoc && <DeleteModal doc={deleteDoc} onClose={() => setDeleteDoc(null)} onConfirm={handleDelete} />}
      {tagDoc && <TagManagerModal doc={tagDoc} allTags={allTags} onClose={() => setTagDoc(null)} onTagAdd={handleTagAdd} onTagRemove={handleTagRemove} />}
    </div>
  );
}

export default DocumentsPage;
