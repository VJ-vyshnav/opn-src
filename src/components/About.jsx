const POINTS = [
  {
    label: "build",
    text: "Weekly working sessions where members ship on real open-source repos — ours and upstream.",
  },
  {
    label: "learn",
    text: "Short, practical talks on git, CI, and contributing well — no fluff, no filler slides.",
  },
  {
    label: "belong",
    text: "A standing group of people on campus who'll actually review your PR at 1am.",
  },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <p className="eyebrow">about</p>
        <h2 className="section-title">What the club actually does</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 32,
          }}
        >
          {POINTS.map((p) => (
            <div key={p.label}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--add)",
                  marginBottom: 10,
                }}
              >
                + {p.label}
              </div>
              <p style={{ margin: 0, color: "var(--muted)" }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
