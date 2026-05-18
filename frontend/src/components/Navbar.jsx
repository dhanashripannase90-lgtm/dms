import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthData, getAuthData } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";

// Pixel-perfect, modern Lucide SVG Icons matching the premium theme
const SunIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const LogoIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))", flexShrink: 0 }}>
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <path d="M12 2L2 7l10 5 10-5-10-5Z" fill="url(#logoGrad)" />
    <path d="M2 17l10 5 10-5" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>
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
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <LogoIcon size={32} />
          <span className="hide-on-mobile" style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.5px", color: "var(--text-primary)" }}>DMS Portal</span>
        </Link>
      </div>

      <div className="hide-on-mobile" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <NavLinks />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
        <button className="btn btn-secondary btn-sm hide-on-mobile" onClick={logout} style={{ borderRadius: "50px", border: "1px solid var(--border)" }}>
          Logout
        </button>
        
        {/* Mobile controls */}
        <button className="mobile-menu-btn" onClick={toggle} style={{ display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Toggle theme">
          {theme === "dark" ? <SunIcon color="var(--violet)" size={20} /> : <MoonIcon color="var(--violet)" size={20} />}
        </button>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
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
            <button className="btn btn-secondary btn-full" onClick={logout} style={{ borderRadius: "50px", border: "1px solid var(--border)" }}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
