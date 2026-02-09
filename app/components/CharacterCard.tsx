"use client";

import { useCallback, useMemo } from "react";
import CardTypeCounter from "./CardTypeCounter";

/** 複製卡片：第 1、2 次 0 分，第 3、4 次各 40 分（上限 4 次） */
const COPY_CARD_POINTS = [0, 0, 40, 40];

const CARD_CONFIG = [
  { label: "刪階初始卡片", max: 5, points: (c: number) => Math.min(c, 5) * 20 },
  {
    label: "複製卡片",
    max: 4,
    points: (c: number) =>
      COPY_CARD_POINTS.slice(0, Math.min(c, 4)).reduce((a, b) => a + b, 0),
  },
  { label: "神閃卡片", max: undefined, points: (c: number) => c * 20 },
  { label: "中立卡片", max: undefined, points: (c: number) => c * 20 },
  { label: "裝備重鑄", max: undefined, points: (c: number) => c * 10 },
  { label: "普通怪物卡", max: undefined, points: (c: number) => c * 20 },
  { label: "稀有怪物卡", max: undefined, points: (c: number) => c * 50 },
  { label: "傳說怪物卡", max: undefined, points: (c: number) => c * 80 },
] as const;

const CARD_TYPES = CARD_CONFIG.map((x) => x.label);

export interface CharacterCardState {
  counts: number[];
}

const initialCounts = () => CARD_CONFIG.map(() => 0);

interface CharacterCardProps {
  characterIndex: number;
  maxPoints: number;
  onReset: () => void;
  counts: number[];
  onCountsChange: (counts: number[]) => void;
}

export default function CharacterCard({
  characterIndex,
  maxPoints,
  onReset,
  counts,
  onCountsChange,
}: CharacterCardProps) {
  const total = useMemo(
    () =>
      CARD_CONFIG.reduce(
        (sum, config, index) => sum + config.points(counts[index] ?? 0),
        0
      ),
    [counts]
  );
  const remaining = maxPoints - total;
  const isOverLimit = remaining < 0;

  const setCount = useCallback(
    (index: number, value: number) => {
      const config = CARD_CONFIG[index];
      const capped = config?.max != null ? Math.min(value, config.max) : value;
      const next = [...counts];
      next[index] = Math.max(0, capped);
      onCountsChange(next);
    },
    [counts, onCountsChange]
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-zinc-800/90 p-4 shadow-lg">
      {/* 標題列：角色名 + 重置按鈕 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">角色 {characterIndex}</h2>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-full bg-amber-600/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-amber-500"
        >
          <span aria-hidden>↻</span>
          重置
        </button>
      </div>

      <hr className="border-zinc-600" />

      {/* 清晰/模糊 (當前pt/上限) */}
      <div
        className={`flex items-center justify-center rounded-xl px-4 py-3 ${
          isOverLimit ? "bg-red-900/60 text-red-100" : "bg-zinc-700/80 text-zinc-300"
        }`}
      >
        <span className="text-sm">
          {isOverLimit ? "模糊" : "清晰"}
          <strong className="ml-1 text-lg font-bold text-white">
            ({total}/{maxPoints})
          </strong>
        </span>
      </div>

      {/* 卡片類型計數器網格 5x2 */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {CARD_CONFIG.map((config, index) => (
          <CardTypeCounter
            key={config.label}
            label={config.label}
            max={config.max}
            value={counts[index] ?? 0}
            onDecrement={() => setCount(index, Math.max(0, (counts[index] ?? 0) - 1))}
            onIncrement={() => setCount(index, (counts[index] ?? 0) + 1)}
            onChange={(value) => setCount(index, value)}
          />
        ))}
      </div>
    </div>
  );
}

export { CARD_TYPES, initialCounts };
