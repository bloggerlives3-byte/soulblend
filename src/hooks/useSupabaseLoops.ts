"use client";

import { useEffect, useState } from "react";
import type { LoopMeta } from "@/data/loops";
import { localLoops } from "@/data/loops";
import { getSupabaseClient } from "@/lib/supabaseClient";

type SupabaseLoopRow = {
  id: string;
  name: string;
  description?: string | null;
  tags?: string[] | null;
  bpm?: number | null;
  key?: string | null;
  storage_path: string;
};

export const useLoopLibrary = () => {
  const [loops, setLoops] = useState<LoopMeta[]>(localLoops);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setLoops(localLoops);
      return;
    }

    let cancelled = false;

    const fetchLoops = async () => {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from<SupabaseLoopRow>("loops")
        .select("id, name, description, tags, bpm, key, storage_path")
        .order("name");

      if (cancelled) return;

      if (supabaseError) {
        setError(supabaseError.message);
        setLoops(localLoops);
        setLoading(false);
        return;
      }

      if (!data?.length) {
        setLoops(localLoops);
        setLoading(false);
        return;
      }

      const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;

      const mapped: LoopMeta[] = await Promise.all(
        data.map(async (item) => {
          let fileUrl = item.storage_path;

          if (supabase && bucketName && item.storage_path && !item.storage_path.startsWith("http")) {
            const { data: signed } = supabase.storage.from(bucketName).getPublicUrl(item.storage_path);
            if (signed?.publicUrl) {
              fileUrl = signed.publicUrl;
            }
          }

          return {
            id: item.id,
            name: item.name,
            description: item.description ?? "",
            tags: item.tags ?? [],
            bpm: item.bpm ?? 0,
            key: item.key ?? undefined,
            file: fileUrl,
            supabasePath: item.storage_path
          } satisfies LoopMeta;
        })
      );

      setLoops(mapped);
      setLoading(false);
    };

    fetchLoops();

    return () => {
      cancelled = true;
    };
  }, []);

  return { loops, loading, error };
};
