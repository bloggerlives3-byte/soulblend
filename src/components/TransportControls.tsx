"use client";

import { useMixerContext } from "@/components/MixerProvider";

export const TransportControls = () => {
  const { play, pause, stop, isPlaying, error } = useMixerContext();

  return (
    <div className="mt-8 rounded-3xl border border-plum-700/60 bg-vinyl-900/60 p-6">
      <div className="text-sm uppercase tracking-[0.3em] text-plum-300/70">Transport</div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={isPlaying ? pause : play}
          className="flex-1 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-vinyl-900 transition hover:bg-gold-300"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={stop}
          className="flex-1 rounded-full border border-plum-700 px-6 py-3 text-sm font-semibold text-gold-300 transition hover:border-gold-300"
        >
          Stop
        </button>
      </div>

      {error && <p className="mt-4 text-xs text-red-300/80">{error}</p>}
    </div>
  );
};
