"use client";

import { useMixerContext } from "@/components/MixerProvider";
import { useRouter } from "next/navigation";

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to convert blob to data URL"));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });

export const ExportPanel = () => {
  const router = useRouter();
  const { exportMix, isExporting, tracks } = useMixerContext();

  const handleExport = async (format: "wav" | "mp3") => {
    const blob = await exportMix(format);
    if (!blob) return;

    const dataUrl = await blobToDataUrl(blob);
    const payload = {
      dataUrl,
      format,
      suggestedName: `soulblend-${new Date().toISOString().slice(0, 10)}.${format}`,
      tracks: tracks.map((track) => ({ name: track.name, source: track.source }))
    };

    sessionStorage.setItem("soulblend:last-export", JSON.stringify(payload));
    router.push("/export");
  };

  return (
    <div className="mt-8 rounded-3xl border border-gold-500/40 bg-vinyl-900/70 p-6">
      <div className="text-sm uppercase tracking-[0.3em] text-gold-300/80">Export</div>
      <h3 className="mt-2 text-xl font-semibold text-gold-300">Take it for a spin</h3>
      <p className="mt-3 text-sm text-plum-200/70">
        We&apos;ll render everything you&apos;re hearing and get your download ready.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => handleExport("mp3")}
          disabled={isExporting}
          className="flex-1 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-vinyl-900 transition hover:bg-gold-300 disabled:cursor-progress disabled:opacity-60"
        >
          {isExporting ? "Blending…" : "Export MP3"}
        </button>
        <button
          type="button"
          onClick={() => handleExport("wav")}
          disabled={isExporting}
          className="flex-1 rounded-full border border-plum-600 px-6 py-3 text-sm font-semibold text-gold-300 transition hover:border-gold-300 disabled:cursor-progress disabled:opacity-60"
        >
          {isExporting ? "Blending…" : "Export WAV"}
        </button>
      </div>
    </div>
  );
};
