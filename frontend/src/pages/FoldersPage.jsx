import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { createFolder, deleteFolder, getFolderTree, renameFolder } from "../services/api";

function FolderNode({ folder, onRename, onDelete, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const hasChildren = folder.children && folder.children.length > 0;

  return (
    <div style={{ marginLeft: depth > 0 ? "1.5rem" : 0 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem",
        borderRadius: "12px", marginBottom: "0.4rem", background: "var(--bg-input)",
        border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.2s ease"
      }}>
        <span style={{ fontSize: "1.2rem", cursor: "pointer" }} onClick={() => setOpen(!open)}>
          {hasChildren ? (open ? "📂" : "📁") : "📁"}
        </span>
        <span style={{
          flex: 1, fontWeight: 600, color: "var(--text-primary)",
          borderLeft: `3px solid ${folder.color || "#6366f1"}`, paddingLeft: "0.75rem"
        }}>
          {folder.name}
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onRename(folder)}
            style={{ borderRadius: "50px", color: "var(--gold)", borderColor: "var(--gold-glow)", padding: "0.2rem 0.75rem" }}>Rename</button>
          <button className="btn btn-secondary btn-sm" onClick={() => onDelete(folder)}
            style={{ borderRadius: "50px", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)", padding: "0.2rem 0.75rem" }}>Delete</button>
        </div>
      </div>
      {open && hasChildren && folder.children.map(child => (
        <FolderNode key={child.id} folder={child} onRename={onRename} onDelete={onDelete} depth={depth + 1} />
      ))}
    </div>
  );
}

const FOLDER_COLORS = ["#6366f1", "#a855f7", "#ec4899", "#14b8a6", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];

function FoldersPage() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(FOLDER_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameName, setRenameName] = useState("");

  const load = async () => {
    setLoading(true);
    try { const { data } = await getFolderTree(); setTree(data || []); }
    catch (e) { setError(e.response?.data?.message || "Failed to load folders"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await createFolder({ name: newName.trim(), color: newColor });
      setNewName(""); setShowCreate(false); await load();
    } catch (e) { setError(e.response?.data?.message || "Failed to create folder"); }
    finally { setCreating(false); }
  };

  const handleRename = async () => {
    if (!renameName.trim() || !renameTarget) return;
    try {
      await renameFolder(renameTarget.id, { name: renameName.trim() });
      setRenameTarget(null); setRenameName(""); await load();
    } catch (e) { setError(e.response?.data?.message || "Failed to rename folder"); }
  };

  const handleDelete = async (folder) => {
    if (!window.confirm(`Delete folder "${folder.name}"? Documents inside will not be deleted.`)) return;
    try { await deleteFolder(folder.id); await load(); }
    catch (e) { setError(e.response?.data?.message || "Failed to delete folder"); }
  };

  return (
    <div className="page-shell animate-fade">
      <Navbar />
      <div className="page-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <div>
            <h1 className="page-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Folder Management</h1>
            <p className="page-subtitle">{tree.length} root folders in your workspace.</p>
          </div>
          <button className="btn-premium" onClick={() => { setShowCreate(true); setNewName(""); }}>
            ➕ New Folder
          </button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "2rem" }}>{error}</div>}

        {/* Create Folder Panel */}
        {showCreate && (
          <div className="glass-panel animate-slide-up" style={{ padding: "2rem", marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>Create New Folder</h3>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label className="field-label">Folder Name</label>
                <input className="input-premium" placeholder="e.g. Project Reports" value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCreate()} />
              </div>
              <div>
                <label className="field-label">Color</label>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {FOLDER_COLORS.map(c => (
                    <button key={c} onClick={() => setNewColor(c)} style={{
                      width: "28px", height: "28px", borderRadius: "50%", background: c, border: "none",
                      cursor: "pointer", outline: newColor === c ? `3px solid ${c}` : "none",
                      outlineOffset: "2px", transition: "all 0.2s ease"
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-secondary btn-md" onClick={() => setShowCreate(false)} style={{ borderRadius: "50px" }}>Cancel</button>
                <button className="btn-premium" onClick={handleCreate} disabled={creating || !newName.trim()}>
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {renameTarget && (
          <div className="modal-backdrop animate-fade" onClick={() => setRenameTarget(null)} style={{ zIndex: 2000 }}>
            <div className="glass-panel animate-slide-up" onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.5rem" }}>Rename Folder</h3>
              <input className="input-premium" placeholder="New name" value={renameName}
                onChange={e => setRenameName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRename()}
                autoFocus />
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button className="btn btn-secondary btn-md" onClick={() => setRenameTarget(null)} style={{ borderRadius: "50px" }}>Cancel</button>
                <button className="btn-premium" onClick={handleRename}>Rename</button>
              </div>
            </div>
          </div>
        )}

        {/* Folder Tree */}
        <div className={`glass-panel ${!loading ? "page-transition-active" : "page-transition-enter"}`} style={{ padding: "2rem" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1, 2, 3].map(i => <div key={i} className="sk" style={{ height: "3.5rem" }} />)}
            </div>
          ) : tree.length === 0 ? (
            <div style={{ padding: "5rem", textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📂</div>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", marginBottom: "2rem" }}>
                No folders yet. Create your first folder to start organizing documents.
              </p>
              <button className="btn-premium" onClick={() => setShowCreate(true)}>Create First Folder</button>
            </div>
          ) : tree.map(folder => (
            <FolderNode key={folder.id} folder={folder}
              onRename={f => { setRenameTarget(f); setRenameName(f.name); }}
              onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FoldersPage;
