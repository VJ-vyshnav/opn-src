import { Instagram, Linkedin, Mail } from "lucide-react";

// Update these to your club's real profile URLs
const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/opensource-saintgits/", Icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/opensource.saintgits?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", Icon: Instagram },
  { label: "Gmail", href: "#", Icon: Mail },
];

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

        <div style={{ display: "flex", gap: 16 }}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              style={{
                color: "var(--muted)",
                display: "inline-flex",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              <Icon size={18} strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}