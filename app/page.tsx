"use client";

import { useCallback, useEffect, useState } from "react";
import CharacterCard, { initialCounts } from "./components/CharacterCard";

const STORAGE_KEY = "czn_calculator_state";
const COUNTS_LEN = initialCounts().length;

interface SavedState {
  tier: number;
  nightmareMode: boolean;
  char1Counts: number[];
  char2Counts: number[];
  char3Counts: number[];
}

function loadState(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object") return null;
    const d = data as Record<string, unknown>;
    const tier = Number(d.tier);
    if (!Number.isInteger(tier) || tier < 1) return null;
    if (typeof d.nightmareMode !== "boolean") return null;
    const validCounts = (arr: unknown): arr is number[] =>
      Array.isArray(arr) &&
      arr.length === COUNTS_LEN &&
      arr.every((x) => typeof x === "number" && Number.isInteger(x) && x >= 0);
    if (!validCounts(d.char1Counts) || !validCounts(d.char2Counts) || !validCounts(d.char3Counts))
      return null;
    return {
      tier,
      nightmareMode: d.nightmareMode,
      char1Counts: d.char1Counts,
      char2Counts: d.char2Counts,
      char3Counts: d.char3Counts,
    };
  } catch {
    return null;
  }
}

function getMaxPoints(tier: number) {
  return tier * 10 + 20;
}

const defaultState: SavedState = {
  tier: 1,
  nightmareMode: false,
  char1Counts: initialCounts(),
  char2Counts: initialCounts(),
  char3Counts: initialCounts(),
};

export default function Home() {
  const [state, setState] = useState<SavedState>(defaultState);
  const { tier, nightmareMode, char1Counts, char2Counts, char3Counts } = state;

  // 從 localStorage 還原狀態（僅 client mount 時執行一次，非同步避免 linter 警告）
  useEffect(() => {
    const saved = loadState();
    if (saved) queueMicrotask(() => setState(saved));
  }, []);

  // 寫入 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / private mode
    }
  }, [state]);

  const effectiveTier = nightmareMode ? tier + 1 : tier;
  const maxPoints = getMaxPoints(effectiveTier);

  const setTier = useCallback((valueOrUpdater: number | ((t: number) => number)) => {
    setState((s) => ({
      ...s,
      tier: Math.max(
        1,
        typeof valueOrUpdater === "function" ? valueOrUpdater(s.tier) : valueOrUpdater
      ),
    }));
  }, []);
  const setNightmareMode = useCallback((fn: (v: boolean) => boolean) => {
    setState((s) => ({ ...s, nightmareMode: fn(s.nightmareMode) }));
  }, []);
  const setChar1Counts = useCallback((counts: number[] | (() => number[])) => {
    setState((s) => ({ ...s, char1Counts: typeof counts === "function" ? counts() : counts }));
  }, []);
  const setChar2Counts = useCallback((counts: number[] | (() => number[])) => {
    setState((s) => ({ ...s, char2Counts: typeof counts === "function" ? counts() : counts }));
  }, []);
  const setChar3Counts = useCallback((counts: number[] | (() => number[])) => {
    setState((s) => ({ ...s, char3Counts: typeof counts === "function" ? counts() : counts }));
  }, []);

  const resetAll = useCallback(() => {
    setState((s) => ({
      ...s,
      char1Counts: initialCounts(),
      char2Counts: initialCounts(),
      char3Counts: initialCounts(),
    }));
  }, []);

  return (
    <div className="min-h-screen from-slate-950 via-slate-900 to-slate-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 標題區 */}
        <header className="mb-10">
          <h1 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            卡厄思計分模擬器
          </h1>
          <div className="mx-auto mt-1 h-px w-16 bg-zinc-600" aria-hidden />

          {/* 控制列：單一圓角區塊 */}
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-zinc-600/80 bg-zinc-800/70 px-4 py-2 shadow-lg backdrop-blur sm:px-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              {/* 惡夢模式 */}
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <span className="text-sm font-medium text-zinc-300">惡夢模式</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={nightmareMode}
                  aria-label={nightmareMode ? "惡夢模式開啟" : "惡夢模式關閉"}
                  onClick={() => setNightmareMode((v) => !v)}
                  className={`relative h-6 w-11 shrink-0 rounded-full border border-zinc-600 transition-colors ${
                    nightmareMode ? "bg-amber-600" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
                      nightmareMode ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="hidden shrink-0 sm:block sm:h-8 sm:w-px sm:bg-zinc-600" aria-hidden />

              {/* TIER + 上限 */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-center">
                <span className="text-sm text-zinc-400">TIER</span>
                <div className="flex items-center gap-0 rounded-lg border border-zinc-600 bg-zinc-900/80">
                  <button
                    type="button"
                    onClick={() => setTier((t) => Math.max(1, t - 1))}
                    className="flex h-9 w-9 items-center justify-center text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                    aria-label="TIER 減少"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={tier}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isNaN(v)) setTier( Math.min(15, Math.max(1, v)))
                      else setTier(1);
                    }}
                    className="h-9 w-10 border-0 border-x border-zinc-600 bg-transparent text-center text-sm font-medium text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTier((t) => Math.min(15, t + 1))}
                    className="flex h-9 w-9 items-center justify-center text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                    aria-label="TIER 增加"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-zinc-400">
                  上限 <span className={nightmareMode ? "font-medium text-yellow-300" : "font-medium text-zinc-200"}>{maxPoints}</span> pt
                </span>
              </div>

              <div className="hidden shrink-0 sm:block sm:h-8 sm:w-px sm:bg-zinc-600" aria-hidden />

              {/* 全部重置 */}
              <div className="flex justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
                >
                  <span aria-hidden>↻</span>
                  全部重置
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 角色卡片區 */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CharacterCard
            characterIndex={1}
            maxPoints={maxPoints}
            counts={char1Counts}
            onCountsChange={setChar1Counts}
            onReset={() => setChar1Counts(initialCounts())}
          />
          <CharacterCard
            characterIndex={2}
            maxPoints={maxPoints}
            counts={char2Counts}
            onCountsChange={setChar2Counts}
            onReset={() => setChar2Counts(initialCounts())}
          />
          <CharacterCard
            characterIndex={3}
            maxPoints={maxPoints}
            counts={char3Counts}
            onCountsChange={setChar3Counts}
            onReset={() => setChar3Counts(initialCounts())}
          />
        </section>
      </div>
    </div>
  );
}
