import { useState, useRef, useCallback } from "react";
import {
  GACHA_POOL_UNITS,
  RARITY_INFO,
  type UnitCatalogEntry,
  type Rarity,
} from "../data/unitCatalog";
import { UnitIcon } from "./UnitIcon";

// ── Types ────────────────────────────────────────────────────────────────────

export type GachaReward = {
  type: "unit" | "buff" | "coins";
  unitEntry?: UnitCatalogEntry;
  buffType?: string;
  buffLabel?: string;
  buffDesc?: string;
  coins?: number;
  rarity: Rarity;
};

interface Props {
  coins: number;
  ownedUnitIds: string[];
  onPull: (reward: GachaReward, cost: number) => void;
  onClose: () => void;
  isMobile: boolean;
}

// ── Series tab definitions ───────────────────────────────────────────────────

const SERIES_TABS: { key: string; label: string; emoji: string }[] = [
  { key: "猫", label: "猫", emoji: "🐱" },
  { key: "文房具", label: "文房具", emoji: "✏️" },
  { key: "学校", label: "学校", emoji: "🏫" },
  { key: "科学", label: "科学", emoji: "🔬" },
  { key: "数学", label: "数学", emoji: "🧮" },
  { key: "芸術", label: "芸術", emoji: "🎨" },
];

const BUFF_TAB_KEY = "__buff__";

// ── Buff pool ────────────────────────────────────────────────────────────────

interface BuffDef {
  buffType: string;
  buffLabel: string;
  buffDesc: string;
  rarity: Rarity;
  emoji: string;
}

const BUFF_POOL: BuffDef[] = [
  { buffType: "energy_boost", buffLabel: "エネルギーブースト", buffDesc: "初期エネルギー+20", rarity: "common", emoji: "⚡" },
  { buffType: "energy_mega", buffLabel: "メガエネルギー", buffDesc: "初期エネルギー+40", rarity: "rare", emoji: "⚡" },
  { buffType: "combo_start", buffLabel: "コンボスタート", buffDesc: "コンボ3から開始", rarity: "rare", emoji: "🔥" },
  { buffType: "combo_mega", buffLabel: "メガコンボ", buffDesc: "コンボ5から開始", rarity: "epic", emoji: "💥" },
  { buffType: "shield", buffLabel: "シールド", buffDesc: "拠点HP+50", rarity: "common", emoji: "🛡️" },
  { buffType: "shield_mega", buffLabel: "鉄壁シールド", buffDesc: "拠点HP+100", rarity: "rare", emoji: "🏰" },
  { buffType: "atk_boost", buffLabel: "攻撃力ブースト", buffDesc: "全員ATK+20%", rarity: "epic", emoji: "⚔️" },
  { buffType: "coin_boost", buffLabel: "コインブースト", buffDesc: "報酬コイン2倍", rarity: "rare", emoji: "💰" },
];

// ── Rolling helpers ──────────────────────────────────────────────────────────

const RARITY_WEIGHTS: Record<Rarity, number> = { common: 40, rare: 25, epic: 12, legendary: 3 };

