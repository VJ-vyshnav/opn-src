# Open Source Club — website

Minimal, git-log-themed site for a college open source club. Static React
front-end (Vite), Supabase for data (events, projects, team) and the
"join club" form.

## Structure

```
src/
  supabaseClient.js      Supabase client (reads env vars)
  App.jsx                Page assembly
  index.css               Design tokens + global styles
  components/
    Navbar.jsx
    Hero.jsx
    About.jsx
    EventsTimeline.jsx    reads `events` table
    Projects.jsx          reads `projects` table
    Team.jsx              reads `members` table
    JoinForm.jsx           writes to `membership_requests` table
    Footer.jsx
supabase/
  schema.sql              run this in the Supabase SQL editor
```

Every data component ships with fallback sample data, so the site looks
complete even before Supabase is wired up — swap it out whenever you're ready.

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create a Supabase project** at supabase.com (free tier is enough).

3. **Run the schema** — open the SQL editor in your Supabase project and
   run the contents of `supabase/schema.sql`. This creates the four tables
   and row-level security policies, and seeds sample events/projects/team.

4. **Set environment variables** — copy `.env.example` to `.env` and fill
   in your project URL and anon key (Project Settings → API):
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

5. **Run locally**
   ```
   npm run dev
   ```

6. **Build for production** (fully static output in `dist/`)
   ```
   npm run build
   ```
   Deploy `dist/` to Vercel, Netlify, GitHub Pages, or Supabase's own
   static hosting — anywhere that serves static files works, since the
   backend is entirely Supabase's hosted API.

## Notes

- The anon key is safe to expose in client code — access is controlled
  by the row-level security policies in `schema.sql`, not by hiding the key.
- `membership_requests` is insert-only for the public: anyone can submit
  the join form, but only authenticated (admin) users can read submissions.
  Read them from the Supabase Table Editor while logged in as the project owner.
- To add real events/projects/team members, edit rows directly in the
  Supabase Table Editor — no redeploy needed, the site fetches live.
