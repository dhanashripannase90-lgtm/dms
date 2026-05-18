import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getTags, createTag, deleteTag } from "../services/api";

function TagManagementPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getTags();
      setTags(res.data || []);
    } catch (e) {
      setError("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await createTag({ name, color });
      setName("");
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create tag");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;
    try {
      await deleteTag(id);
      await load();
    } catch (e) {
      setError("Failed to delete tag");
    }
  };

  return (
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content">
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>🏷️ Tag Management</h1>
          <p className="page-subtitle">Create and manage document tags for better organization.</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
          {/* Create Form */}
          <div className="glass-panel" style={{ padding: "2rem", height: "fit-content" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>Create New Tag</h2>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label className="field-label">Tag Name</label>
                <input className="input-premium" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Urgent, Confidencial" required />
              </div>
              <div>
                <label className="field-label">Tag Color</label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: "50px", height: "50px", border: "none", borderRadius: "10px", background: "none", cursor: "pointer" }} />
                  <input className="input-premium" value={color} onChange={e => setColor(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <button type="submit" className="btn-premium" disabled={busy} style={{ marginTop: "1rem" }}>
                {busy ? "Creating..." : "Create Tag"}
              </button>
            </form>
          </div>

          {/* List */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>Existing Tags</h2>
            {loading ? (
              <div className="sk" style={{ height: "10rem" }} />
            ) : tags.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem" }}>No tags created yet.</p>
            ) : (
              <div className="table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr style={{ background: "none" }}>
                      <th style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>PREVIEW</th>
                      <th style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>NAME</th>
                      <th style={{ textAlign: "left", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>COLOR</th>
                      <th style={{ textAlign: "right", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map(tag => (
                      <tr key={tag.id}>
                        <td>
                          <span style={{ padding: "0.3rem 1rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: 700, background: tag.color + "22", color: tag.color, border: `1px solid ${tag.color}44` }}>
                            {tag.name}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{tag.name}</td>
                        <td style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}>{tag.color}</td>
                        <td style={{ textAlign: "right" }}>
                          <button onClick={() => handleDelete(tag.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: 600 }}>Delete</button>
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
    </div>
  );
}

export default TagManagementPage;
