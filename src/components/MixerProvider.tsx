"use client";

import { createContext, ReactNode, useContext } from "react";
import { useMixer } from "@/hooks/useMixer";

const MixerContext = createContext<ReturnType<typeof useMixer> | null>(null);

export const MixerProvider = ({ children }: { children: ReactNode }) => {
  const mixer = useMixer();
  return <MixerContext.Provider value={mixer}>{children}</MixerContext.Provider>;
};

export const useMixerContext = () => {
  const ctx = useContext(MixerContext);
  if (!ctx) {
    throw new Error("useMixerContext must be used within a MixerProvider");
  }
  return ctx;
};
