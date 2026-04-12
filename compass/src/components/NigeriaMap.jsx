import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Annotation } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const GEO_URL = "/nigeria.json";

function getRatingColor(avg) {
  if (avg === null) return "#2D6A4F";
  if (avg >= 4) return "#1B6B3A";
  if (avg >= 3) return "#4A8C5C";
  if (avg >= 2) return "#C4820A";
  return "#8B2E2E";
}

function getRatingBorder(avg) {
  if (avg === null) return "#1A3C2E";
  if (avg >= 4) return "#D4A017";
  if (avg >= 3) return "#1A3C2E";
  if (avg >= 2) return "#A87C10";
  return "#6B1A1A";
}

export default function NigeriaMap({ onStateClick }) {
  const [hoveredState, setHoveredState] = useState(null);
  const [stateRatings, setStateRatings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const snap = await getDocs(collection(db, "reviews"));
        const data = {};
        snap.docs.forEach(doc => {
          const r = doc.data();
          if (!r.state) return;
          if (!data[r.state]) data[r.state] = { total: 0, count: 0 };
          const avg = (r.security + r.allowance + r.workEnvironment + r.socialLife) / 4;
          data[r.state].total += avg;
          data[r.state].count += 1;
        });
        const averages = {};
        Object.keys(data).forEach(state => {
          averages[state] = (data[state].total / data[state].count).toFixed(1);
        });
        setStateRatings(averages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRatings();
  }, []);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Hover label */}
      <div style={{
        position: "absolute",
        top: "0.75rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--forest-dark)",
        color: "var(--gold)",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: "0.8rem",
        padding: "0.35rem 1rem",
        borderRadius: "2px",
        border: "1px solid rgba(212,160,23,0.3)",
        opacity: hoveredState ? 1 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 10,
      }}>
        {hoveredState} {stateRatings[hoveredState] ? `· ⭐ ${stateRatings[hoveredState]}` : "· No reviews yet"} — click to explore
      </div>

      {/* Legend */}
      <div style={{
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
        background: "rgba(15,35,25,0.85)",
        border: "1px solid rgba(212,160,23,0.2)",
        borderRadius: "4px",
        padding: "0.6rem 0.85rem",
        zIndex: 10,
      }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.6rem", color: "rgba(250,246,239,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
          Avg Rating
        </div>
        {[
          { color: "#1B6B3A", label: "4–5 ⭐ Excellent" },
          { color: "#4A8C5C", label: "3–4 ⭐ Good" },
          { color: "#C4820A", label: "2–3 ⭐ Average" },
          { color: "#8B2E2E", label: "1–2 ⭐ Poor" },
          { color: "#2D6A4F", label: "No reviews" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: l.color, flexShrink: 0 }} />
            <span style={{ fontSize: "0.65rem", color: "rgba(250,246,239,0.7)", fontWeight: 300 }}>{l.label}</span>
          </div>
        ))}
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [8.0, 9.0], scale: 2800 }}
        style={{ width: "100%", height: "auto" }}
        viewBox="0 0 800 700"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) => (
            <>
              {geographies.map((geo) => {
                const stateName = geo.properties.admin1Name || "Unknown";
                const avg = stateRatings[stateName] ? parseFloat(stateRatings[stateName]) : null;
                const isHovered = hoveredState === stateName;
                const fill = isHovered ? "#D4A017" : getRatingColor(avg);
                const stroke = isHovered ? "#FAF6EF" : getRatingBorder(avg);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => {
                      if (onStateClick) onStateClick(stateName);
                      navigate(`/explore?state=${encodeURIComponent(stateName)}`);
                    }}
                    style={{
                      default: { fill, stroke, strokeWidth: 0.8, outline: "none", cursor: "pointer", transition: "fill 0.2s" },
                      hover: { fill: "#D4A017", stroke: "#FAF6EF", strokeWidth: 1, outline: "none", cursor: "pointer" },
                      pressed: { fill: "#A87C10", outline: "none" },
                    }}
                  />
                );
              })}

              {geographies.map((geo) => {
                const stateName = geo.properties.admin1Name || "";
                const centroid = geoCentroid(geo);
                return (
                  <Annotation
                    key={`label-${geo.rsmKey}`}
                    subject={centroid}
                    dx={0}
                    dy={0}
                    connectorProps={{}}
                  >
                    <text
                      textAnchor="middle"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "7px",
                        fontWeight: 600,
                        fill: "#FAF6EF",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      {stateName}
                    </text>
                  </Annotation>
                );
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
    </div>
  );
}