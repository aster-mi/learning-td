import { useState, useRef, useCallback } from "react";
import {
  GACHA_POOL_UNITS,
  RARITY_INFO,
  SERIES_LIST,
  type UnitCatalogEntry,
  type Rarity,
} from "../data/unitCatalog";
import { UnitIcon } from "./UnitIcon";
import { sfxGachaRoll, sfxGachaReveal } from "../audio/SoundManager";

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

const BUFF_TAB_KEY = "__buff__";
const SERIES_COST = 100;
const BUFF_COST = 80;

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
  if (available.length === 0) return { type: "coins", coins: 50, rarity: "common" };
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

type SelectorOption = {
  key: string;
  label: string;
  cost: number;
};

export function GachaModal({ coins, ownedUnitIds, onPull, onClose, isMobile }: Props) {
  const seriesOptions: SelectorOption[] = SERIES_LIST.map((series) => ({
    key: series,
    label: series,
    cost: SERIES_COST,
  }));

  const allOptions: SelectorOption[] = [
    ...seriesOptions,
    { key: BUFF_TAB_KEY, label: "バフガチャ", cost: BUFF_COST },
  ];

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "rolling" | "reveal">("idle");
  const [reward, setReward] = useState<GachaReward | null>(null);
  const [rollEmoji, setRollEmoji] = useState("🎁");
  const [rollingUnit, setRollingUnit] = useState<UnitCatalogEntry | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isBuff = activeTab === BUFF_TAB_KEY;
  const hasSelection = activeTab !== null;
  const cost = isBuff ? BUFF_COST : SERIES_COST;
  const seriesPool = !hasSelection || isBuff ? [] : GACHA_POOL_UNITS.filter((u) => u.series === activeTab);
  const seriesOwned = isBuff ? 0 : seriesPool.filter((u) => ownedUnitIds.includes(u.id)).length;
  const allOwned = !isBuff && seriesPool.length > 0 && seriesOwned === seriesPool.length;
  const canPull = hasSelection && coins >= cost && !allOwned && (isBuff || seriesPool.length > 0);

  const doPull = useCallback(() => {
    if (!canPull || phase === "rolling") return;
    setPhase("rolling");
    setReward(null);

    const result = isBuff ? rollBuffGacha() : rollSeriesGacha(activeTab, ownedUnitIds);
    const unitSource = isBuff ? [] : seriesPool;
    const emojiSource = isBuff ? BUFF_POOL.map((b) => b.emoji) : [];
    if ((isBuff && emojiSource.length === 0) || (!isBuff && unitSource.length === 0)) {
      setPhase("idle");
      return;
    }

    let count = 0;
    const maxRolls = 15 + Math.floor(Math.random() * 8);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (isBuff) {
        const idx = Math.floor(Math.random() * emojiSource.length);
        setRollEmoji(emojiSource[idx]);
      } else {
        const idx = Math.floor(Math.random() * unitSource.length);
        setRollingUnit(unitSource[idx]);
      }
      sfxGachaRoll();
      count++;
      if (count >= maxRolls) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRollingUnit(null);
        setReward(result);
        onPull(result, cost);
        sfxGachaReveal();
        setTimeout(() => setPhase("reveal"), 200);
      }
    }, 80);
  }, [activeTab, canPull, cost, isBuff, onPull, ownedUnitIds, phase, seriesPool]);

  const handleTabChange = (key: string) => {
    if (phase === "rolling") return;
    setActiveTab(key);
    setPhase("idle");
    setReward(null);
    setRollingUnit(null);
  };

  const closePullModal = () => {
    if (phase === "rolling") return;
    setActiveTab(null);
    setPhase("idle");
    setReward(null);
    setRollingUnit(null);
  };

  const isRevealed = phase === "reveal" && reward != null;
  const rInfo = reward ? RARITY_INFO[reward.rarity] : RARITY_INFO.common;

  let displayEmoji = rollEmoji;
  if (isRevealed && reward) {
    if (reward.type === "unit" && reward.unitEntry) displayEmoji = reward.unitEntry.emoji;
    else if (reward.type === "buff") {
      const bd = BUFF_POOL.find((b) => b.buffType === reward.buffType);
      displayEmoji = bd?.emoji ?? "⚡";
    } else displayEmoji = "💰";
  }

  const cardW = isMobile ? 320 : 420;
  const selectorCols = isMobile ? 2 : 3;

  return (
    <div role="dialog" aria-label="ガチャ" style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column", alignItems: "center",
      zIndex: 200, overflow: "hidden",
    }}>
      <div style={{
        width: "100%", maxWidth: cardW + 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px 8px",
      }}>
        <div style={{ fontSize: 22, fontWeight: "bold", color: "#e2e8f0", letterSpacing: 1 }}>
          🎰 ガチャ
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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

      <div style={{
        width: "100%", maxWidth: cardW + 64,
        padding: "6px 20px 10px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${selectorCols}, minmax(0, 1fr))`,
          gap: 8,
        }}>
          {allOptions.map((opt) => {
            const active = activeTab === opt.key;
            const isOptBuff = opt.key === BUFF_TAB_KEY;
            const optPool = isOptBuff ? [] : GACHA_POOL_UNITS.filter((u) => u.series === opt.key);
            const optOwned = isOptBuff ? 0 : optPool.filter((u) => ownedUnitIds.includes(u.id)).length;
            const subtitle = isOptBuff
              ? `1回 ${opt.cost}コイン`
              : `${optOwned}/${optPool.length} 所持`;
            return (
              <button
                key={opt.key}
                onClick={() => handleTabChange(opt.key)}
                style={{
                  borderRadius: 12,
                  padding: "10px 10px",
                  background: active
                    ? (isOptBuff ? "rgba(234,179,8,0.25)" : "rgba(99,102,241,0.25)")
                    : "rgba(255,255,255,0.05)",
                  border: active
                    ? (isOptBuff ? "1px solid #eab308" : "1px solid #818cf8")
                    : "1px solid #334155",
                  color: active ? "#e2e8f0" : "#94a3b8",
                  textAlign: "left",
                  cursor: phase === "rolling" ? "default" : "pointer",
                  transition: "all 0.2s",
                  minHeight: 72,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isOptBuff ? (
                    <span style={{ fontSize: 22, lineHeight: 1 }}>⚡</span>
                  ) : optPool[0] ? (
                    <UnitIcon
                      unitId={optPool[0].id}
                      color={optPool[0].color}
                      size={24}
                      emoji={optPool[0].emoji}
                    />
                  ) : (
                    <span style={{ fontSize: 22, lineHeight: 1 }}>?</span>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>{subtitle}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        flex: 1,
        width: "100%",
        maxWidth: cardW + 64,
        padding: "0 20px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          color: "#64748b",
          fontSize: 14,
          textAlign: "center",
          padding: "24px 20px",
        }}>
          上のガチャ種類を選ぶと、回すためのモーダルが開きます
        </div>
      </div>

      {hasSelection && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(2,6,23,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 220,
        }}>
        <div style={{
          width: cardW, maxWidth: "100%", padding: "28px 24px",
          background: isRevealed ? rInfo.bg : "#0f172a",
          border: `3px solid ${isRevealed ? rInfo.border : "#1e293b"}`,
          borderRadius: 16, textAlign: "center",
          boxShadow: isRevealed ? `0 0 50px ${rInfo.glow}` : "0 18px 54px rgba(0,0,0,0.55)",
          transition: "all 0.5s ease",
          transform: isRevealed ? "scale(1)" : "scale(0.98)",
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            gap: 12,
          }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 18, fontWeight: "bold", color: "#e2e8f0" }}>
                {isBuff ? "バフガチャ" : `${activeTab} ガチャ`}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {isBuff ? `1回 ${BUFF_COST} コイン` : `1回 ${SERIES_COST} コイン`}
              </div>
            </div>
            <button onClick={closePullModal} style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid #475569",
              borderRadius: 8,
              color: "#94a3b8",
              fontSize: 18,
              width: 36,
              height: 36,
              cursor: phase === "rolling" ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>✕</button>
          </div>
          {phase === "idle" && !isBuff && (
            <div>
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {seriesPool[0] ? (
                  <UnitIcon
                    unitId={seriesPool[0].id}
                    color={seriesPool[0].color}
                    size={64}
                    emoji={seriesPool[0].emoji}
                  />
                ) : (
                  "?"
                )}
              </div>
              <div style={{ fontSize: 19, fontWeight: "bold", color: "#e2e8f0", marginBottom: 4 }}>
                {activeTab} シリーズ
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
                所持: {seriesOwned} / {seriesPool.length} ユニット
              </div>
              {allOwned ? (
                <div style={{
                  fontSize: 16, fontWeight: "bold", color: "#fbbf24",
                  background: "rgba(251,191,36,0.1)", borderRadius: 10, padding: "12px 20px",
                  border: "1px solid rgba(251,191,36,0.3)",
                }}>
                  このシリーズは全て所持済みです
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                    1回 💰 {SERIES_COST} コイン
                  </div>
                  <button onClick={doPull} disabled={!canPull} style={{
                    padding: "14px 36px", borderRadius: 12,
                    background: canPull ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#334155",
                    color: canPull ? "#fff" : "#64748b",
                    border: "none", fontWeight: "bold", fontSize: 17,
                    cursor: canPull ? "pointer" : "default",
                    boxShadow: canPull ? "0 4px 20px rgba(99,102,241,0.4)" : "none",
                    transition: "all 0.2s",
                  }}>
                    ガチャを回す
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
                ステージ開始時に使えるバフを引けます
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                1回 💰 {BUFF_COST} コイン
              </div>
              <button onClick={doPull} disabled={coins < BUFF_COST} style={{
                padding: "14px 36px", borderRadius: 12,
                background: coins >= BUFF_COST ? "linear-gradient(135deg, #eab308, #f59e0b)" : "#334155",
                color: coins >= BUFF_COST ? "#1a1a2e" : "#64748b",
                border: "none", fontWeight: "bold", fontSize: 17,
                cursor: coins >= BUFF_COST ? "pointer" : "default",
                boxShadow: coins >= BUFF_COST ? "0 4px 20px rgba(234,179,8,0.4)" : "none",
                transition: "all 0.2s",
              }}>
                ガチャを回す
              </button>
              {coins < BUFF_COST && (
                <div style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>
                  コインが足りません
                </div>
              )}
            </div>
          )}

          {phase === "rolling" && (
            <div>
              {isBuff ? (
                <div style={{
                  fontSize: 72, marginBottom: 10,
                  animation: "gachaSpin 0.1s linear infinite",
                }}>
                  {rollEmoji}
                </div>
              ) : (
                <div style={{
                  marginBottom: 10, display: "flex", justifyContent: "center",
                  animation: "gachaSpin 0.1s linear infinite",
                }}>
                  {rollingUnit ? (
                    <UnitIcon
                      unitId={rollingUnit.id}
                      color={rollingUnit.color}
                      size={84}
                      emoji={rollingUnit.emoji}
                    />
                  ) : (
                    <span style={{ fontSize: 72, lineHeight: 1 }}>?</span>
                  )}
                </div>
              )}
              <div style={{ fontSize: 16, color: "#64748b", animation: "pulse 1s infinite" }}>
                ガチャ中...
              </div>
            </div>
          )}

          {isRevealed && reward && (
            <div>
              <div style={{
                fontSize: 14, fontWeight: "bold", color: rInfo.color,
                marginBottom: 6, animation: "gachaPop 0.5s ease",
              }}>
                {rInfo.stars} {rInfo.label}
              </div>
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

              {reward.type === "unit" && reward.unitEntry && (
                <div style={{
                  display: "inline-block", fontSize: 11, fontWeight: "bold",
                  color: rInfo.color, background: `${rInfo.color}22`,
                  border: `1px solid ${rInfo.color}44`, borderRadius: 6,
                  padding: "2px 10px", marginBottom: 10,
                  animation: "gachaPop 0.5s ease",
                }}>
                  {reward.unitEntry.series} シリーズ
                </div>
              )}

              {reward.type === "buff" && (
                <div style={{
                  fontSize: 14, color: rInfo.color, marginBottom: 10,
                  animation: "gachaPop 0.5s ease",
                }}>
                  {reward.buffDesc}
                </div>
              )}

              {reward.type === "coins" && (
                <div style={{
                  fontSize: 13, color: "#fbbf24", marginTop: 4, marginBottom: 10,
                  animation: "gachaPop 0.5s ease",
                }}>
                  重複分はコインで還元されました
                </div>
              )}

              {reward.type === "unit" && reward.unitEntry && (() => {
                const u = reward.unitEntry;
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

              <div style={{
                display: "flex", gap: 10, justifyContent: "center",
                marginTop: 20, animation: "gachaPop 0.7s ease",
              }}>
                {coins >= cost && !allOwned && (
                  <button onClick={doPull} style={{
                    padding: "12px 24px", borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid #475569", color: "#e2e8f0",
                    fontWeight: "bold", fontSize: 14, cursor: "pointer",
                  }}>
                    もう一度回す
                  </button>
                )}
                <button onClick={closePullModal} style={{
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
      )}

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
