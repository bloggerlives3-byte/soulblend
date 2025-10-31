# SoulBlend MVP

SoulBlend is a warm, browser-based mixer built with Next.js and Supabase. Upload up to two personal tracks, layer in curated neo-soul loops, preview your blend in real time, and export it as WAV or MP3 with a single click.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Provide environment variables** (optional – only needed if you want to sync loops from Supabase instead of using the bundled demo loops). Copy `.env.example` to `.env.local` and fill in your Supabase project details.
   ```bash
   cp .env.example .env.local
   ```

   | Variable | Purpose |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
   | `NEXT_PUBLIC_SUPABASE_BUCKET` | (Optional) Storage bucket that holds loop assets |

3. **Run the dev server**
   ```bash
   npm run dev
   ```

4. **Open the app** at [http://localhost:3000](http://localhost:3000).

## Core Flow

- **Landing page** introduces the product and links to the mixer.
- **Mixing workspace** lets you:
  - Upload two local audio files (MP3/WAV up to 20MB each).
  - Drop in loops from the curated shelf (served locally or via Supabase).
  - Adjust volume, mute/unmute, and pan for each track.
  - Control playback with play/pause/stop.
- **Export page** waits with a celebratory message and provides a direct download for MP3 or WAV exports. Audio stays client-side; exports happen in the browser using the Web Audio API and Tone.js.

## Supabase Integration

- By default, SoulBlend uses the bundled demo loops in `public/loops`.
- If Supabase credentials are present, the app will query a `loops` table with the shape:
  ```sql
  create table public.loops (
    id text primary key,
    name text not null,
    description text,
    tags text[] default '{}',
    bpm integer,
    key text,
    storage_path text not null
  );
  ```
- Host your loop files in Supabase Storage (public bucket) and populate `storage_path` with the signed or public URL returned by Supabase.

## Export Notes

- Exports default to a 30-second capture window or the duration of the longest loaded track (whichever is greater).
- WAV exports come directly from `Tone.Recorder`.
- MP3 exports use `lamejs` to encode the recorded WAV client-side and tag your file with `Created with SoulBlend` metadata.

## Tech Stack

- Next.js 14 + App Router
- Tailwind CSS for styling
- Tone.js for real-time audio routing and recording
- Supabase (optional) for loop metadata and storage links
- LameJS for MP3 encoding

## Testing Ideas

- Add Vitest/Jest suites for hooks once audio mocks are available.
- Wire up Playwright to smoke-test the core flow (upload → loop → export).

## Roadmap Thoughts

- Visual level meters per track
- Adjustable export length and tempo sync
- User accounts with saved blends via Supabase Auth
- Collaborative sessions with Supabase Realtime
# soulblend
