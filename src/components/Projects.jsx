import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

const FALLBACK_PROJECTS = [
  {
    id: "1",
    name: "Build with me",
    description: "A 1 week training program for first-years to explore and learn open source platforms,tools and workflows. Built and maintained by first-years.",
    language: "Go",
    stars: 42,
    url: "#",
  },
  {
    id: "2",
    name: "attendance-bot",
    description: "Self-hosted attendance tracker with a Slack bot front-end. Built and maintained by first-years.",
    language: "TypeScript",
    stars: 18,
    url: "#",
  },
  {
    id: "3",
    name: "clubsite",
    description: "This website. Static React front-end, Supabase backend — fork it for your own club.",
    language: "JavaScript",
    stars: 9,
    url: "#",
  },
];

const LANG_COLORS = {
  Go: "#5fae7d",
  TypeScript: "#4f7fd8",
  JavaScript: "#d8a94f",
  Python: "#5b9bd5",
  Rust: "#c65a4d",
};

export default function Projects() {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);

  useEffect(() => {
    let ignore = false;

    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, description, language, stars, url")
        .order("stars", { ascending: false });

      if (!ignore && !error && data && data.length > 0) {
        setProjects(data);
      }
    }

    fetchProjects();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section id="projects" className="section">
      <div className="wrap">
        <p className="eyebrow">projects</p>
        <h2 className="section-title">Things our members built</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {projects.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target={p.url?.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              style={{
                display: "block",
                border: "1px solid var(--line)",
                borderRadius: 6,
                padding: 20,
                textDecoration: "none",
                color: "inherit",
                background: "var(--surface)",
                transition: "border-color 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 15 }}>
                  {p.name}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)" }}>
                  ★ {p.stars}
                </span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 14, margin: "10px 0 16px" }}>
                {p.description}
              </p>
              {p.language && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: LANG_COLORS[p.language] || "var(--muted)",
                      display: "inline-block",
                    }}
                  />
                  {p.language}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
