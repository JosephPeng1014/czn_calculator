"use client";

import { useCallback, useState } from "react";
import CharacterCard, { initialCounts } from "./components/CharacterCard";

function getMaxPoints(tier: number) {
  return tier * 10 + 20
}

export default function Home() {
  const [tier, setTier] = useState(1);
  const [char1Counts, setChar1Counts] = useState(initialCounts);
  const [char2Counts, setChar2Counts] = useState(initialCounts);
  const [char3Counts, setChar3Counts] = useState(initialCounts);

  const maxPoints = getMaxPoints(tier);

  const resetAll = useCallback(() => {
    setChar1Counts(initialCounts());
    setChar2Counts(initialCounts());
    setChar3Counts(initialCounts());
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            卡厄思計分模擬器
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">TIER</span>
              <div className="flex items-center gap-0 rounded-lg border border-zinc-600 bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setTier((t) => Math.max(1, t - 1))}
                  className="flex h-9 w-9 items-center justify-center text-zinc-300 hover:bg-zinc-700 hover:text-white"
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
                  className="flex h-9 w-9 items-center justify-center text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  aria-label="TIER 增加"
                >
                  +
                </button>
              </div>

              <span className="text-sm text-zinc-400">上限: {maxPoints} pt</span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
          >
            <span aria-hidden>↻</span>
            全部重置
          </button>
        </header>

        {/* 三張角色卡片 */}
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
