import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/submit", label: "Drop a Review" },
  ];

  return (
    <nav style={{
      background: "var(--forest)",
      borderBottom: "1px solid rgba(212,160,23,0.2)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      width: "100%",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1.25rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--cream)",
            letterSpacing: "-0.02em",
          }}>
            Corper's <span style={{ color: "var(--gold)" }}>Compass</span>
          </span>
          <span style={{
            background: "var(--gold)",
            color: "var(--forest-dark)",
            fontSize: "0.5rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            padding: "0.15rem 0.4rem",
            borderRadius: "2px",
            fontFamily: "'Space Grotesk', sans-serif",
            textTransform: "uppercase",
          }}>Beta</span>
        </Link>

        {/* Desktop links — only show on wide screens */}
        {typeof window !== "undefined" && window.innerWidth > 768 ? null : null}
        <DesktopLinks links={links} pathname={pathname} />

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none", border: "none",
            color: "var(--cream)", cursor: "pointer",
            display: "none", padding: "0.25rem",
          }}
          id="hamburger-btn"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "var(--forest-dark)",
          padding: "1rem 1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          borderTop: "1px solid rgba(212,160,23,0.15)",
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: pathname === l.to ? "var(--gold)" : "var(--cream)",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "1rem",
            }}>{l.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        #hamburger-btn { display: flex !important; }
        @media (min-width: 768px) {
          #hamburger-btn { display: none !important; }
          #desktop-links { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function DesktopLinks({ links, pathname }) {
  return (
    <div id="desktop-links" style={{
      display: "none",
      alignItems: "center",
      gap: "2rem",
    }}>
      {links.map(l => (
        <Link key={l.to} to={l.to} style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          fontSize: "0.9rem",
          color: pathname === l.to ? "var(--gold)" : "rgba(250,246,239,0.75)",
          textDecoration: "none",
          borderBottom: pathname === l.to ? "2px solid var(--gold)" : "2px solid transparent",
          paddingBottom: "2px",
          whiteSpace: "nowrap",
        }}>{l.label}</Link>
      ))}
      <Link to="/submit" className="btn-gold" style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}>
        + Review
      </Link>
    </div>
  );
}