export default function Footer() {
  return (
    <footer style={{ padding: "32px 0", borderTop: "1px solid var(--line)" }}>
      <div
        className="wrap"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)" }}>
          open source club — est. 2026
        </span>
        <div style={{ display: "flex", gap: 18 }}>
          <a href="#" style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            github
          </a>
          <a href="#" style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            discord
          </a>
          <a href="#" style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
