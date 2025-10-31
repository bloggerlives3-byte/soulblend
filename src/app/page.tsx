"use client";

import Link from "next/link";
import { useMemo } from "react";

const heroWords = [
  "Upload your vocals",
  "Blend in velvet loops",
  "Export a soulful mix"
];

export default function LandingPage() {
  const rotatingWords = useMemo(() => heroWords.join(" · "), []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-12 inline-flex items-center rounded-full border border-plum-500/60 bg-vinyl-700/50 px-4 py-2 text-sm text-gold-300 shadow-lg shadow-plum-900/40">
        <span className="font-semibold uppercase tracking-[0.2em] text-gold-500">SoulBlend MVP</span>
      </div>

      <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-tight text-gold-300 sm:text-6xl">
        Layer your sound with neo-soul textures in minutes.
      </h1>

      <p className="mt-8 max-w-2xl text-lg text-plum-300/90">
        Bring in up to two of your own tracks, sprinkle in curated loops, dial in the mood, and export a finished blend. No logins, no fuss — just vibes.
      </p>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/mix"
          className="rounded-full bg-gold-500 px-10 py-3 text-base font-semibold text-vinyl-900 transition hover:bg-gold-300"
        >
          Let&apos;s blend
        </Link>
        <a
          href="#how-it-works"
          className="rounded-full border border-plum-500 px-10 py-3 text-base font-semibold text-gold-300 transition hover:border-gold-300"
        >
          How it works
        </a>
      </div>

      <section
        id="how-it-works"
        className="mt-20 w-full max-w-4xl rounded-3xl border border-plum-700/60 bg-vinyl-700/30 p-10 text-left backdrop-blur-md"
      >
        <h2 className="text-2xl font-semibold text-gold-300">The blend in 3 steps</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {heroWords.map((item, index) => (
            <li key={item} className="rounded-2xl border border-plum-700/50 bg-vinyl-900/70 p-5">
              <div className="text-sm uppercase tracking-wider text-plum-300/80">Step {index + 1}</div>
              <p className="mt-3 text-lg font-medium text-gold-300">{item}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-2xl border border-plum-700/40 bg-plum-900/40 p-6 text-sm text-plum-200/90">
          <p className="font-semibold text-gold-300">What&apos;s inside:</p>
          <p className="mt-2">
            Two-track upload, curated loop shelf, live mixer with volume &amp; mute, real-time preview, and one-click export to WAV or MP3.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-plum-400/60">{rotatingWords}</p>
        </div>
      </section>
    </main>
  );
}
