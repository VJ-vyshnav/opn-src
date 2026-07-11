export default function Hero() {
  return (
    <section id="top" className="section" style={{ paddingTop: 72, }}>
      <div className="wrap">
        <p className="eyebrow" style={{ fontSize: 18, color: "var(--ink)" }}>Saintgits{" "}
          <span style={{ color: "var(--muted)" }}>open_source club</span></p>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.15, maxWidth: 720 }}>
          Community,{" "}
          <span style={{ color: "var(--add)" }}>Over code</span>
        </h1>

        <p
          style={{
            marginTop: 20,
            maxWidth: 560,
            color: "var(--muted)",
            fontSize: 17,
          }}
        >
          A student community for people who'd rather open a pull request than
          sit through another lecture on it. Weekly build sessions,
          real maintainer talks, and projects that outlive the semester.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <a href="#join" className="btn">
            $ join --club
          </a>
          <a href="#projects" className="btn btn-ghost">
            view projects
          </a>
        </div>

        <div
          style={{
            marginTop: 56,
            background: "var(--ink)",
            color: "#d7d9dc",
            borderRadius: 6,
            padding: "18px 20px",
            fontFamily: "var(--font-mono)",
            fontSize: 13.5,
            maxWidth: 560,
            boxShadow: "0 12px 30px -14px rgba(22,24,26,0.35)",
          }}
        >
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#c65a4d", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d8a94f", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#5fae7d", display: "inline-block" }} />
          </div>
          <div><span style={{ color: "#7cc99b" }}>$</span> git log --oneline -3</div>
          <div style={{ marginTop: 8, color: "#9aa0a6" }}>b4f2a9 feat: launch <span style={{ color: "#ffffff" }}>prayoga</span> hackathon</div>
          <div style={{ color: "#9aa0a6" }}>d8c1e3 feat:  <span style={{ color: "#ffffff" }}>UI/UX design </span>competition showdown</div>
          <div style={{ color: "#9aa0a6" }}>a9e4f2 chore: host <span style={{ color: "#ffffff" }}>build_with_me</span> session</div>
          <div style={{ color: "#9aa0a6" }}>
            7c88de first commit
            <span className="cursor" aria-hidden="true">▍</span>
          </div>
        </div>
      </div>

      <style>{`
        .cursor {
          display: inline-block;
          margin-left: 4px;
          animation: blink 1s steps(1) infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
