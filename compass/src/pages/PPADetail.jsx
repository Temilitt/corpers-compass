import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { Star, ArrowLeft, MapPin, Calendar, Building } from "lucide-react";

function StarDisplay({ value }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={16}
          fill={value >= s ? "#D4A017" : "none"}
          stroke={value >= s ? "#D4A017" : "#6B8C7A"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function RatingBar({ label, value }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "0.4rem",
      }}>
        <span style={{ fontSize: "0.85rem", color: "var(--forest)", fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif" }}>
          {label}
        </span>
        <span style={{ fontSize: "0.85rem", color: "var(--gold-muted)", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
          {value.toFixed(1)}/5
        </span>
      </div>
      <div style={{
        height: "6px", background: "rgba(26,60,46,0.1)",
        borderRadius: "3px", overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${(value / 5) * 100}%`,
          background: value >= 4 ? "#1B6B3A" : value >= 3 ? "#4A8C5C" : value >= 2 ? "#C4820A" : "#8B2E2E",
          borderRadius: "3px",
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

export default function PPADetail() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const ppaName = decodeURIComponent(id);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("ppaName", "==", ppaName),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [ppaName]);

  const avg = (field) => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + (r[field] || 0), 0) / reviews.length;
  };

  const overallAvg = reviews.length
    ? ((avg("security") + avg("allowance") + avg("workEnvironment") + avg("socialLife")) / 4).toFixed(1)
    : null;

  const state = reviews[0]?.state || "";

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)", fontFamily: "'Space Grotesk', sans-serif" }}>Loading...</p>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", padding: "2rem" }}>
        <div style={{ fontSize: "3rem" }}>📭</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--forest)" }}>No reviews found</h2>
        <Link to="/explore" className="btn-gold">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "var(--forest)",
        padding: "2.5rem 2rem",
        borderBottom: "1px solid rgba(212,160,23,0.2)",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Link to={`/explore?state=${encodeURIComponent(state)}`} style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            color: "rgba(250,246,239,0.5)", textDecoration: "none",
            fontSize: "0.85rem", marginBottom: "1.25rem",
            fontFamily: "'Space Grotesk', sans-serif",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(250,246,239,0.5)"}
          >
            <ArrowLeft size={16} /> Back to {state}
          </Link>

          <div className="tag" style={{ marginBottom: "0.75rem" }}>PPA Review</div>
          <h1 style={{
            color: "var(--cream)",
            fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}>
            {ppaName}
          </h1>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {state && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(250,246,239,0.6)", fontSize: "0.85rem" }}>
                <MapPin size={14} /> {state}
              </div>
            )}
            {reviews[0]?.ppaType && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(250,246,239,0.6)", fontSize: "0.85rem" }}>
                <Building size={14} /> {reviews[0].ppaType}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(250,246,239,0.6)", fontSize: "0.85rem" }}>
              <Calendar size={14} /> {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "2.5rem",
          alignItems: "start",
        }}>

          {/* Reviews list */}
          <div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.1rem",
              color: "var(--forest)",
              marginBottom: "1.25rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid rgba(26,60,46,0.1)",
            }}>
              All Reviews
            </h2>

            {reviews.map(r => (
              <div key={r.id} style={{
                background: "white",
                border: "1px solid rgba(26,60,46,0.1)",
                borderRadius: "4px",
                padding: "1.5rem",
                marginBottom: "1rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {[1,2,3,4,5].map(s => {
                      const avg = (r.security + r.allowance + r.workEnvironment + r.socialLife) / 4;
                      return (
                        <Star key={s} size={16}
                          fill={avg >= s ? "#D4A017" : "none"}
                          stroke={avg >= s ? "#D4A017" : "#6B8C7A"}
                          strokeWidth={1.5}
                        />
                      );
                    })}
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 300 }}>{r.year}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
                  {[
                    { label: "Security", value: r.security },
                    { label: "Allowance", value: r.allowance },
                    { label: "Work Env.", value: r.workEnvironment },
                    { label: "Social Life", value: r.socialLife },
                  ].map(c => (
                    <div key={c.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{c.label}</span>
                      <StarDisplay value={c.value} />
                    </div>
                  ))}
                </div>

                <p style={{
                  fontSize: "0.88rem", color: "var(--ink)", lineHeight: 1.7,
                  fontWeight: 300, borderTop: "1px solid rgba(26,60,46,0.08)",
                  paddingTop: "0.75rem",
                }}>
                  {r.review}
                </p>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div style={{ position: "sticky", top: "80px" }}>
            {/* Overall score */}
            <div style={{
              background: "var(--forest)",
              borderRadius: "4px",
              padding: "1.5rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}>
              <div style={{ fontSize: "0.7rem", color: "rgba(250,246,239,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.5rem" }}>
                Overall Rating
              </div>
              <div style={{ fontSize: "3.5rem", fontWeight: 700, color: "var(--gold)", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
                {overallAvg}
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(250,246,239,0.4)", marginTop: "0.4rem" }}>
                out of 5 · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Category breakdown */}
            <div style={{
              background: "white",
              border: "1px solid rgba(26,60,46,0.1)",
              borderRadius: "4px",
              padding: "1.25rem",
              marginBottom: "1rem",
            }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: "var(--forest)", marginBottom: "1rem" }}>
                Category Breakdown
              </h3>
              <RatingBar label="🛡️ Security" value={avg("security")} />
              <RatingBar label="💰 Allowance" value={avg("allowance")} />
              <RatingBar label="💼 Work Env." value={avg("workEnvironment")} />
              <RatingBar label="🎉 Social Life" value={avg("socialLife")} />
            </div>

            <Link to="/submit" className="btn-gold" style={{ display: "block", textAlign: "center", fontSize: "0.9rem" }}>
              Add Your Review →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ppa-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}