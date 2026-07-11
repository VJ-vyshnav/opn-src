import { useState } from "react";

const LINKS = [
  { label: "about", href: "#about" },
  { label: "events", href: "#events" },
  { label: "projects", href: "#projects" },
  { label: "team", href: "#team" },
  { label: "join", href: "#join" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(250,249,246,0.9)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <nav
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        <a
          href="#top"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ color: "var(--add)" }}>&gt;</span>
          open source club
        </a>

        <div
          className="nav-links"
          style={{ display: "flex", gap: 28 }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                color: "var(--muted)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="nav-toggle"
          style={{
            display: "none",
            background: "none",
            border: "1px solid var(--line)",
            borderRadius: 3,
            width: 36,
            height: 36,
            fontFamily: "var(--font-mono)",
            cursor: "pointer",
          }}
        >
          {open ? "×" : "≡"}
        </button>
      </nav>

      {open && (
        <div
          className="wrap"
          style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 20 }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ fontFamily: "var(--font-mono)", fontSize: 14, textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .nav-links { display: none !important; }
          .nav-toggle { display: inline-flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </header>
  );
}
