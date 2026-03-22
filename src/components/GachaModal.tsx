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

/** シリーズごとのビジュアルテーマ */
const SERIES_THEME: Record<string, {
  emoji: string; gradient: string; border: string;
  glow: string; accent: string; catchphrase: string;
}> = {
  "猫": { emoji: "🐱", gradient: "linear-gradient(135deg, #451a03 0%, #78350f 40%, #b45309 100%)", border: "#f59e0b", glow: "#f59e0b44", accent: "#fbbf24", catchphrase: "にゃんこ軍団、出撃！" },
  "文房具": { emoji: "✏️", gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)", border: "#818cf8", glow: "#818cf844", accent: "#a5b4fc", catchphrase: "筆箱から飛び出す戦士たち" },
  "学校": { emoji: "🏫", gradient: "linear-gradient(135deg, #042f2e 0%, #134e4a 40%, #0d9488 100%)", border: "#2dd4bf", glow: "#2dd4bf44", accent: "#5eead4", catchphrase: "授業開始のチャイムが鳴る！" },
  "科学": { emoji: "🔬", gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 40%, #059669 100%)", border: "#34d399", glow: "#34d39944", accent: "#6ee7b7", catchphrase: "実験の成果を見せてやれ！" },
  "数学": { emoji: "🧮", gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)", border: "#60a5fa", glow: "#60a5fa44", accent: "#93c5fd", catchphrase: "数式が武器になる世界" },
  "芸術": { emoji: "🎨", gradient: "linear-gradient(135deg, #3b0764 0%, #6b21a8 40%, #9333ea 100%)", border: "#c084fc", glow: "#c084fc44", accent: "#d8b4fe", catchphrase: "色彩が戦場を染める！" },
  "工学": { emoji: "⚙️", gradient: "linear-gradient(135deg, #0c1222 0%, #1e293b 40%, #334155 100%)", border: "#22d3ee", glow: "#22d3ee44", accent: "#67e8f9", catchphrase: "機械仕掛けの精鋭部隊" },
  "自然": { emoji: "🌿", gradient: "linear-gradient(135deg, #052e16 0%, #14532d 40%, #15803d 100%)", border: "#4ade80", glow: "#4ade8044", accent: "#86efac", catchphrase: "大地の力が目覚める！" },
  "歴史": { emoji: "🏛️", gradient: "linear-gradient(135deg, #1c1917 0%, #44403c 40%, #78716c 100%)", border: "#f59e0b", glow: "#f59e0b44", accent: "#fcd34d", catchphrase: "歴戦の英雄たちが蘇る" },
  "音楽": { emoji: "🎵", gradient: "linear-gradient(135deg, #2e1065 0%, #4c1d95 40%, #7c3aed 100%)", border: "#a78bfa", glow: "#a78bfa44", accent: "#c4b5fd", catchphrase: "旋律が戦場に響き渡る！" },
  "スポーツ": { emoji: "🏆", gradient: "linear-gradient(135deg, #0c2461 0%, #1e3a8a 40%, #1d4ed8 100%)", border: "#3b82f6", glow: "#3b82f644", accent: "#93c5fd", catchphrase: "アスリートたちの頂上決戦" },
  "図工": { emoji: "🖌️", gradient: "linear-gradient(135deg, #4a1942 0%, #831843 40%, #be185d 100%)", border: "#f472b6", glow: "#f472b644", accent: "#fbcfe8", catchphrase: "創造力で敵を圧倒せよ！" },
};
const DEFAULT_THEME = { emoji: "🎁", gradient: "linear-gradient(135deg, #1e293b, #334155)", border: "#64748b", glow: "#64748b44", accent: "#94a3b8", catchphrase: "" };

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
      zIndex: 200, overflowY: "auto",
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
        overflowY: "auto",
        flex: 1,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${selectorCols}, minmax(0, 1fr))`,
          gap: 10,
        }}>
          {allOptions.map((opt) => {
            const active = activeTab === opt.key;
            const isOptBuff = opt.key === BUFF_TAB_KEY;
            const optPool = isOptBuff ? [] : GACHA_POOL_UNITS.filter((u) => u.series === opt.key);
            const optOwned = isOptBuff ? 0 : optPool.filter((u) => ownedUnitIds.includes(u.id)).length;
            const allCollected = !isOptBuff && optPool.length > 0 && optOwned === optPool.length;
            const theme = isOptBuff ? null : (SERIES_THEME[opt.key] ?? DEFAULT_THEME);
            const completePct = isOptBuff ? 0 : optPool.length > 0 ? Math.round((optOwned / optPool.length) * 100) : 0;

            // バフガチャ用の特別デザイン
            if (isOptBuff) {
              return (
                <button
                  key={opt.key}
                  onClick={() => handleTabChange(opt.key)}
                  style={{
                    position: "relative",
                    borderRadius: 14,
                    padding: "14px 12px",
                    background: active
                      ? "linear-gradient(135deg, #422006 0%, #713f12 40%, #a16207 100%)"
                      : "linear-gradient(135deg, #1a1500 0%, #2a2000 50%, #332800 100%)",
                    border: `2px solid ${active ? "#fbbf24" : "#713f12"}`,
                    color: "#fff",
                    textAlign: "center",
                    cursor: phase === "rolling" ? "default" : "pointer",
                    transition: "all 0.25s ease",
                    overflow: "hidden",
                    boxShadow: active ? "0 0 20px #fbbf2444, inset 0 1px 0 #fbbf2433" : "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  <div style={{ fontSize: isMobile ? 28 : 34, marginBottom: 4, filter: "drop-shadow(0 0 6px #fbbf24)" }}>⚡</div>
                  <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 800, color: "#fde68a", marginBottom: 2 }}>バフガチャ</div>
                  <div style={{ fontSize: 10, color: "#fbbf24", opacity: 0.8 }}>💰 {opt.cost} コイン</div>
                  <div style={{ fontSize: 9, color: "#d97706", marginTop: 4, fontStyle: "italic" }}>ステージ有利に！</div>
                </button>
              );
            }

            return (
              <button
                key={opt.key}
                onClick={() => handleTabChange(opt.key)}
                style={{
                  position: "relative",
                  borderRadius: 14,
                  padding: "14px 12px 10px",
                  background: theme!.gradient,
                  border: `2px solid ${active ? theme!.border : `${theme!.border}55`}`,
                  color: "#fff",
                  textAlign: "center",
                  cursor: phase === "rolling" ? "default" : "pointer",
                  transition: "all 0.25s ease",
                  overflow: "hidden",
                  boxShadow: active
                    ? `0 0 24px ${theme!.glow}, inset 0 1px 0 ${theme!.accent}33`
                    : "0 2px 8px rgba(0,0,0,0.3)",
                  transform: active ? "scale(1.03)" : "scale(1)",
                }}
              >
                {/* 背景のキラキラエフェクト */}
                <div style={{
                  position: "absolute", inset: 0, opacity: active ? 0.15 : 0.06,
                  background: `radial-gradient(circle at 20% 20%, ${theme!.accent} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${theme!.accent} 0%, transparent 50%)`,
                  pointerEvents: "none",
                }} />

                {/* コンプリートバッジ */}
                {allCollected && (
                  <div style={{
                    position: "absolute", top: 4, right: 4,
                    fontSize: 8, fontWeight: 800, color: "#fbbf24",
                    background: "rgba(0,0,0,0.6)", borderRadius: 6,
                    padding: "2px 5px", border: "1px solid #fbbf2466",
                  }}>COMPLETE</div>
                )}

                {/* シリーズ絵文字 */}
                <div style={{
                  fontSize: isMobile ? 30 : 38, lineHeight: 1, marginBottom: 6,
                  filter: `drop-shadow(0 0 8px ${theme!.glow})`,
                }}>
                  {theme!.emoji}
                </div>

                {/* シリーズ名 */}
                <div style={{
                  fontSize: isMobile ? 14 : 15, fontWeight: 800,
                  color: theme!.accent, letterSpacing: 0.5,
                  textShadow: `0 0 10px ${theme!.glow}`,
                  marginBottom: 3,
                }}>
                  {opt.label}
                </div>

                {/* キャッチコピー */}
                <div style={{
                  fontSize: 9, color: `${theme!.accent}aa`, fontStyle: "italic",
                  marginBottom: 6, minHeight: 12,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {theme!.catchphrase}
                </div>

                {/* 所持プログレスバー */}
                <div style={{
                  height: 4, borderRadius: 2,
                  background: "rgba(0,0,0,0.4)",
                  overflow: "hidden", marginBottom: 4,
                }}>
                  <div style={{
                    width: `${completePct}%`, height: "100%",
                    background: allCollected
                      ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                      : `linear-gradient(90deg, ${theme!.accent}, ${theme!.border})`,
                    borderRadius: 2,
                    transition: "width 0.3s",
                  }} />
                </div>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontSize: 10,
                }}>
                  <span style={{ color: allCollected ? "#fbbf24" : theme!.accent, fontWeight: 700 }}>
                    {optOwned}/{optPool.length}
                  </span>
                  <span style={{ color: "#fbbf24", fontWeight: 700 }}>
                    💰 {opt.cost}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 下部のヒントテキスト */}
      <div style={{
        padding: "8px 20px 16px",
        textAlign: "center",
        fontSize: 11, color: "#475569",
      }}>
        気になるシリーズをタップしてガチャを回そう！
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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
