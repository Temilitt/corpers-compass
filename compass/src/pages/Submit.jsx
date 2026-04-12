import { useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
    "Yobe", "Zamfara"
];

function StarRating({ label, value, onChange }) {
    const [hovered, setHovered] = useState(0);

    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "var(--forest)",
                marginBottom: "0.5rem",
            }}>{label}</div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => onChange(star)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "2px",
                            transition: "transform 0.1s",
                            transform: hovered >= star ? "scale(1.2)" : "scale(1)",
                        }}
                    >
                        <Star
                            size={28}
                            fill={(hovered || value) >= star ? "#D4A017" : "none"}
                            stroke={(hovered || value) >= star ? "#D4A017" : "#6B8C7A"}
                            strokeWidth={1.5}
                        />
                    </button>
                ))}
                <span style={{
                    marginLeft: "0.5rem",
                    color: "var(--muted)",
                    fontSize: "0.85rem",
                    alignSelf: "center",
                    fontWeight: 300,
                }}>
                    {value ? `${value}/5` : "Not rated"}
                </span>
            </div>
        </div>
    );
}

export default function Submit() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        state: "",
        ppaName: "",
        ppaType: "",
        year: new Date().getFullYear(),
        review: "",
        security: 0,
        allowance: 0,
        workEnvironment: 0,
        socialLife: 0,
    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.state || !form.ppaName || !form.review) {
            setError("Please fill in state, PPA name and your review.");
            return;
        }
        if (!form.security || !form.allowance || !form.workEnvironment || !form.socialLife) {
            setError("Please rate all 4 categories.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            let uid = "anonymous";
            try {
                await signInAnonymously(auth);
                uid = auth.currentUser?.uid;
            } catch (authErr) {
                console.warn("Auth failed, submitting without auth:", authErr.message);
            }
            await addDoc(collection(db, "reviews"), {
                ...form,
                createdAt: serverTimestamp(),
                uid,
            });
            setSuccess(true);
            setTimeout(() => navigate("/explore"), 2500);
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "1rem",
                background: "var(--cream)",
            }}>
                <div style={{ fontSize: "3rem" }}>🎉</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--forest)", fontSize: "1.8rem" }}>
                    Review submitted!
                </h2>
                <p style={{ color: "var(--muted)", fontWeight: 300 }}>
                    Thank you for helping the next batch. Redirecting you to Explore...
                </p>
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
                <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                    <div className="tag" style={{ marginBottom: "0.75rem" }}>Anonymous Review</div>
                    <h1 style={{
                        color: "var(--cream)",
                        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                        letterSpacing: "-0.02em",
                        marginBottom: "0.5rem",
                    }}>
                        Drop your PPA review
                    </h1>
                    <p style={{ color: "rgba(250,246,239,0.6)", fontWeight: 300, fontSize: "0.95rem" }}>
                        100% anonymous. No login required. Help the next corper make informed decisions.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem" }}>

                {/* State + PPA */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.1rem", color: "var(--forest)", marginBottom: "1.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                        PPA Information
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--forest)", marginBottom: "0.4rem" }}>
                                State *
                            </label>
                            <select
                                value={form.state}
                                onChange={e => handleChange("state", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    border: "1.5px solid rgba(26,60,46,0.2)",
                                    borderRadius: "2px",
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: "0.9rem",
                                    background: "white",
                                    color: "var(--ink)",
                                    outline: "none",
                                    appearance: "none",
                                }}
                            >
                                <option value="">Select state</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--forest)", marginBottom: "0.4rem" }}>
                                Year of service *
                            </label>
                            <select
                                value={form.year}
                                onChange={e => handleChange("year", Number(e.target.value))}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    border: "1.5px solid rgba(26,60,46,0.2)",
                                    borderRadius: "2px",
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: "0.9rem",
                                    background: "white",
                                    color: "var(--ink)",
                                    outline: "none",
                                    appearance: "none",
                                }}
                            >
                                {[2026, 2025, 2024, 2023, 2022].map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--forest)", marginBottom: "0.4rem" }}>
                            PPA Name *
                        </label>
                        <input
                            type="text"
                            value={form.ppaName}
                            onChange={e => handleChange("ppaName", e.target.value)}
                            placeholder="e.g. Zenith Bank Plc, Alausa Branch"
                            style={{
                                width: "100%",
                                padding: "0.75rem 1rem",
                                border: "1.5px solid rgba(26,60,46,0.2)",
                                borderRadius: "2px",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "0.9rem",
                                outline: "none",
                                color: "var(--ink)",
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "var(--forest)", marginBottom: "0.4rem" }}>
                            PPA Type
                        </label>
                        <select
                            value={form.ppaType}
                            onChange={e => handleChange("ppaType", e.target.value)}
                            style={{
                                width: "100%",
                                padding: "0.75rem 1rem",
                                border: "1.5px solid rgba(26,60,46,0.2)",
                                borderRadius: "2px",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "0.9rem",
                                background: "white",
                                color: "var(--ink)",
                                outline: "none",
                                appearance: "none",
                            }}
                        >
                            <option value="">Select type</option>
                            <option>Government Ministry</option>
                            <option>School / Education</option>
                            <option>Hospital / Health</option>
                            <option>Private Company</option>
                            <option>NGO / Non-profit</option>
                            <option>Bank / Finance</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid rgba(26,60,46,0.1)", margin: "2rem 0" }} />

                {/* Ratings */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.1rem", color: "var(--forest)", marginBottom: "1.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                        Rate your experience
                    </h2>
                    <StarRating label="🛡️ Security" value={form.security} onChange={v => handleChange("security", v)} />
                    <StarRating label="💰 Allowance Payment" value={form.allowance} onChange={v => handleChange("allowance", v)} />
                    <StarRating label="💼 Work Environment" value={form.workEnvironment} onChange={v => handleChange("workEnvironment", v)} />
                    <StarRating label="🎉 Social Life" value={form.socialLife} onChange={v => handleChange("socialLife", v)} />
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid rgba(26,60,46,0.1)", margin: "2rem 0" }} />

                {/* Written review */}
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.1rem", color: "var(--forest)", marginBottom: "1.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                        Your review
                    </h2>
                    <textarea
                        value={form.review}
                        onChange={e => handleChange("review", e.target.value)}
                        placeholder="Tell future corpers what it's really like. Be honest — this is anonymous."
                        rows={5}
                        style={{
                            width: "100%",
                            padding: "1rem",
                            border: "1.5px solid rgba(26,60,46,0.2)",
                            borderRadius: "2px",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.9rem",
                            lineHeight: 1.7,
                            resize: "vertical",
                            outline: "none",
                            color: "var(--ink)",
                        }}
                    />
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.4rem", fontWeight: 300 }}>
                        Minimum 30 characters. No personal information please.
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: "rgba(220,38,38,0.08)",
                        border: "1px solid rgba(220,38,38,0.3)",
                        borderRadius: "2px",
                        padding: "0.75rem 1rem",
                        color: "#dc2626",
                        fontSize: "0.9rem",
                        marginBottom: "1.5rem",
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        {error}
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-gold"
                    style={{
                        width: "100%",
                        fontSize: "1rem",
                        padding: "1rem",
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Submitting..." : "Submit Review Anonymously →"}
                </button>

                <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.8rem", marginTop: "1rem", fontWeight: 300 }}>
                    Your review is completely anonymous. We don't collect any identifying information.
                </p>
            </div>
        </div>
    );
}