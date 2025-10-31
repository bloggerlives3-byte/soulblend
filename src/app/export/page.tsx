"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ExportPayload = {
  dataUrl: string;
  format: "wav" | "mp3";
  suggestedName: string;
  tracks: {
    name: string;
    source: "upload" | "loop";
  }[];
};

const useExportPayload = () => {
  const [payload, setPayload] = useState<ExportPayload | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("soulblend:last-export");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as ExportPayload;
      setPayload(parsed);
    } catch (error) {
      console.warn("Unable to parse export payload", error);
    }
  }, []);

  return payload;
};

export default function ExportPage() {
  const payload = useExportPayload();

  const handleDownload = () => {
    if (!payload) return;
    const link = document.createElement("a");
    link.href = payload.dataUrl;
    link.download = payload.suggestedName;
    link.click();
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16">
      <div className="text-sm uppercase tracking-[0.3em] text-plum-300/70">
        <Link href="/mix">Back to mix</Link>
      </div>
      <h1 className="mt-4 text-4xl font-semibold text-gold-300">Your soulful blend is ready. 🎶</h1>
      <p className="mt-4 text-sm text-plum-200/70">
        Download your mix and take it wherever you perform, share, or vibe.
      </p>

      {payload ? (
        <div className="mt-10 rounded-3xl border border-gold-500/40 bg-vinyl-900/70 p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-gold-300/80">Download</div>
          <div className="mt-3 text-lg font-semibold text-gold-300">{payload.suggestedName}</div>
          <button
            type="button"
            onClick={handleDownload}
            className="mt-6 w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-vinyl-900 transition hover:bg-gold-300"
          >
            Download {payload.format.toUpperCase()}
          </button>
          <ul className="mt-6 text-xs text-plum-200/70">
            {payload.tracks.map((track) => (
              <li key={`${track.source}-${track.name}`}>
                {track.name} <span className="text-plum-400/70">({track.source})</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-plum-700/60 bg-vinyl-900/40 p-8 text-sm text-plum-200/60">
          No export found. Head back to the mixer to bounce your blend.
        </div>
      )}
    </main>
  );
}
