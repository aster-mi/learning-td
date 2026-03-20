import { useState, useEffect } from "react";
import { GACHA_POOL_UNITS, RARITY_INFO, type UnitCatalogEntry, type Rarity } from "../data/unitCatalog";

export type GachaReward = {
  type: "unit" | "coins";
  unitEntry?: UnitCatalogEntry;  // present when type === "unit"
  coins?: number;                // present when type === "coins" (duplicate compensation)
  rarity: Rarity;
};

// ── Rolling logic ──────────────────────────────────────────────────────────

function rollGacha(stars: number, ownedUnitIds: string[]): GachaReward {
  const available = GACHA_POOL_UNITS.filter(u => !ownedUnitIds.includes(u.id));

  // All units owned → coin reward
  if (available.length === 0) {
    const coinAmounts: Record<number, number> = { 1: 100, 2: 200, 3: 500 };
    const coins = coinAmounts[stars] ?? 100;
    return { type: "coins", coins, rarity: stars >= 3 ? "epic" : stars >= 2 ? "rare" : "common" };
  }

  // Build rarity weights based on stars
  const baseWeights: Record<Rarity, number> = { common: 40, rare: 25, epic: 12, legendary: 3 };
  const perStar: Record<Rarity, number> = { common: -3, rare: 2, epic: 3, legendary: 1 };

  const rarityWeight = (r: Rarity) =>
    Math.max(1, baseWeights[r] + perStar[r] * stars);

  // Group available units by rarity, then assign weight
  const weights = available.map(u => rarityWeight(u.rarity));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < available.length; i++) {
    r -= weights[i];
    if (r <= 0) {
      return { type: "unit", unitEntry: available[i], rarity: available[i].rarity };
    }
  }

  // Fallback
  const pick = available[0];
  return { type: "unit", unitEntry: pick, rarity: pick.rarity };
}

// ── Component ──────────────────────────────────────────────────────────────

interface Props {
  stars: number;
  ownedUnitIds: string[];
  onClose: (reward: GachaReward) => void;
  isMobile: boolean;
}

export function GachaModal({ stars, ownedUnitIds, onClose, isMobile }: Props) {
  const [phase, setPhase] = useState<"rolling" | "reveal">("rolling");
  const [reward, setReward] = useState<GachaReward | null>(null);
  const [rollEmoji, setRollEmoji] = useState("❓");

  useEffect(() => {
    const result = rollGacha(stars, ownedUnitIds);
    let count = 0;
    const maxRolls = 15 + Math.floor(Math.random() * 8);
    const interval = setInterval(() => {
      // Cycle through random unit emojis during rolling
      const idx = Math.floor(Math.random() * GACHA_POOL_UNITS.length);
      setRollEmoji(GACHA_POOL_UNITS[idx].emoji);
      count++;
      if (count >= maxRolls) {
        clearInterval(interval);
        setReward(result);
        setTimeout(() => setPhase("reveal"), 200);
      }
    }, 80 + count * 8);
    return () => clearInterval(interval);
  }, [stars, ownedUnitIds]);

  const isRevealed = phase === "reveal" && reward != null;
  const rInfo = reward ? RARITY_INFO[reward.rarity] : RARITY_INFO.common;
  const isUnit = reward?.type === "unit" && reward.unitEntry;
  const displayEmoji = isRevealed
    ? (isUnit ? reward!.unitEntry!.emoji : "💰")
    : rollEmoji;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 200,
    }}>
      <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 12, letterSpacing: 2 }}>
        🎰 ボーナスガチャ
      </div>

      {/* Gacha card */}
      <div style={{
        width: isMobile ? 260 : 300,
        padding: "28px 24px",
        background: isRevealed ? rInfo.bg : "#0f172a",
        border: `3px solid ${isRevealed ? rInfo.border : "#334155"}`,
        borderRadius: 16,
        textAlign: "center",
        boxShadow: isRevealed ? `0 0 40px ${rInfo.glow}` : "none",
        transition: "all 0.5s ease",
        transform: isRevealed ? "scale(1)" : "scale(0.95)",
      }}>
        {/* Rarity label */}
        {isRevealed && (
          <div style={{
            fontSize: 14, fontWeight: "bold",
            color: rInfo.color,
            marginBottom: 6,
            animation: "gachaPop 0.5s ease",
          }}>
            {rInfo.stars} {rInfo.label}
          </div>
        )}

        {/* Emoji */}
        <div style={{
          fontSize: isRevealed ? 72 : 48,
          transition: "font-size 0.3s",
          animation: phase === "rolling" ? "gachaSpin 0.1s linear infinite" : "gachaPop 0.5s ease",
          marginBottom: 10,
        }}>
          {displayEmoji}
        </div>

        {/* Name */}
        <div style={{
          fontSize: 22, fontWeight: "bold",
          color: isRevealed ? "#fff" : "#64748b",
          transition: "color 0.3s",
          marginBottom: 4,
        }}>
          {isRevealed
            ? (isUnit ? reward!.unitEntry!.label : `${reward!.coins} コイン`)
            : "???"}
        </div>

        {/* Series badge (unit only) */}
        {isRevealed && isUnit && (
          <div style={{
            display: "inline-block",
            fontSize: 11, fontWeight: "bold",
            color: rInfo.color,
            background: `${rInfo.color}22`,
            border: `1px solid ${rInfo.color}44`,
            borderRadius: 6,
            padding: "2px 10px",
            marginBottom: 10,
            animation: "gachaPop 0.5s ease",
          }}>
            {reward!.unitEntry!.series}シリーズ
          </div>
        )}

        {/* Stats grid (unit only) */}
        {isRevealed && isUnit && (() => {
          const u = reward!.unitEntry!;
          const stats = [
            { key: "HP", val: u.hp },
            { key: "ATK", val: u.atk },
            { key: "SPD", val: u.speed },
            { key: "RANGE", val: u.range },
            { key: "COST", val: u.cost },
          ];
          return (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 4,
              marginTop: 8,
              animation: "gachaPop 0.6s ease",
            }}>
              {stats.map(s => (
                <div key={s.key} style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 6,
                  padding: "4px 2px",
                }}>
                  <div style={{ fontSize: 9, color: "#64748b", fontWeight: "bold" }}>{s.key}</div>
                  <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: "bold" }}>{s.val}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Coin reward description */}
        {isRevealed && reward?.type === "coins" && (
          <div style={{
            fontSize: 13, color: rInfo.color, marginTop: 8,
            animation: "gachaPop 0.5s ease",
          }}>
            全ユニット獲得済み！コインに変換
          </div>
        )}
      </div>

      {/* Close button */}
      {isRevealed && (
        <button
          onClick={() => reward && onClose(reward)}
          style={{
            marginTop: 20,
            padding: "12px 32px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
            animation: "gachaPop 0.5s ease",
          }}
        >
          受け取る！
        </button>
      )}

      {phase === "rolling" && (
        <div style={{ marginTop: 20, color: "#64748b", fontSize: 14, animation: "pulse 1s infinite" }}>
          ガチャ中...
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
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}
