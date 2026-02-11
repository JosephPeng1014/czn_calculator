"use client";

import { useCallback, useEffect, useState } from "react";
import CharacterCard, { initialCounts } from "./components/CharacterCard";

const STORAGE_KEY = "czn_calculator_state";
const COUNTS_LEN = initialCounts().length;

interface SavedState {
  tier: number;
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
    const validCounts = (arr: unknown): arr is number[] =>
      Array.isArray(arr) &&
      arr.length === COUNTS_LEN &&
      arr.every((x) => typeof x === "number" && Number.isInteger(x) && x >= 0);
    if (!validCounts(d.char1Counts) || !validCounts(d.char2Counts) || !validCounts(d.char3Counts))
      return null;
    return {
      tier,
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
  char1Counts: initialCounts(),
  char2Counts: initialCounts(),
  char3Counts: initialCounts(),
};

/** 僅在 client 掛載後才渲染，並用 lazy 初始值從 localStorage 讀取，第一次畫出就是正確數字、無載入態 */
function CalculatorContent() {
  const [state, setState] = useState<SavedState>(() => loadState() ?? defaultState);
  const { tier, char1Counts, char2Counts, char3Counts } = state;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / private mode
    }
  }, [state]);

  const maxPoints = getMaxPoints(tier);

  const setTier = useCallback((valueOrUpdater: number | ((t: number) => number)) => {
    setState((s) => ({
      ...s,
      tier: Math.max(
        1,
        typeof valueOrUpdater === "function" ? valueOrUpdater(s.tier) : valueOrUpdater
      ),
    }));
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

          {/* 控制列 */}
          <div className="mx-auto mt-8 rounded-2xl border border-zinc-600/60 bg-zinc-800/50 px-5 py-4 shadow-xl shadow-black/20 backdrop-blur sm:px-6">
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-4">
              {/* TIER */}
              <div className="flex min-w-0 flex-1 items-center justify-center gap-3 sm:justify-center">
                <span className="min-w-12 text-right text-sm font-medium text-zinc-500 sm:text-zinc-400">
                  TIER
                </span>
                <div className="inline-flex overflow-hidden rounded-xl border border-zinc-600 bg-zinc-900/90 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setTier((t) => Math.max(1, t - 1))}
                    className="flex h-10 w-10 items-center justify-center text-zinc-400 transition hover:bg-zinc-700/80 hover:text-white active:bg-zinc-700"
                    aria-label="TIER 減少"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={tier}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isNaN(v)) setTier(Math.min(15, Math.max(1, v)));
                      else setTier(1);
                    }}
                    className="h-10 w-12 border-0 border-x border-zinc-600/80 bg-transparent text-center text-base font-semibold tabular-nums text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTier((t) => Math.min(15, t + 1))}
                    className="flex h-10 w-10 items-center justify-center text-zinc-400 transition hover:bg-zinc-700/80 hover:text-white active:bg-zinc-700"
                    aria-label="TIER 增加"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 上限 pt */}
              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-700/50 px-4 py-2.5 sm:justify-center">
                <span className="text-sm text-zinc-500">上限</span>
                <span className="text-lg font-bold tabular-nums text-zinc-100">
                  {maxPoints}
                  <span className="ml-0.5 text-sm font-medium text-zinc-400">pt</span>
                </span>
              </div>

              {/* 全部重置 */}
              <div className="flex min-w-0 flex-1 items-center justify-center sm:justify-center">
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-600/90 px-2.5 py-1 text-sm font-medium text-white transition hover:border-amber-400/60 hover:bg-amber-500 active:bg-amber-600"
                >
                  <span aria-hidden className="text-base">↻</span>
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

/** 僅在 client 掛載後才渲染 CalculatorContent，搭配 lazy 初始值從 localStorage 讀取，重整時不閃預設值、不顯示載入態 */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  if (!mounted) {
    return <div className="min-h-screen from-slate-950 via-slate-900 to-slate-950" />;
  }
  return <CalculatorContent />;
}
