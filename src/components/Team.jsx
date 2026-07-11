import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

const FALLBACK_TEAM = [
  { id: "1", name: "Akshay Joseph", role: "President", github: "aditirao", photo_url: null },
  { id: "2", name: "Kevin Thomas", role: "Vice President", github: "kevinthomas", photo_url: null },
  { id: "3", name: "Meera Nair", role: "Projects Lead", github: "meeranair", photo_url: null },
  { id: "4", name: "Sam George", role: "Events Lead", github: "samgeorge", photo_url: null },
];

const CARD_W = 300;
const CARD_H = 300;
const STEP = 190; // horizontal distance between neighboring cards
const MAX_VISIBLE_OFFSET = 2; // cards further than this fade out completely
const AUTO_MS = 4200;

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name, photoUrl, size = 72 }) {
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

function MemberCard({ m, offset }) {
  const absOffset = Math.abs(offset);
  const isActive = offset === 0;

  const translateX = offset * STEP;
  const translateZ = -absOffset * 110;
  const rotateY = Math.max(-45, Math.min(45, offset * -28));
  const scale = isActive ? 1 : 0.82;
  const opacity = absOffset > MAX_VISIBLE_OFFSET ? 0 : isActive ? 1 : 0.55;
  const blur = isActive ? 0 : Math.min(absOffset * 3, 6);
  const zIndex = 100 - absOffset;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        width: CARD_W,
        marginLeft: -CARD_W / 2,
        zIndex,
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translateX(-50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale}) translateX(50%)`,
        transformStyle: "preserve-3d",
        pointerEvents: absOffset > MAX_VISIBLE_OFFSET ? "none" : "auto",
        transition:
          "transform 550ms cubic-bezier(.65,.05,.36,1), opacity 550ms ease, filter 550ms ease",
      }}
    >
      <div
        style={{
          borderRadius: 14,
          padding: 3,
          // the "darker margin" frame — same hue as the box, just deeper
          background: "color-mix(in srgb, var(--ink) 10%, var(--bg))",
          boxShadow: isActive
            ? "0 30px 60px -16px rgba(0,0,0,0.45), 0 10px 20px -8px rgba(0,0,0,0.25)"
            : "0 16px 32px -14px rgba(0,0,0,0.35)",
          transition: "box-shadow 550ms ease",
        }}
      >
        <div
          style={{
            background: "var(--bg)",
            borderRadius: 11,
            padding: "26px 18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 12,
          }}
        >
          <Avatar name={m.name} photoUrl={m.photo_url} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{m.name}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              {m.role}
            </div>
            {m.github && (
              <a
                href={`https://github.com/${m.github}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12.5,
                  color: "var(--add)",
                  textDecoration: "none",
                }}
              >
                @{m.github}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const [team, setTeam] = useState(FALLBACK_TEAM);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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
        setIndex(0);
      }
    }

    fetchTeam();
    return () => {
      ignore = true;
    };
  }, []);

  function handleNext() {
    setIndex((i) => (i + 1) % team.length);
  }

  useEffect(() => {
    if (team.length < 2) return;
    const id = setInterval(() => {
      if (!paused) handleNext();
    }, AUTO_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, team.length]);

  return (
    <section
      id="team"
      className="section"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "min(620px, 75vh)",
      }}
    >
      <div
        className="wrap"
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        <p className="eyebrow">team</p>
        <h2 className="section-title">Who's maintaining this club</h2>

        {/* spacer pushes the carousel + dots toward the bottom of the section */}
        <div style={{ flex: 1 }} />

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            position: "relative",
            height: CARD_H,
            perspective: 1400,
          }}
        >
          {team.map((m, i) => (
            <MemberCard key={m.id} m={m} offset={i - index} />
          ))}
        </div>

        {team.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginTop: 28,
              marginBottom: 8,
            }}
          >
            {team.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${team[i].name}`}
                style={{
                  width: i === index ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  border: "none",
                  padding: 0,
                  background: "var(--ink)",
                  opacity: i === index ? 1 : 0.3,
                  cursor: "pointer",
                  transition: "opacity 200ms, width 200ms",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}