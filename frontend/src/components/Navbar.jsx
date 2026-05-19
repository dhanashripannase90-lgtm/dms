import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthData, getAuthData } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";
import DmsLogo from "./DmsLogo";

const SunIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
);
const MoonIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);
const MenuIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);
const XCloseIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
const LogOutIcon = ({ size = 18, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
);

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const auth = getAuthData();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => { clearAuthData(); navigate("/login"); };
  const active = (p) => pathname === p ? " active" : "";
  const initials = auth?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  if (pathname === "/") return null;

  const NavLinks = () => (
    <>
      <Link className={`nav-item${active("/dashboard")}`} to="/dashboard" onClick={() => setMenuOpen(false)}
        style={{ color: active("/dashboard") ? "var(--violet)" : "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
        Dashboard
      </Link>
      <Link className={`nav-item${active("/documents")}`} to="/documents" onClick={() => setMenuOpen(false)}
        style={{ color: active("/documents") ? "var(--violet)" : "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
        Documents
      </Link>
      <Link className={`nav-item${active("/folders")}`} to="/folders" onClick={() => setMenuOpen(false)}
        style={{ color: active("/folders") ? "var(--violet)" : "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
        Folders
      </Link>
      <Link className={`nav-item${active("/upload")}`} to="/upload" onClick={() => setMenuOpen(false)}
        style={{ color: active("/upload") ? "var(--violet)" : "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
        Upload
      </Link>
      <Link className={`nav-item${active("/profile")}`} to="/profile" onClick={() => setMenuOpen(false)}
        style={{ color: active("/profile") ? "var(--violet)" : "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
        Profile
      </Link>
      {auth?.role === "ADMIN" && (
        <>
          <Link className={`nav-item${active("/admin/approval")}`} to="/admin/approval" onClick={() => setMenuOpen(false)}
            style={{ color: active("/admin/approval") ? "var(--gold)" : "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
            Approvals
          </Link>
          <Link className={`nav-item${active("/admin/users")}`} to="/admin/users" onClick={() => setMenuOpen(false)}
            style={{ color: active("/admin/users") ? "var(--violet)" : "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
            Users
          </Link>
          <Link className={`nav-item${active("/admin/audit-logs")}`} to="/admin/audit-logs" onClick={() => setMenuOpen(false)}
            style={{ color: active("/admin/audit-logs") ? "var(--cyan)" : "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
            Audit
          </Link>
          <Link className={`nav-item${active("/admin/tags")}`} to="/admin/tags" onClick={() => setMenuOpen(false)}
            style={{ color: active("/admin/tags") ? "var(--violet)" : "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
            Tags
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar-ghost">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Link to="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <DmsLogo size={30} />
          <span className="hide-on-mobile" style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.5px", color: "var(--text-primary)" }}>DMS Portal</span>
        </Link>
      </div>

      <div className="hide-on-mobile" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <NavLinks />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button className="theme-btn hide-on-mobile" onClick={toggle} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.3rem" }} aria-label="Toggle theme">
          {theme === "dark" ? <SunIcon color="var(--violet)" size={18} /> : <MoonIcon color="var(--violet)" size={18} />}
        </button>
        <Link to="/profile" className="hide-on-mobile" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.3rem 1rem", background: "var(--bg-input)", borderRadius: "100px", border: "1px solid var(--border)", cursor: "pointer" }}>
          <div className="avatar" style={{ width: "28px", height: "28px", fontSize: "0.7rem" }}>{initials}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>{auth?.name?.split(" ")[0]}</span>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{auth?.role}</span>
          </div>
        </Link>
        <button className="btn btn-secondary btn-sm hide-on-mobile" onClick={logout} style={{ borderRadius: "50px", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <LogOutIcon size={14} /> Logout
        </button>
        
        {/* Mobile controls */}
        <button className="mobile-menu-btn" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <SunIcon color="var(--violet)" size={20} /> : <MoonIcon color="var(--violet)" size={20} />}
        </button>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <XCloseIcon size={22} color="var(--text-primary)" /> : <MenuIcon size={22} color="var(--text-primary)" />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-nav-menu animate-fade">
          <NavLinks />
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div className="avatar" style={{ width: "28px", height: "28px", fontSize: "0.7rem" }}>{initials}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>{auth?.name}</span>
                <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{auth?.role}</span>
              </div>
            </Link>
            <button className="btn btn-secondary btn-full" onClick={logout} style={{ borderRadius: "50px", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%" }}>
              <LogOutIcon size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
