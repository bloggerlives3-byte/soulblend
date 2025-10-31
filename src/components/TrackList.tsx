"use client";

import { useMixerContext } from "@/components/MixerProvider";

const formatDuration = (duration?: number) => {
  if (!duration || Number.isNaN(duration)) return "--";
  const totalSeconds = Math.floor(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const TrackList = () => {
  const { tracks, setVolume, setPan, toggleMute, removeTrack } = useMixerContext();

  if (!tracks.length) {
    return (
      <div className="rounded-3xl border border-dashed border-plum-700/60 bg-vinyl-900/40 p-10 text-center text-plum-300/70">
        Drop in a loop or upload your track to start blending.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="rounded-3xl border border-plum-700/60 bg-vinyl-900/60 p-6 shadow-lg shadow-plum-900/30"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-plum-400/80">{track.source === "upload" ? "Upload" : "Loop"}</div>
              <div className="text-lg font-semibold text-gold-300">{track.name}</div>
              <div className="text-xs text-plum-300/60">{formatDuration(track.duration)}</div>
              {track.status !== "ready" && (
                <div className="mt-2 text-xs text-plum-300/60">{track.status === "loading" ? "Loading…" : "Error"}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeTrack(track.id)}
              className="rounded-full border border-plum-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-plum-200/80 transition hover:border-gold-500 hover:text-gold-300"
            >
              Remove
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-widest text-plum-300/70">
              Volume
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={track.gain}
                onChange={(event) => setVolume(track.id, Number(event.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-plum-700"
              />
            </label>

            <label className="flex flex-col gap-2 text-xs uppercase tracking-widest text-plum-300/70">
              Pan
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                value={track.pan}
                onChange={(event) => setPan(track.id, Number(event.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-plum-700"
              />
            </label>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => toggleMute(track.id)}
                className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                  track.muted ? "bg-vinyl-900/80 border border-gold-500 text-gold-300" : "bg-gold-500 text-vinyl-900"
                }`}
              >
                {track.muted ? "Unmute" : "Mute"}
              </button>
              <div className="rounded-full border border-plum-700/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-plum-300/70">
                {Math.round(track.gain * 100)}%
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
