import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import NigeriaMap from "../components/NigeriaMap";
import { Star, Search, X } from "lucide-react";

function StarDisplay({ value }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={14}
          fill={value >= s ? "#D4A017" : "none"}
          stroke={value >= s ? "#D4A017" : "#6B8C7A"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const avg = ((review.security + review.allowance + review.workEnvironment + review.socialLife) / 4).toFixed(1);

  return (
    <div style={{
      background: "white",
      border: "1px solid rgba(26,60,46,0.1)",
      borderRadius: "4px",
      padding: "1.25rem",
      marginBottom: "1rem",
      transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <Link to={`/ppa/${encodeURIComponent(review.ppaName)}`} style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--forest)", marginBottom: "0.3rem", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--gold-muted)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--forest)"}
            >
              {review.ppaName} →
            </div>
          </Link>
          {review.ppaType && (
            <span className="tag" style={{ fontSize: "0.6rem" }}>{review.ppaType}</span>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.5rem" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--gold)" }}>{avg}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{review.year}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {[
          { label: "Security", value: review.security },
          { label: "Allowance", value: review.allowance },
          { label: "Work Env.", value: review.workEnvironment },
          { label: "Social Life", value: review.socialLife },
        ].map(r => (
          <div key={r.label}>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: "2px", fontWeight: 500 }}>{r.label}</div>
            <StarDisplay value={r.value} />
          </div>
        ))}
      </div>

      <p style={{
        fontSize: "0.85rem",
        color: "var(--ink)",
        lineHeight: 1.6,
        fontWeight: 300,
        borderTop: "1px solid rgba(26,60,46,0.08)",
        paddingTop: "0.75rem",
      }}>
        {review.review}
      </p>
    </div>
  );
}

export default function Explore() {
  const [searchParams] = useSearchParams();
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || null);
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!selectedState) return;
    setLoading(true);
    setSearchTerm("");
    setYearFilter("all");

    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("state", "==", selectedState),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [selectedState]);

  // Filter + sort whenever sear
  useEffect(() => {
    let result = [...reviews];

    if (searchTerm) {
      result = result.filter(r =>
        r.ppaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.review.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (yearFilter !== "all") {
      result = result.filter(r => String(r.year) === yearFilter);
    }

    if (sortBy === "highest") {
      result.sort((a, b) => {
        const avgA = (a.security + a.allowance + a.workEnvironment + a.socialLife) / 4;
        const avgB = (b.security + b.allowance + b.workEnvironment + b.socialLife) / 4;
        return avgB - avgA;
      });
    } else if (sortBy === "lowest") {
      result.sort((a, b) => {
        const avgA = (a.security + a.allowance + a.workEnvironment + a.socialLife) / 4;
        const avgB = (b.security + b.allowance + b.workEnvironment + b.socialLife) / 4;
        return avgA - avgB;
      });
    }

    setFiltered(result);
  }, [searchTerm, yearFilter, sortBy, reviews]);

  const years = ["all", "2026", "2025", "2024", "2023", "2022"];

  const inputStyle = {
    width: "100%",
    padding: "0.65rem 1rem",
    border: "1.5px solid rgba(26,60,46,0.2)",
    borderRadius: "2px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.85rem",
    outline: "none",
    color: "var(--ink)",
    background: "white",
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <style>{`
        .explore-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 2rem;
          max-width: 1300px;
          margin: 0 auto;
          padding: 2rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .explore-layout {
            grid-template-columns: 1fr !important;
            padding: 1.25rem !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: "var(--forest)",
        padding: "2.5rem 2rem",
        borderBottom: "1px solid rgba(212,160,23,0.2)",
      }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div className="tag" style={{ marginBottom: "0.75rem" }}>Explore</div>
          <h1 style={{
            color: "var(--cream)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}>
            {selectedState ? `${selectedState} State` : "Find reviews by state"}
          </h1>
          <p style={{ color: "rgba(250,246,239,0.6)", fontWeight: 300, fontSize: "0.95rem" }}>
            {selectedState
              ? `Showing PPA reviews for ${selectedState}. Click another state to switch.`
              : "Click any state on the map to see PPA reviews."}
          </p>
        </div>
      </div>

      <div className="explore-layout">
        {/* Map */}
        <div style={{
          background: "var(--forest)",
          borderRadius: "4px",
          padding: "1rem",
          border: "1px solid rgba(212,160,23,0.15)",
          position: "sticky",
          top: "80px",
        }}>
          <NigeriaMap onStateClick={(state) => setSelectedState(state)} />
        </div>

        {/* Sidebar */}
        <div>
          {/* Search + filters — only show when state is selected */}
          {selectedState && (
            <div style={{ marginBottom: "1.25rem" }}>
              {/* Search bar */}
              <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                <Search size={16} style={{
                  position: "absolute", left: "0.75rem", top: "50%",
                  transform: "translateY(-50%)", color: "var(--muted)",
                  pointerEvents: "none",
                }} />
                <input
                  type="text"
                  placeholder="Search PPA name or keyword..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: "2.25rem", paddingRight: searchTerm ? "2.25rem" : "1rem" }}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} style={{
                    position: "absolute", right: "0.75rem", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "var(--muted)",
                    display: "flex", padding: 0,
                  }}>
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Year + Sort filters */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={inputStyle}>
                  {years.map(y => (
                    <option key={y} value={y}>{y === "all" ? "All years" : y}</option>
                  ))}
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={inputStyle}>
                  <option value="newest">Newest first</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                </select>
              </div>
            </div>
          )}

          {/* Results */}
          {!selectedState ? (
            <div style={{
              border: "1px dashed rgba(26,60,46,0.25)",
              borderRadius: "4px",
              padding: "3rem 2rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🗺️</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--forest)", marginBottom: "0.5rem" }}>
                Select a state
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 300 }}>
                Click any state on the map to see corper reviews for PPAs in that state.
              </p>
            </div>
          ) : loading ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ color: "var(--muted)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Loading reviews...
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              border: "1px dashed rgba(26,60,46,0.25)",
              borderRadius: "4px",
              padding: "3rem 2rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                {reviews.length === 0 ? "📭" : "🔍"}
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--forest)", marginBottom: "0.5rem" }}>
                {reviews.length === 0 ? `No reviews yet for ${selectedState}` : "No results found"}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 300, marginBottom: "1.5rem" }}>
                {reviews.length === 0
                  ? "Be the first to drop a review for a PPA in this state."
                  : "Try a different search term or filter."}
              </p>
              {reviews.length === 0 && (
                <a href="/submit" className="btn-gold" style={{ fontSize: "0.9rem" }}>
                  Drop a Review →
                </a>
              )}
            </div>
          ) : (
            <div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "var(--muted)",
                marginBottom: "1rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid rgba(26,60,46,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span>{filtered.length} of {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                <a href="/submit" style={{
                  fontSize: "0.8rem",
                  color: "var(--gold-muted)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}>+ Add yours</a>
              </div>
              {filtered.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}