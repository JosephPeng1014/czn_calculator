"use client";

import { useCallback, useState } from "react";
import CharacterCard, { initialCounts } from "./components/CharacterCard";

function getMaxPoints(tier: number) {
  return tier * 10 + 20
}

export default function Home() {
  const [tier, setTier] = useState(1);
  const [nightmareMode, setNightmareMode] = useState(false);
  const [char1Counts, setChar1Counts] = useState(initialCounts);
  const [char2Counts, setChar2Counts] = useState(initialCounts);
  const [char3Counts, setChar3Counts] = useState(initialCounts);

  const effectiveTier = nightmareMode ? tier + 1 : tier;
  const maxPoints = getMaxPoints(effectiveTier);

  const resetAll = useCallback(() => {
    setChar1Counts(initialCounts());
    setChar2Counts(initialCounts());
    setChar3Counts(initialCounts());
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
                      if (!Number.isNaN(v)) setTier(Math.max(1, v));
                    }}
                    className="h-9 w-10 border-0 border-x border-zinc-600 bg-transparent text-center text-sm font-medium text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setTier((t) => t + 1)}
                    className="flex h-9 w-9 items-center justify-center text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                    aria-label="TIER 增加"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-zinc-400">
                  上限 <span className="font-medium text-zinc-200">{maxPoints}</span> pt
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
