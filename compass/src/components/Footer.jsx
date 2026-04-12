import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer style={{
            background: "var(--forest-dark)",
            borderTop: "1px solid rgba(212,160,23,0.15)",
            padding: "3rem 2rem 2rem",
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: "3rem",
            }}>
                {/* Brand */}
                <div>
                    <div style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        color: "var(--cream)",
                        marginBottom: "0.75rem",
                        letterSpacing: "-0.02em",
                    }}>
                        Corper's <span style={{ color: "var(--gold)" }}>Compass</span>
                    </div>
                    <p style={{
                        color: "rgba(250,246,239,0.45)",
                        fontSize: "0.85rem",
                        lineHeight: 1.7,
                        fontWeight: 300,
                        maxWidth: "280px",
                    }}>
                        Anonymous PPA reviews by corpers, for corpers. Know before you land.
                    </p>
                    <div style={{ marginTop: "1.25rem", display: "flex", gap: "1rem" }}>
                        {[
                            { label: "Twitter/X", href: "https://x.com/justTemilit" },
                            { label: "Instagram", href: "https://instagram.com/justTemilit" },
                            { label: "LinkedIn", href: "https://linkedin.com/in/adeboye-temiloluwa" },
                        ].map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                                style={{
                                    color: "rgba(250,246,239,0.35)",
                                    fontSize: "0.8rem",
                                    textDecoration: "none",
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 500,
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={e => e.target.style.color = "var(--gold)"}
                                onMouseLeave={e => e.target.style.color = "rgba(250,246,239,0.35)"}
                            >{s.label}</a>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div>
                    <div style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "var(--gold)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "1rem",
                    }}>Navigate</div>
                    {[
                        { to: "/", label: "Home" },
                        { to: "/explore", label: "Explore Map" },
                        { to: "/submit", label: "Drop a Review" },
                    ].map(l => (
                        <Link key={l.to} to={l.to} style={{
                            display: "block",
                            color: "rgba(250,246,239,0.5)",
                            fontSize: "0.85rem",
                            textDecoration: "none",
                            marginBottom: "0.5rem",
                            fontWeight: 300,
                            transition: "color 0.2s",
                        }}
                            onMouseEnter={e => e.target.style.color = "var(--cream)"}
                            onMouseLeave={e => e.target.style.color = "rgba(250,246,239,0.5)"}
                        >{l.label}</Link>
                    ))}
                </div>

                {/* Info */}
                <div>
                    <div style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "var(--gold)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "1rem",
                    }}>About</div>
                    {["100% Anonymous", "Free Forever", "Built by a Corper"].map(l => (
                        <div key={l} style={{
                            color: "rgba(250,246,239,0.5)",
                            fontSize: "0.85rem",
                            marginBottom: "0.5rem",
                            fontWeight: 300,
                        }}>{l}</div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                maxWidth: "1200px",
                margin: "2rem auto 0",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(212,160,23,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
            }}>
                <div style={{ color: "rgba(250,246,239,0.25)", fontSize: "0.78rem", fontWeight: 300 }}>
                    © 2026 Corper's Compass. Made for Nigerian corpers.
                </div>
                <div style={{ color: "rgba(250,246,239,0.25)", fontSize: "0.78rem", fontWeight: 300 }}>
                    Built by{" "}
                    <a href="https://github.com/Temilitt" target="_blank" rel="noreferrer" style={{ color: "var(--gold)", textDecoration: "none" }}>
                        Temiloluwa
                    </a>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          footer > div:first-child { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
        </footer>
    );
}