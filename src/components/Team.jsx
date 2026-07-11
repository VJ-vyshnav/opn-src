import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

const FALLBACK_TEAM = [
  { id: "1", name: "Aditi Rao", role: "President", github: "aditirao", photo_url: null },
  { id: "2", name: "Kevin Thomas", role: "Vice President", github: "kevinthomas", photo_url: null },
  { id: "3", name: "Meera Nair", role: "Projects Lead", github: "meeranair", photo_url: null },
  { id: "4", name: "Sam George", role: "Events Lead", github: "samgeorge", photo_url: null },
];

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name, photoUrl, size = 64 }) {
  const [broken, setBroken] = useState(false);
  const showPhoto = photoUrl && !broken;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--ink)",
        color: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: size * 0.32,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {showPhoto ? (
        <img
          src={photoUrl}
          alt={name}
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setBroken(true)}
        />
      ) : (
        initials(name)
      )}
    </div>
  );
}

export default function Team() {
  const [team, setTeam] = useState(FALLBACK_TEAM);

  useEffect(() => {
    let ignore = false;

    async function fetchTeam() {
      const { data, error } = await supabase
        .from("members")
        .select("id, name, role, github, photo_url")
        .eq("is_core", true)
        .order("sort_order", { ascending: true });

      if (!ignore && !error && data && data.length > 0) {
        setTeam(data);
      }
    }

    fetchTeam();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section id="team" className="section">
      <div className="wrap">
        <p className="eyebrow">team</p>
        <h2 className="section-title">Who's maintaining this repo</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 20,
          }}
        >
          {team.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar name={m.name} photoUrl={m.photo_url} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{m.role}</div>
                {m.github && (
                  <a
                    href={`https://github.com/${m.github}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--add)", textDecoration: "none" }}
                  >
                    @{m.github}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}