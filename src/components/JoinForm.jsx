import { useState } from "react";
import { supabase } from "../supabaseClient.js";

const initialForm = { name: "", email: "", year: "", division: "", github: "", why: "" };

export default function JoinForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const { error } = await supabase.from("membership_requests").insert([
      {
        name: form.name,
        email: form.email,
        year: form.year,
        division: form.division || null,
        github: form.github || null,
        why: form.why || null,
      },
    ]);

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("success");
    setForm(initialForm);
  }

  if (status === "success") {
    return (
      <section id="join" className="section">
        <div className="wrap">
          <p className="eyebrow">join</p>
          <div
            style={{
              border: "1px solid var(--add)",
              background: "var(--add-bg)",
              borderRadius: 6,
              padding: 24,
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              maxWidth: 480,
            }}
          >
            <div style={{ color: "var(--add)", marginBottom: 6 }}>+ request received</div>
            <p style={{ margin: 0, color: "var(--ink)", fontFamily: "var(--font-sans)" }}>
              We'll email you before the next session. Welcome aboard.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="join" className="section">
      <div className="wrap">
        <p className="eyebrow">join</p>
        <h2 className="section-title">Open a membership request</h2>

        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Field label="name" required>
            <input
              type="text"
              required
              value={form.name}
              onChange={update("name")}
              style={inputStyle}
              placeholder="Ada Lovelace"
            />
          </Field>

          <Field label="email" required>
            <input
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              style={inputStyle}
              placeholder="ada@college.edu"
            />
          </Field>

          <Field label="year">
            <select value={form.year} onChange={update("year")} style={inputStyle}>
              <option value="">select one</option>
              <option value="1">1st year</option>
              <option value="2">2nd year</option>
              <option value="3">3rd year</option>
              <option value="4">4th year</option>
              <option value="grad">grad student</option>
            </select>
          </Field>

          <Field label="division">
            <select value={form.division} onChange={update("division")} style={inputStyle}>
              <option value="">select one</option>
              <option value="CS-A">CS-A</option>
              <option value="CS-B">CS-B</option>
            </select>
          </Field>

          <Field label="github (optional)">
            <input
              type="text"
              value={form.github}
              onChange={update("github")}
              style={inputStyle}
              placeholder="ada-lovelace"
            />
          </Field>

          <Field label="why do you want to join? (optional)">
            <textarea
              value={form.why}
              onChange={update("why")}
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              placeholder="Tell us what you'd want to build."
            />
          </Field>

          {status === "error" && (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--del)", margin: 0 }}>
              submit failed — {errorMsg}
            </p>
          )}

          <button type="submit" className="btn" disabled={status === "submitting"} style={{ alignSelf: "flex-start" }}>
            {status === "submitting" ? "submitting…" : "$ submit request"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)" }}>
        {label}
        {required && <span style={{ color: "var(--del)" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  padding: "10px 12px",
  border: "1px solid var(--line)",
  borderRadius: 3,
  background: "var(--surface)",
  color: "var(--ink)",
};