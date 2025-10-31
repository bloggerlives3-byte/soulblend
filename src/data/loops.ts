export type LoopMeta = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  bpm: number;
  key?: string;
  file: string;
  supabasePath?: string;
};

export const localLoops: LoopMeta[] = [
  {
    id: "velvet-keys",
    name: "Velvet Keys",
    description: "Warm Rhodes chords with vinyl dust.",
    tags: ["keys", "warm"],
    bpm: 82,
    key: "Fmin",
    file: "/loops/velvet-keys.wav"
  },
  {
    id: "slow-burn-drums",
    name: "Slow Burn Drums",
    description: "Loose pocket drums with brushed snare.",
    tags: ["drums", "laid-back"],
    bpm: 82,
    file: "/loops/slow-burn-drums.wav"
  },
  {
    id: "moonlight-bass",
    name: "Moonlight Bass",
    description: "Rounded bass groove to hold the blend.",
    tags: ["bass", "groove"],
    bpm: 82,
    file: "/loops/moonlight-bass.wav"
  },
  {
    id: "dusty-vinyl",
    name: "Dusty Vinyl",
    description: "Gentle vinyl crackle for instant nostalgia.",
    tags: ["texture"],
    bpm: 0,
    file: "/loops/dusty-vinyl.wav"
  },
  {
    id: "aurora-pad",
    name: "Aurora Pad",
    description: "Airy pad that blooms beneath the mix.",
    tags: ["pad", "atmosphere"],
    bpm: 82,
    key: "Cmin",
    file: "/loops/aurora-pad.wav"
  }
];
