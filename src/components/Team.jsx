import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

const FALLBACK_TEAM = [
  { id: "1", name: "Akshay Joseph", role: "President", linkedin: "aditirao", photo_url: null },
  { id: "2", name: "Shanima Shaji", role: "Vice President", linkedin: "kevinthomas", photo_url: null },
  { id: "3", name: "Harinarayan M R", role: "Technical Head", linkedin: "meeranair", photo_url: null },
  { id: "4", name: "Alphin D Thomas", role: "Program Chair", linkedin: "samgeorge", photo_url: null },
];

const CARD_W = 340;
const CARD_H = 420;
const STEP = 210;
const MAX_VISIBLE_OFFSET = 1;
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
        boxShadow:
          "0 0 0 4px var(--bg), 0 0 0 1px var(--line), 0 0 22px 3px color-mix(in srgb, var(--add) 40%, transparent)",
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

function MemberCard({ m, offset, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const absOffset = Math.abs(offset);
  const isActive = offset === 0;

  const translateX = offset * STEP;
  const translateZ = -absOffset * 110;
  const rotateY = Math.max(-45, Math.min(45, offset * -28));
  const baseScale = isActive ? 1 : 0.82;
  const scale = hovered ? baseScale * 1.04 : baseScale;
  const opacity = absOffset > MAX_VISIBLE_OFFSET ? 0 : isActive ? 1 : 0.55;
  const blur = isActive ? 0 : Math.min(absOffset * 3, 6);
  const zIndex = hovered ? 200 : 100 - absOffset;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        width: CARD_W,
        marginLeft: -CARD_W / 2,
        zIndex,
        opacity,
        filter: `blur(${blur}px)`,
        cursor: isActive ? "default" : "pointer",
        transform: `translateX(-50%) translateX(${translateX}px) translateZ(${translateZ}px) translateY(${hovered ? -6 : 0}px) rotateY(${rotateY}deg) scale(${scale}) translateX(50%)`,
        transformStyle: "preserve-3d",
        pointerEvents: absOffset > MAX_VISIBLE_OFFSET ? "none" : "auto",
        transition:
          "transform 320ms cubic-bezier(.22,1,.36,1), opacity 550ms ease, filter 550ms ease",
      }}
    >
      {/*
        Outer ring: only the selected (active) card gets the animated
        flowing-color border. It works by rotating an oversized conic
        gradient behind a slightly-inset inner box — the rotation itself
        is defined once in the <style> block below (class "flow-ring").
      */}
      <div
        className={isActive ? "flow-ring" : ""}
        style={{
          borderRadius: 16,
          padding: isActive ? 4 : 0, // reserves space for the flowing border ring
        }}
      >
        <div
          style={{
            borderRadius: 14,
            background: "var(--bg)",
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
            boxShadow: hovered
              ? "0 2px 4px rgba(22,24,26,0.08), 0 14px 28px -8px rgba(22,24,26,0.22)"
              : isActive
                ? "0 1px 2px rgba(22,24,26,0.06), 0 8px 20px -6px rgba(22,24,26,0.16)"
                : "0 1px 2px rgba(22,24,26,0.04), 0 6px 14px -6px rgba(22,24,26,0.10)",
            transition: "box-shadow 320ms ease",
          }}
        >
          <div style={{ height: 2, background: "var(--add)", opacity: 0.5 }} />
          <div
            style={{
              padding: "38px 24px 34px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 18,
            }}
          >
            <Avatar name={m.name} photoUrl={m.photo_url} size={124} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>{m.name}</div>
              <div
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  padding: "4px 14px",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: 11.5,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--add)",
                  background: "var(--add-bg)",
                  border: "1px solid color-mix(in srgb, var(--add) 35%, transparent)",
                  borderRadius: 20,
                }}
              >
                {m.role}
              </div>
              {m.linkedin && (
                <>
                  <div
                    style={{
                      width: 28,
                      height: 1,
                      background: "var(--line)",
                      margin: "14px auto 12px",
                    }}
                  />
                  <a
                    href={`https://www.linkedin.com/in/${m.linkedin_url}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12.5,
                      color: "var(--add)",
                      textDecoration: "none",
                    }}
                  >
                    @{m.linkedin}
                  </a>
                </>
              )}
            </div>
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
        .select("id, name, role, linkedin,linkedin_url, photo_url")
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
    <section id="team" className="section">
      <div className="wrap">
        <p className="eyebrow">team</p>
        <h2 className="section-title">Who's maintaining this club</h2>

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
            <MemberCard
              key={m.id}
              m={m}
              offset={i - index}
              onSelect={() => setIndex(i)}
            />
          ))}
        </div>

        {team.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
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

      {/* ===================== Flowing border animation ===================== */}
      {/*
        How it works: ".flow-ring" is a small square container (the padding
        set inline above reserves 2px around the card for it). Its ::before
        pseudo-element is a conic-gradient — think of it as a color wheel —
        made much larger than the container ("inset: -60%") so that when it
        rotates, a clean arc of color sweeps continuously around the edge
        instead of visibly resetting.  Only a thin sliver of that gradient
        is ever visible, because the actual card content sits on top of it
        (z-index: 1) with its own solid background, covering everything
        except the 2px ring of padding around it.

        Kept deliberately restrained for a professional look:
        - a single accent hue (var(--add)) fading to transparent, not a
          rainbow spin
        - a slow 6s rotation, not a flashy/fast spin
        - only applied to the active (selected) card, not all of them
      */}
      <style>{`
        @keyframes flow-rotate {
          to { transform: rotate(360deg); }
        }
        .flow-ring {
          position: relative;
          overflow: hidden;
        }
        .flow-ring::before {
          content: "";
          position: absolute;
          inset: -60%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            color-mix(in srgb, var(--add) 70%, transparent) 40deg,
            transparent 110deg,
            transparent 360deg
          );
          animation: flow-rotate 6s linear infinite;
        }
      `}</style>
    </section>
  );
}