function weightedPick<T extends { rarity: Rarity }>(pool: T[]): T {
  const weights = pool.map((item) => RARITY_WEIGHTS[item.rarity]);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function rollSeriesGacha(series: string, ownedUnitIds: string[]): GachaReward {
  const pool = GACHA_POOL_UNITS.filter((u) => u.series === series);
  const available = pool.filter((u) => !ownedUnitIds.includes(u.id));

  if (available.length === 0) {
    // Duplicate safety: give coins back
    return { type: "coins", coins: 50, rarity: "common" };
  }

  const pick = weightedPick(available);
  return { type: "unit", unitEntry: pick, rarity: pick.rarity };
}

function rollBuffGacha(): GachaReward {
  const pick = weightedPick(BUFF_POOL);
  return {
    type: "buff",
    buffType: pick.buffType,
    buffLabel: pick.buffLabel,
    buffDesc: pick.buffDesc,
    rarity: pick.rarity,
  };
}

// ── Costs ────────────────────────────────────────────────────────────────────

const SERIES_COST = 100;
const BUFF_COST = 80;

// ── Component ────────────────────────────────────────────────────────────────

export function GachaModal({ coins, ownedUnitIds, onPull, onClose, isMobile }: Props) {
  const [activeTab, setActiveTab] = useState<string>(SERIES_TABS[0].key);
  const [phase, setPhase] = useState<"idle" | "rolling" | "reveal">("idle");
  const [reward, setReward] = useState<GachaReward | null>(null);
  const [rollEmoji, setRollEmoji] = useState("❓");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isBuff = activeTab === BUFF_TAB_KEY;
  const cost = isBuff ? BUFF_COST : SERIES_COST;

  // Series info
  const seriesPool = isBuff ? [] : GACHA_POOL_UNITS.filter((u) => u.series === activeTab);
  const seriesOwned = isBuff ? 0 : seriesPool.filter((u) => ownedUnitIds.includes(u.id)).length;
  const allOwned = !isBuff && seriesPool.length > 0 && seriesOwned === seriesPool.length;
  const canPull = coins >= cost && !allOwned;

  const doPull = useCallback(() => {
    if (!canPull || phase === "rolling") return;
    setPhase("rolling");
    setReward(null);

    const result = isBuff ? rollBuffGacha() : rollSeriesGacha(activeTab, ownedUnitIds);

    // Determine emojis for rolling animation
    const emojiSource = isBuff
      ? BUFF_POOL.map((b) => b.emoji)
      : seriesPool.map((u) => u.emoji);
    if (emojiSource.length === 0) return;

    let count = 0;
    const maxRolls = 15 + Math.floor(Math.random() * 8);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const idx = Math.floor(Math.random() * emojiSource.length);
      setRollEmoji(emojiSource[idx]);
      count++;
      if (count >= maxRolls) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setReward(result);
        onPull(result, cost);
        setTimeout(() => setPhase("reveal"), 200);
      }
    }, 80);
  }, [canPull, phase, isBuff, activeTab, ownedUnitIds, seriesPool, cost, onPull]);

  const handleTabChange = (key: string) => {
    if (phase === "rolling") return;
    setActiveTab(key);
    setPhase("idle");
    setReward(null);
  };

  const isRevealed = phase === "reveal" && reward != null;
  const rInfo = reward ? RARITY_INFO[reward.rarity] : RARITY_INFO.common;

  // Display emoji
  let displayEmoji = rollEmoji;
  if (isRevealed) {
    if (reward.type === "unit" && reward.unitEntry) displayEmoji = reward.unitEntry.emoji;
    else if (reward.type === "buff") {
      const bd = BUFF_POOL.find((b) => b.buffType === reward.buffType);
      displayEmoji = bd?.emoji ?? "⚡";
    } else displayEmoji = "💰";
  }

  const cardW = isMobile ? 300 : 380;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column", alignItems: "center",
      zIndex: 200, overflow: "hidden",
    }}>
      {/* ── Header ── */}
      <div style={{
        width: "100%", maxWidth: cardW + 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px 8px",
      }}>
        <div style={{ fontSize: 20, fontWeight: "bold", color: "#e2e8f0", letterSpacing: 2 }}>
          🎰 ガチャ
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            fontSize: 15, fontWeight: "bold", color: "#fbbf24",
            background: "rgba(251,191,36,0.12)", borderRadius: 8, padding: "4px 12px",
            border: "1px solid rgba(251,191,36,0.3)",
          }}>
            💰 {coins}
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid #475569",
            borderRadius: 8, color: "#94a3b8", fontSize: 18, width: 36, height: 36,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        width: "100%", maxWidth: cardW + 40,
        overflowX: "auto", whiteSpace: "nowrap",
        padding: "6px 20px 10px",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}>
        <div style={{ display: "inline-flex", gap: 6 }}>
          {SERIES_TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => handleTabChange(tab.key)} style={{
                padding: "6px 14px", borderRadius: 8,
                background: active ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
                border: active ? "1px solid #818cf8" : "1px solid #334155",
                color: active ? "#a5b4fc" : "#94a3b8",
                fontWeight: active ? "bold" : "normal",
                fontSize: 13, cursor: phase === "rolling" ? "default" : "pointer",
                whiteSpace: "nowrap", transition: "all 0.2s",
              }}>
                {tab.emoji} {tab.label}
              </button>
            );
          })}
          <button onClick={() => handleTabChange(BUFF_TAB_KEY)} style={{
            padding: "6px 14px", borderRadius: 8,
            background: activeTab === BUFF_TAB_KEY ? "rgba(234,179,8,0.2)" : "rgba(255,255,255,0.05)",
            border: activeTab === BUFF_TAB_KEY ? "1px solid #eab308" : "1px solid #334155",
            color: activeTab === BUFF_TAB_KEY ? "#fde047" : "#94a3b8",
            fontWeight: activeTab === BUFF_TAB_KEY ? "bold" : "normal",
            fontSize: 13, cursor: phase === "rolling" ? "default" : "pointer",
            whiteSpace: "nowrap", transition: "all 0.2s",
          }}>
            ⚡ バフガチャ
          </button>
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        width: "100%", maxWidth: cardW + 40,
        padding: "0 20px 20px", overflow: "auto",
      }}>
        {/* Card */}
        <div style={{
          width: cardW, padding: "28px 24px",
          background: isRevealed ? rInfo.bg : "#0f172a",
          border: `3px solid ${isRevealed ? rInfo.border : "#1e293b"}`,
          borderRadius: 16, textAlign: "center",
          boxShadow: isRevealed ? `0 0 50px ${rInfo.glow}` : "0 4px 24px rgba(0,0,0,0.5)",
          transition: "all 0.5s ease",
          transform: isRevealed ? "scale(1)" : "scale(0.98)",
        }}>

          {/* ── IDLE phase ── */}
          {phase === "idle" && !isBuff && (
            <div>
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {SERIES_TABS.find((t) => t.key === activeTab)?.emoji}
              </div>
              <div style={{ fontSize: 18, fontWeight: "bold", color: "#e2e8f0", marginBottom: 4 }}>
                {activeTab}シリーズ
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
                獲得済み: {seriesOwned} / {seriesPool.length} ユニット
              </div>
              {allOwned ? (
                <div style={{
                  fontSize: 16, fontWeight: "bold", color: "#fbbf24",
                  background: "rgba(251,191,36,0.1)", borderRadius: 10, padding: "12px 20px",
                  border: "1px solid rgba(251,191,36,0.3)",
                }}>
                  全て獲得済み！
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                    1回 💰 {SERIES_COST} コイン
                  </div>
                  <button onClick={doPull} disabled={!canPull} style={{
                    padding: "14px 36px", borderRadius: 12,
                    background: canPull
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "#334155",
                    color: canPull ? "#fff" : "#64748b",
                    border: "none", fontWeight: "bold", fontSize: 17,
                    cursor: canPull ? "pointer" : "default",
                    boxShadow: canPull ? "0 4px 20px rgba(99,102,241,0.4)" : "none",
                    transition: "all 0.2s",
                  }}>
                    ガチャを回す！
                  </button>
                  {coins < SERIES_COST && (
                    <div style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>
                      コインが足りません
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {phase === "idle" && isBuff && (
            <div>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
              <div style={{ fontSize: 18, fontWeight: "bold", color: "#fde047", marginBottom: 4 }}>
                バフガチャ
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
                ステージ開始時に使えるバフを獲得！
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                1回 💰 {BUFF_COST} コイン
              </div>
              <button onClick={doPull} disabled={coins < BUFF_COST} style={{
                padding: "14px 36px", borderRadius: 12,
                background: coins >= BUFF_COST
                  ? "linear-gradient(135deg, #eab308, #f59e0b)"
                  : "#334155",
                color: coins >= BUFF_COST ? "#1a1a2e" : "#64748b",
                border: "none", fontWeight: "bold", fontSize: 17,
                cursor: coins >= BUFF_COST ? "pointer" : "default",
                boxShadow: coins >= BUFF_COST ? "0 4px 20px rgba(234,179,8,0.4)" : "none",
                transition: "all 0.2s",
              }}>
                ガチャを回す！
              </button>
              {coins < BUFF_COST && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>
                  コインが足りません
                </div>
              )}
            </div>
          )}

          {/* ── ROLLING phase ── */}
          {phase === "rolling" && (
            <div>
              <div style={{
                fontSize: 72, marginBottom: 10,
                animation: "gachaSpin 0.1s linear infinite",
              }}>
                {rollEmoji}
              </div>
              <div style={{
                fontSize: 16, color: "#64748b", animation: "pulse 1s infinite",
              }}>
                ガチャ中...
              </div>
            </div>
          )}

          {/* ── REVEAL phase ── */}
          {isRevealed && (
            <div>
              {/* Rarity label */}
              <div style={{
                fontSize: 14, fontWeight: "bold", color: rInfo.color,
                marginBottom: 6, animation: "gachaPop 0.5s ease",
              }}>
                {rInfo.stars} {rInfo.label}
              </div>

              {/* Icon */}
              <div style={{
                marginBottom: 10,
                animation: "gachaPop 0.5s ease",
                display: "flex", justifyContent: "center",
              }}>
                {reward.type === "unit" && reward.unitEntry ? (
                  <UnitIcon
                    unitId={reward.unitEntry.id}
                    color={reward.unitEntry.color}
                    size={80}
                    emoji={reward.unitEntry.emoji}
                  />
                ) : (
                  <span style={{ fontSize: 72, lineHeight: 1 }}>{displayEmoji}</span>
                )}
              </div>

              {/* Name */}
              <div style={{
                fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 4,
                animation: "gachaPop 0.5s ease",
              }}>
                {reward.type === "unit" && reward.unitEntry
                  ? reward.unitEntry.label
                  : reward.type === "buff"
                    ? reward.buffLabel
                    : `${reward.coins} コイン`}
              </div>

              {/* Unit series badge */}
              {reward.type === "unit" && reward.unitEntry && (
                <div style={{
                  display: "inline-block", fontSize: 11, fontWeight: "bold",
                  color: rInfo.color, background: `${rInfo.color}22`,
                  border: `1px solid ${rInfo.color}44`, borderRadius: 6,
                  padding: "2px 10px", marginBottom: 10,
                  animation: "gachaPop 0.5s ease",
                }}>
                  {reward.unitEntry.series}シリーズ
                </div>
              )}

              {/* Buff description */}
              {reward.type === "buff" && (
                <div style={{
                  fontSize: 14, color: rInfo.color, marginBottom: 10,
                  animation: "gachaPop 0.5s ease",
                }}>
                  {reward.buffDesc}
                </div>
              )}

              {/* Coins description */}
              {reward.type === "coins" && (
                <div style={{
                  fontSize: 13, color: "#fbbf24", marginTop: 4, marginBottom: 10,
                  animation: "gachaPop 0.5s ease",
                }}>
                  重複ユニット → コインに変換
                </div>
              )}

              {/* Unit stats grid */}
              {reward.type === "unit" && reward.unitEntry && (() => {
                const u = reward.unitEntry!;
                const stats = [
                  { key: "HP", val: u.hp },
                  { key: "ATK", val: u.atk },
                  { key: "SPD", val: u.speed },
                  { key: "RANGE", val: u.range },
                  { key: "COST", val: u.cost },
                ];
                return (
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 4, marginTop: 8, animation: "gachaPop 0.6s ease",
                  }}>
                    {stats.map((s) => (
                      <div key={s.key} style={{
                        background: "rgba(255,255,255,0.06)", borderRadius: 6,
                        padding: "4px 2px",
                      }}>
                        <div style={{ fontSize: 9, color: "#64748b", fontWeight: "bold" }}>{s.key}</div>
                        <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: "bold" }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Pull again / close buttons */}
              <div style={{
                display: "flex", gap: 10, justifyContent: "center",
                marginTop: 20, animation: "gachaPop 0.7s ease",
              }}>
                {coins >= cost && !allOwned && (
                  <button onClick={() => { setPhase("idle"); setReward(null); }} style={{
                    padding: "12px 24px", borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid #475569", color: "#e2e8f0",
                    fontWeight: "bold", fontSize: 14, cursor: "pointer",
                  }}>
                    もう一度回す
                  </button>
                )}
                <button onClick={onClose} style={{
                  padding: "12px 24px", borderRadius: 10,
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  border: "none", color: "#fff",
                  fontWeight: "bold", fontSize: 14, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
                }}>
                  閉じる
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes gachaSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes gachaPop {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
