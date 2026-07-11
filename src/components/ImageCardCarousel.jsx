import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient.js";

// Shown until the bucket loads (or if it's empty/misconfigured), so the
// gallery never looks broken.
const FALLBACK_SLIDES = [
  { id: "1", src: "https://picsum.photos/seed/hacknight/640/420", caption: "Kickoff hacknight" },
  { id: "2", src: "https://picsum.photos/seed/gitworkshop/640/420", caption: "First PR workshop" },
  { id: "3", src: "https://picsum.photos/seed/maintainertalk/640/420", caption: "Maintainer talk" },
];

// Name of the Supabase Storage bucket to pull gallery images from.
// Create it in Dashboard > Storage, set it to Public, and upload photos there.
const BUCKET_NAME = "gallery";

// Turns a filename like "01-kickoff-hacknight.jpg" into a caption
// "Kickoff hacknight". Rename your files to control the captions, or
// swap this out for a captions table if you want more control.
function captionFromFilename(name) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/^\d+[-_.]?/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ImageCardCarousel({ intervalMs = 3500 }) {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    async function fetchSlides() {
      const { data: files, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list("", { sortBy: { column: "name", order: "asc" } });
        console.log("Fetched slides:", files, error);

      if (ignore || error || !files || files.length === 0) return;

      const withUrls = files
        .filter((f) => f.name && !f.name.startsWith(".")) // skip .emptyFolderPlaceholder etc.
        .map((f) => {
          const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(f.name);
          return {
            id: f.id || f.name,
            src: data.publicUrl,
            caption: captionFromFilename(f.name),
          };
        });

      if (withUrls.length > 0) {
        setSlides(withUrls);
        setActive(0);
      }
    }

    fetchSlides();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [paused, slides.length, intervalMs]);

  function offsetFor(index) {
    const n = slides.length;
    let diff = index - active;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    return diff;
  }

  return (
    <section className="section" style={{ overflow: "hidden" }}>
      <div className="wrap">
        <p className="eyebrow">gallery</p>
        <h2 className="section-title">Moments from the club</h2>
      </div>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position: "relative",
          height: 340,
          perspective: "1400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {slides.map((slide, i) => {
          const offset = offsetFor(i);
          const abs = Math.abs(offset);
          const isActive = offset === 0;

          // Cards fan out in 3D based on distance from the active card
          const translateX = offset * 190;
          const translateZ = isActive ? 0 : -160 * abs;
          const rotateY = offset * -35;
          const opacity = abs > 2 ? 0 : 1 - abs * 0.28;
          const zIndex = 10 - abs;

          return (
            <button
              key={slide.id}
              onClick={() => setActive(i)}
              aria-label={slide.caption || `Slide ${i + 1}`}
              style={{
                position: "absolute",
                width: 280,
                height: 320,
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--line)",
                background: "var(--surface)",
                padding: 0,
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 24px 48px -18px rgba(22,24,26,0.35)"
                  : "0 12px 24px -14px rgba(22,24,26,0.2)",
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease",
                pointerEvents: abs > 2 ? "none" : "auto",
              }}
            >
              <img
                src={slide.src}
                alt={slide.caption || ""}
                style={{ width: "100%", height: "80%", objectFit: "cover", display: "block" }}
                draggable={false}
              />
              {slide.caption && (
                <div
                  style={{
                    height: "20%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--ink)",
                    padding: "0 12px",
                    textAlign: "center",
                  }}
                >
                  {slide.caption}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: i === active ? "var(--add)" : "var(--line)",
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}