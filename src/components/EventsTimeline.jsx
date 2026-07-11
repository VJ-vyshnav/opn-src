import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

// Shown until Supabase is configured / table is empty, so the page
// never looks broken during setup.
const FALLBACK_EVENTS = [
  { id: "1", hash: "b7a91f", title: "Kickoff hacknight", event_date: "2026-08-14", location: "CS Lab 2" },
  { id: "2", hash: "e21b04", title: "Intro to git & your first PR", event_date: "2026-08-28", location: "Room 104" },
  { id: "3", hash: "a3f9c1", title: "Maintainer talk: scaling a solo project", event_date: "2026-09-11", location: "Online" },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsTimeline() {
  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("id, hash, title, event_date, location")
        .order("event_date", { ascending: true });

      if (ignore) return;

      if (error) {
        setError(error.message);
      } else if (data && data.length > 0) {
        setEvents(data);
      }
      setLoading(false);
    }

    fetchEvents();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section id="events" className="section">
      <div className="wrap">
        <p className="eyebrow">events</p>
        <h2 className="section-title">Upcoming sessions</h2>

        {error && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--del)", marginBottom: 20 }}>
            couldn't reach supabase — showing cached schedule
          </p>
        )}

        <div style={{ borderLeft: "1px solid var(--line)", marginLeft: 6 }}>
          {events.map((ev) => (
            <div
              key={ev.id}
              style={{
                position: "relative",
                paddingLeft: 28,
                paddingBottom: 32,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: -5,
                  top: 4,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "var(--add)",
                  border: "2px solid var(--bg)",
                }}
              />
              <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                <span className="hash">#{ev.hash || ev.id}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)" }}>
                  {formatDate(ev.event_date)}
                </span>
              </div>
              <h3 style={{ fontSize: 18, marginTop: 6, fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                {ev.title}
              </h3>
              {ev.location && (
                <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 14 }}>{ev.location}</p>
              )}
            </div>
          ))}
        </div>

        {loading && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)" }}>
            fetching latest schedule…
          </p>
        )}
      </div>
    </section>
  );
}
