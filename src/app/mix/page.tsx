"use client";

import Link from "next/link";
import { MixerProvider } from "@/components/MixerProvider";
import { UploadPanel } from "@/components/UploadPanel";
import { LoopShelf } from "@/components/LoopShelf";
import { TrackList } from "@/components/TrackList";
import { TransportControls } from "@/components/TransportControls";
import { ExportPanel } from "@/components/ExportPanel";

const MixWorkspace = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <Link href="/" className="text-sm uppercase tracking-[0.3em] text-plum-300/70">
            SoulBlend
          </Link>
          <h1 className="mt-3 text-4xl font-semibold text-gold-300">Mixing Workspace</h1>
          <p className="mt-2 text-sm text-plum-200/70">
            Layer your uploads and loops, tweak the vibe, then bounce it down.
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(280px,320px)_1fr]">
        <div className="space-y-6">
          <UploadPanel />
          <LoopShelf />
        </div>
        <div className="flex flex-col gap-6">
          <TrackList />
          <TransportControls />
          <ExportPanel />
        </div>
      </div>
    </div>
  );
};

export default function MixPage() {
  return (
    <MixerProvider>
      <MixWorkspace />
    </MixerProvider>
  );
}
