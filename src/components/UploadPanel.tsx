"use client";

import { ChangeEvent, useRef } from "react";
import { useMixerContext } from "@/components/MixerProvider";

export const UploadPanel = () => {
  const { addUpload } = useMixerContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];

    if (!/\.(mp3|wav)$/i.test(file.name)) {
      alert("Only MP3 and WAV files are supported.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("Each file must be 20MB or smaller.");
      return;
    }

    try {
      await addUpload(file);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while loading that file. Please try another or re-export it.");
    }
    event.target.value = "";
  };

  return (
    <div className="rounded-3xl border border-plum-700/60 bg-vinyl-700/30 p-6">
      <div className="text-sm uppercase tracking-[0.2em] text-plum-300/80">Upload</div>
      <h3 className="mt-2 text-xl font-semibold text-gold-300">Bring in your stems</h3>
      <p className="mt-3 text-sm text-plum-200/80">
        Add up to two MP3 or WAV files. They stay in your browser and never hit a server.
      </p>

      <button
        type="button"
        onClick={handlePick}
        className="mt-5 w-full rounded-full bg-gold-500 px-4 py-3 text-sm font-semibold text-vinyl-900 transition hover:bg-gold-300"
      >
        Upload your track
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="audio/mp3,audio/mpeg,audio/wav"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};
