import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Carousel from "../components/Carousel";
import DmsLogo from "../components/DmsLogo";
import { FolderIcon, CheckIcon, TagIcon, ClockIcon, ChartIcon } from "../components/Icons";

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

const HomePage = () => {
    const { theme, toggle } = useTheme();

    const slides = [
        {
            title: "Secure Document Management",
            description: "Enterprise-grade encryption and role-based access control for your most sensitive institutional documents.",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
            actions: (
                <>
                    <Link to="/register" className="btn-premium">Get Started Free</Link>
                    <Link to="/login" className="btn btn-secondary btn-md">Sign In</Link>
                </>
            )
        },
        {
            title: "Smart Organization & Tagging",
            description: "Organize documents into folders, apply custom tags, and find anything instantly with powerful search.",
            image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074&auto=format&fit=crop",
            actions: <Link to="/register" className="btn-gold">Explore Features</Link>
        },
        {
            title: "Approval Workflow & Audit Trails",
            description: "Track every document action with full audit logs and multi-step approval workflows built in.",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
            actions: <Link to="/register" className="btn-premium">Join Now</Link>
        }
    ];

    const features = [
        { icon: <FolderIcon size={32} color="var(--violet)" />, title: "Folder Management", desc: "Organize documents into nested folders with custom colors and hierarchical navigation." },
        { icon: <CheckIcon size={32} color="#10b981" />, title: "Approval Workflow", desc: "Documents submitted by users go through an admin approval process before being published." },
        { icon: <TagIcon size={32} color="var(--gold)" />, title: "Document Tagging", desc: "Apply custom tags and labels for lightning-fast categorization and filtering." },
        { icon: <ClockIcon size={32} color="var(--cyan)" />, title: "Version Control", desc: "Every file replacement is saved as a version. Download or restore any previous version." },
        { icon: <ChartIcon size={32} color="var(--violet)" />, title: "Audit Logs", desc: "Track every upload, download, approval and deletion with timestamped audit trails." },
    ];

    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <div className="landing-shell animate-fade">
            {/* Mesh Background */}
            <div className="mesh-bg">
                <div className="mesh-glow" style={{ top: "-10%", left: "-10%", background: "var(--violet-glow)" }} />
                <div className="mesh-glow" style={{ bottom: "0%", right: "-10%", background: "var(--gold-glow)", animationDelay: "-5s" }} />
            </div>

            {/* Ghost Navbar */}
            <nav className="navbar-ghost">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <DmsLogo size={30} />
                    <span className="hide-on-mobile" style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-1px", color: "var(--text-primary)" }}>DMS Portal</span>
                </div>
                
                <div className="hide-on-mobile" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <Link to="/" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500 }}>Home</Link>
                    <button className="theme-btn" onClick={toggle} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        {theme === "dark" ? <SunIcon color="var(--violet)" size={18} /> : <MoonIcon color="var(--violet)" size={18} />}
                    </button>
                    <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                    <Link to="/register" className="btn-premium" style={{ padding: "0.5rem 1.5rem" }}>Register</Link>
                </div>

                <div className="mobile-only" style={{ alignItems: "center", gap: "0.75rem" }}>
                    <button className="mobile-menu-btn" onClick={toggle} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        {theme === "dark" ? <SunIcon color="var(--violet)" size={20} /> : <MoonIcon color="var(--violet)" size={20} />}
                    </button>
                    <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        {menuOpen ? <XCloseIcon size={22} color="var(--text-primary)" /> : <MenuIcon size={22} color="var(--text-primary)" />}
                    </button>
                </div>
                
                {menuOpen && (
                    <div className="mobile-nav-menu animate-fade">
                        <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500 }}>Home</Link>
                        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <Link to="/login" className="btn btn-secondary btn-full" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="btn-premium btn-full" onClick={() => setMenuOpen(false)}>Register</Link>
                        </div>
                    </div>
                )}
            </nav>

            <main style={{ width: "100%", padding: "5.5rem clamp(1rem, 4vw, 3rem) 4rem" }}>
                {/* Hero Section */}
                <section className="animate-slide-up">
                    <Carousel slides={slides} />
                </section>

                {/* Features */}
                <section style={{ marginTop: "5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
                    {features.map(f => (
                        <div key={f.title} className="glass-panel" style={{ padding: "2.5rem", textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "16px", background: "var(--bg-input)", border: "1px solid var(--border)", margin: "0 auto 1.25rem" }}>
                                {f.icon}
                            </div>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-primary)" }}>{f.title}</h3>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, fontSize: "0.95rem" }}>{f.desc}</p>
                        </div>
                    ))}
                </section>

                {/* CTA */}
                <section style={{ marginTop: "6rem", padding: "clamp(2rem, 5vw, 4rem) 2rem", borderRadius: "28px", background: "var(--bg-elevated)", textAlign: "center", border: "1px solid var(--border)" }}>
                    <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)", fontWeight: 800, marginBottom: "1.25rem", letterSpacing: "-1px", color: "var(--text-primary)" }}>
                        Ready to Modernize Your Document Workflow?
                    </h2>
                    <p style={{ color: "var(--text-secondary)", maxWidth: "540px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
                        Join institutions that trust DMS for secure, organized, and auditable document management.
                    </p>
                    <Link to="/register" className="btn-premium" style={{ fontSize: "1.05rem" }}>Start Your Journey Today</Link>
                </section>
            </main>

            <footer style={{ padding: "3rem 2rem", borderTop: "1px solid var(--border)", textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>© 2026 DMS Portal — Document Management System. Built for Institutions.</p>
            </footer>
        </div>
    );
};

export default HomePage;
