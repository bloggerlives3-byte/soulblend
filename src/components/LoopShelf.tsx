"use client";

import { useLoopLibrary } from "@/hooks/useSupabaseLoops";
import { useMixerContext } from "@/components/MixerProvider";

export const LoopShelf = () => {
  const { loops, loading, error } = useLoopLibrary();
  const { addLoop } = useMixerContext();

  return (
    <div className="rounded-3xl border border-plum-700/60 bg-vinyl-700/30 p-6">
      <div className="text-sm uppercase tracking-[0.2em] text-plum-300/80">Loop Library</div>
      <h3 className="mt-2 text-xl font-semibold text-gold-300">Add some soul</h3>
      <p className="mt-3 text-sm text-plum-200/80">Choose a loop to drop it straight into your blend.</p>

      {loading && <p className="mt-4 text-sm text-plum-200/60">Loading loops…</p>}
      {error && (
        <p className="mt-4 text-xs text-plum-200/60">
          Couldn&apos;t reach Supabase. Showing local demo loops instead.
        </p>
      )}

      <div className="mt-6 grid gap-4">
        {loops.map((loop) => (
          <button
            key={loop.id}
            type="button"
            onClick={() => addLoop(loop)}
            className="w-full rounded-2xl border border-plum-700/40 bg-vinyl-900/60 p-4 text-left transition hover:border-gold-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gold-300">{loop.name}</span>
              <span className="text-xs uppercase tracking-widest text-plum-300/70">{loop.bpm ? `${loop.bpm} BPM` : "Texture"}</span>
            </div>
            <p className="mt-1 text-sm text-plum-200/70">{loop.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {loop.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-plum-900/40 px-2 py-1 text-[10px] uppercase tracking-widest text-plum-200/80">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
