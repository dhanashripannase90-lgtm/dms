import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Carousel from "../components/Carousel";

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
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="brand-icon" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", fontSize: "0.75rem", fontWeight: 900, letterSpacing: "-0.5px" }}>DMS</div>
                    <span className="hide-on-mobile" style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-1px", color: "var(--text-primary)" }}>DMS Portal</span>
                </div>
                
                <div className="hide-on-mobile" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <Link to="/" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 500 }}>Home</Link>
                    <button className="theme-btn" onClick={toggle} style={{ border: "none", background: "none" }}>
                        {theme === "dark" ? "🌙" : "☀️"}
                    </button>
                    <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                    <Link to="/register" className="btn-premium" style={{ padding: "0.5rem 1.5rem" }}>Register</Link>
                </div>

                <div className="mobile-only" style={{ alignItems: "center", gap: "1rem" }}>
                    <button className="mobile-menu-btn" onClick={toggle} style={{ border: "none", background: "none" }}>
                        {theme === "dark" ? "🌙" : "☀️"}
                    </button>
                    <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? "✕" : "☰"}
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

            <main style={{ width: "100%", padding: "5.5rem 3rem 4rem" }}>
                {/* Hero Section */}
                <section className="animate-slide-up">
                    <Carousel slides={slides} />
                </section>

                {/* Features */}
                <section style={{ marginTop: "5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                    {[
                        { icon: "📁", title: "Folder Management", desc: "Organize documents into nested folders with custom colors and hierarchical navigation." },
                        { icon: "✅", title: "Approval Workflow", desc: "Documents submitted by users go through an admin approval process before being published." },
                        { icon: "🏷️", title: "Document Tagging", desc: "Apply custom tags and labels for lightning-fast categorization and filtering." },
                        { icon: "🕒", title: "Version Control", desc: "Every file replacement is saved as a version. Download or restore any previous version." },
                        { icon: "📊", title: "Audit Logs", desc: "Track every upload, download, approval and deletion with timestamped audit trails." },
                    ].map(f => (
                        <div key={f.title} className="glass-panel" style={{ padding: "2.5rem", textAlign: "center" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{f.icon}</div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-primary)" }}>{f.title}</h3>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                        </div>
                    ))}
                </section>

                {/* CTA */}
                <section style={{ marginTop: "6rem", padding: "4rem 2rem", borderRadius: "28px", background: "var(--bg-elevated)", textAlign: "center", border: "1px solid var(--border)" }}>
                    <h2 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "1.25rem", letterSpacing: "-1px", color: "var(--text-primary)" }}>
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
