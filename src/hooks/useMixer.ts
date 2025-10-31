"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import type { LoopMeta } from "@/data/loops";
import { convertWavBlobToMp3, tagWavBlob } from "@/lib/audioExport";

export type MixerTrack = {
  id: string;
  name: string;
  source: "upload" | "loop";
  url: string;
  loop: boolean;
  gain: number;
  pan: number;
  muted: boolean;
  duration?: number;
  status: "loading" | "ready" | "error";
  fileName?: string;
};

const DEFAULT_GAIN = 0.8;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const useMixer = () => {
  const [tracks, setTracks] = useState<MixerTrack[]>([]);
  const tracksRef = useRef<MixerTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playersRef = useRef(new Map<string, Tone.Player>());
  const gainsRef = useRef(new Map<string, Tone.Gain>());
  const pansRef = useRef(new Map<string, Tone.Panner>());
  const masterRef = useRef<Tone.Gain | null>(null);
  const recorderRef = useRef<Tone.Recorder | null>(null);

  const ensureAudioGraph = useCallback(async () => {
    await Tone.start();

    if (!masterRef.current) {
      const master = new Tone.Gain(1);
      master.toDestination();

      const recorder = new Tone.Recorder();
      master.connect(recorder);

      masterRef.current = master;
      recorderRef.current = recorder;
    }
  }, []);

  const addTrackFromUrl = useCallback(
    async (options: {
      name: string;
      source: "upload" | "loop";
      url: string;
      loop?: boolean;
      fileName?: string;
    }) => {
      setError(null);

      try {
        await ensureAudioGraph();
      } catch (err) {
        setError("Unable to initialize audio context.");
        throw err;
      }

      const id = createId();
      const loop = options.loop ?? false;

      setTracks((prev) => [
        ...prev,
        {
          id,
          name: options.name,
          source: options.source,
          url: options.url,
          loop,
          gain: DEFAULT_GAIN,
          pan: 0,
          muted: false,
          status: "loading",
          fileName: options.fileName
        }
      ]);

      try {
        const player = new Tone.Player({ url: options.url, loop, autostart: false });
        const gainNode = new Tone.Gain(DEFAULT_GAIN);
        const panNode = new Tone.Panner(0);

        await player.load(options.url);

        player.connect(gainNode);
        gainNode.connect(panNode);

        const masterNode = masterRef.current;
        const recorderNode = recorderRef.current;

        if (!masterNode || !recorderNode) {
          throw new Error("Audio graph not ready");
        }

        panNode.connect(masterNode);

        player.sync().start(0);

        playersRef.current.set(id, player);
        gainsRef.current.set(id, gainNode);
        pansRef.current.set(id, panNode);

        const duration = player.buffer.duration;

        setTracks((prev) =>
          prev.map((track) =>
            track.id === id
              ? {
                  ...track,
                  duration,
                  status: "ready"
                }
              : track
          )
        );

        return id;
      } catch (err) {
        console.error(err);
        setTracks((prev) => prev.filter((track) => track.id !== id));
        setError("Failed to load track");
        throw err;
      }
    },
    [ensureAudioGraph]
  );

  const addLoop = useCallback(
    async (loopMeta: LoopMeta) => {
      return addTrackFromUrl({
        name: loopMeta.name,
        source: "loop",
        url: loopMeta.file,
        loop: true
      });
    },
    [addTrackFromUrl]
  );

  const addUpload = useCallback(
    async (file: File) => {
      const existingUploads = tracks.filter((track) => track.source === "upload");
      if (existingUploads.length >= 2) {
        setError("You can only upload two tracks in the MVP.");
        return null;
      }

      const objectUrl = URL.createObjectURL(file);

      try {
        const id = await addTrackFromUrl({
          name: file.name.replace(/\.[^/.]+$/, ""),
          source: "upload",
          url: objectUrl,
          loop: false,
          fileName: file.name
        });
        return id;
      } catch (err) {
      URL.revokeObjectURL(objectUrl);
      throw err;
    }
  },
  [addTrackFromUrl, tracks]
);

  const removeTrack = useCallback((id: string) => {
    const player = playersRef.current.get(id);
    const gain = gainsRef.current.get(id);
    const pan = pansRef.current.get(id);

    player?.unsync();
    player?.stop();
    player?.dispose();
    gain?.dispose();
    pan?.dispose();

    playersRef.current.delete(id);
    gainsRef.current.delete(id);
    pansRef.current.delete(id);

    setTracks((prev) => {
      const target = prev.find((track) => track.id === id);
      if (target?.source === "upload") {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((track) => track.id !== id);
    });
  }, []);

  const setVolume = useCallback((id: string, value: number) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === id
          ? {
              ...track,
              gain: value
            }
          : track
      )
    );

    const gain = gainsRef.current.get(id);
    if (gain) {
      gain.gain.value = value;
    }
  }, []);

  const setPan = useCallback((id: string, value: number) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === id
          ? {
              ...track,
              pan: value
            }
          : track
      )
    );

    const pan = pansRef.current.get(id);
    if (pan) {
      pan.pan.value = value;
    }
  }, []);

  const toggleMute = useCallback((id: string) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === id
          ? {
              ...track,
              muted: !track.muted
            }
          : track
      )
    );

    const player = playersRef.current.get(id);
    if (player) {
      player.mute = !player.mute;
    }
  }, []);

  const readyTracks = useMemo(() => tracks.filter((track) => track.status === "ready"), [tracks]);

  const play = useCallback(async () => {
    if (!readyTracks.length) {
      setError("Load or add a track before hitting play.");
      return;
    }

    await ensureAudioGraph();

    Tone.Transport.start();
    setIsPlaying(true);
  }, [ensureAudioGraph, readyTracks.length]);

  const pause = useCallback(() => {
    Tone.Transport.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    setIsPlaying(false);
  }, []);

  const exportMix = useCallback(
    async (format: "wav" | "mp3") => {
      if (!readyTracks.length) {
        setError("Nothing to export yet.");
        return null;
      }

      await ensureAudioGraph();

      const recorder = recorderRef.current;
      if (!recorder) {
        setError("Recorder not ready");
        return null;
      }

      const longestDuration = readyTracks.reduce((acc, track) => Math.max(acc, track.duration ?? 0), 0);
      // Default to 30s capture window if duration cannot be inferred.
      const exportDuration = Math.max(longestDuration || 0, 30);

      setIsExporting(true);

      try {
        Tone.Transport.stop();
        Tone.Transport.position = 0;

        recorder.start();
        Tone.Transport.start();

        await wait(exportDuration * 1000);

        Tone.Transport.stop();
        Tone.Transport.position = 0;

        const wavBlob = await recorder.stop();

        if (format === "wav") {
          const tagged = await tagWavBlob(wavBlob);
          setIsExporting(false);
          return tagged;
        }

        const mp3Blob = await convertWavBlobToMp3(wavBlob);
        setIsExporting(false);
        return mp3Blob;
      } catch (err) {
        console.error(err);
        setError("Export failed. Try again or download as WAV.");
        setIsExporting(false);
        return null;
      }
    },
    [ensureAudioGraph, readyTracks]
  );

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      playersRef.current.forEach((player) => player.dispose());
      gainsRef.current.forEach((gain) => gain.dispose());
      pansRef.current.forEach((pan) => pan.dispose());
      masterRef.current?.dispose();
      recorderRef.current?.dispose();
      tracksRef.current
        .filter((track) => track.source === "upload")
        .forEach((track) => URL.revokeObjectURL(track.url));
    };
  }, []);

  return {
    tracks,
    isPlaying,
    isExporting,
    error,
    addLoop,
    addUpload,
    removeTrack,
    setVolume,
    setPan,
    toggleMute,
    play,
    pause,
    stop,
    exportMix
  };
};
