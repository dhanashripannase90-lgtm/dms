import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getFolders, uploadDocument } from "../services/api";

const CATS = [
  { value: "GENERAL", label: "General", emoji: "📁" },
  { value: "FINANCE", label: "Finance", emoji: "💰" },
  { value: "LEGAL",   label: "Legal",   emoji: "⚖️" },
  { value: "HR",      label: "HR",      emoji: "👤" },
];

const fmtBytes = (b) =>
  b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("GENERAL");
  const [description, setDesc] = useState("");
  const [folderId, setFolderId] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);

  useEffect(() => {
    getFolders().then(({ data }) => setFolders(data || [])).catch(() => {});
  }, []);

  const pick = (f) => { if (f) { setFile(f); setError(""); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file to upload");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category);
    fd.append("description", description);
    if (folderId) fd.append("folderId", folderId);
    setLoading(true); setError("");
    try { await uploadDocument(fd); navigate("/documents"); }
    catch (e) { setError(e.response?.data?.message || "Upload failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content">
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Upload Document</h1>
          <p className="page-subtitle">Add a new document to the DMS repository.</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        <div className="glass-panel animate-slide-up" style={{ padding: "3rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Drop Zone */}
            <div>
              <label className="field-label" style={{ marginBottom: "1rem" }}>Select File</label>
              <div
                className={`drop-zone${over ? " over" : ""}`}
                style={{
                  border: "2px dashed var(--border-strong)", borderRadius: "20px",
                  padding: "4rem 2rem", textAlign: "center",
                  background: over ? "var(--violet-glow)" : "var(--bg-input)",
                  transition: "all 0.3s ease", cursor: "pointer"
                }}
                onDragOver={e => { e.preventDefault(); setOver(true); }}
                onDragLeave={() => setOver(false)}
                onDrop={e => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files?.[0]); }}
                onClick={() => document.getElementById("file-input").click()}>
                <input id="file-input" type="file" style={{ display: "none" }} onChange={e => pick(e.target.files?.[0])} />
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{file ? "📄" : "☁️"}</div>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {file ? file.name : over ? "Release to upload" : "Drag file here or click to browse"}
                </p>
                {file ? (
                  <p style={{ color: "var(--violet)", fontWeight: 600, marginTop: "0.5rem" }}>{fmtBytes(file.size)}</p>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Supports PDF, DOCX, XLSX, PPTX, JPG, PNG (max 10MB)</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="field-label" style={{ marginBottom: "1rem" }}>Category</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
                {CATS.map(({ value, label, emoji }) => (
                  <label key={value} style={{
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem",
                    padding: "1rem", borderRadius: "15px",
                    background: category === value ? "var(--violet-glow)" : "var(--bg-input)",
                    border: `1px solid ${category === value ? "var(--violet)" : "var(--border)"}`,
                    transition: "all 0.2s ease"
                  }}>
                    <input type="radio" value={value} checked={category === value} onChange={() => setCategory(value)} style={{ accentColor: "var(--violet)" }} />
                    <span style={{ fontSize: "1.2rem" }}>{emoji}</span>
                    <span style={{ fontWeight: 600 }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Folder */}
            {folders.length > 0 && (
              <div>
                <label className="field-label" style={{ marginBottom: "0.5rem" }}>Folder (optional)</label>
                <select className="input-premium" value={folderId} onChange={e => setFolderId(e.target.value)}>
                  <option value="">— No folder (Root) —</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="field-label" style={{ marginBottom: "0.5rem" }}>Description (optional)</label>
              <textarea className="input-premium" rows={4} placeholder="Add notes or a brief description..."
                value={description} onChange={e => setDesc(e.target.value)} />
            </div>

            {/* Note about approval */}
            <div style={{ padding: "1rem 1.5rem", borderRadius: "12px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", fontSize: "0.9rem" }}>
              ℹ️ Documents submitted by users require admin approval before they become visible to others.
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary btn-md" onClick={() => navigate("/documents")} style={{ borderRadius: "50px" }}>Cancel</button>
              <button type="submit" className="btn-premium" disabled={loading} style={{ padding: "0.8rem 3rem" }}>
                {loading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
