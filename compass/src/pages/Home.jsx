import { Link } from "react-router-dom";
import { MapPin, Star, Shield } from "lucide-react";

export default function Home() {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <style>{`
        .hero {
          background: var(--forest);
          min-height: 90vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 4rem 5rem;
          gap: 3rem;
          position: relative;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        .hero-text { position: relative; z-index: 1; }
        .hero-cards { display: flex; flex-direction: column; gap: 1rem; position: relative; z-index: 1; }
        .stats-row { display: flex; gap: 2rem; margin-top: 2.5rem; border-top: 1px solid rgba(212,160,23,0.2); padding-top: 1.5rem; flex-wrap: wrap; }
        .how-section { padding: 5rem; background: var(--cream); box-sizing: border-box; width: 100%; }
        .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .cta-banner {
          background: var(--forest-dark);
          padding: 4rem 5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          box-sizing: border-box;
          width: 100%;
        }

        @media (max-width: 768px) {
          .hero {
            grid-template-columns: 1fr !important;
            padding: 2.5rem 1.25rem !important;
            min-height: auto !important;
            gap: 2rem !important;
          }
          .how-section { padding: 3rem 1.25rem !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .cta-banner { padding: 2.5rem 1.25rem !important; flex-direction: column; align-items: flex-start; }
          .hero-cards { display: none !important; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 80% 20%, rgba(212,160,23,0.07) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        <div className="hero-text">
          <div className="tag" style={{ marginBottom: "1.5rem" }}>By corpers, for corpers</div>

          <h1 style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            color: "var(--cream)",
            lineHeight: 1.05,
            marginBottom: "1.25rem",
            letterSpacing: "-0.03em",
          }}>
            Know your<br />
            <span style={{ color: "var(--gold)" }}>PPA</span> before<br />
            you land.
          </h1>

          <p style={{
            color: "rgba(250,246,239,0.7)",
            fontSize: "1rem",
            lineHeight: 1.7,
            marginBottom: "2rem",
            maxWidth: "400px",
            fontWeight: 300,
          }}>
            Anonymous reviews from corpers who've been there. Rate security, allowance, work environment and social life — state by state, PPA by PPA.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/explore" className="btn-gold">Explore the Map</Link>
            <Link to="/submit" className="btn-outline">Drop a Review</Link>
          </div>

          <div className="stats-row">
            {[
              { num: "36", label: "States covered" },
              { num: "100%", label: "Anonymous" },
              { num: "Free", label: "Always" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--gold)" }}>{s.num}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(250,246,239,0.5)", fontWeight: 300 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-cards">
          {[
            { icon: <MapPin size={20} />, title: "Interactive Map", desc: "Click any state on the Nigeria map to see PPA reviews and ratings." },
            { icon: <Star size={20} />, title: "Rate 4 Categories", desc: "Security, allowance payment, work environment, and social life." },
            { icon: <Shield size={20} />, title: "100% Anonymous", desc: "Firebase anonymous auth — no login, no trace, just honest reviews." },
          ].map(f => (
            <div key={f.title} style={{
              background: "rgba(250,246,239,0.04)",
              border: "1px solid rgba(212,160,23,0.15)",
              borderRadius: "4px",
              padding: "1.25rem 1.5rem",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}>
              <div style={{
                color: "var(--gold)",
                background: "rgba(212,160,23,0.1)",
                borderRadius: "4px",
                padding: "0.5rem",
                flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "var(--cream)", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{f.title}</div>
                <div style={{ color: "rgba(250,246,239,0.55)", fontSize: "0.85rem", lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="tag" style={{ marginBottom: "1rem" }}>How it works</div>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", marginBottom: "3rem", color: "var(--forest)" }}>
            Three steps, zero stress.
          </h2>
          <div className="how-grid">
            {[
              { num: "01", title: "Find your state", desc: "Click your NYSC state on the interactive map or search by PPA name." },
              { num: "02", title: "Read real reviews", desc: "Anonymous corpers rate their experience across 4 key categories." },
              { num: "03", title: "Share yours", desc: "Done serving? Help the next batch. Drop your honest review anonymously." },
            ].map(s => (
              <div key={s.num} style={{ borderTop: "2px solid var(--forest)", paddingTop: "1.5rem" }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "2.5rem", fontWeight: 700,
                  color: "var(--cream-dark)",
                  lineHeight: 1, marginBottom: "0.75rem",
                  WebkitTextStroke: "1px var(--forest)",
                }}>{s.num}</div>
                <h3 style={{ fontSize: "1rem", color: "var(--forest)", marginBottom: "0.5rem" }}>{s.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.6, fontWeight: 300 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div>
          <h2 style={{ color: "var(--cream)", fontSize: "clamp(1.3rem, 3vw, 2rem)", marginBottom: "0.5rem" }}>
            Already served? <span style={{ color: "var(--gold)" }}>Pay it forward.</span>
          </h2>
          <p style={{ color: "rgba(250,246,239,0.55)", fontWeight: 300, fontSize: "0.9rem" }}>
            Your review could save someone from a terrible posting.
          </p>
        </div>
        <Link to="/submit" className="btn-gold" style={{ whiteSpace: "nowrap" }}>
          Drop a Review →
        </Link>
      </section>
    </div>
  );
}