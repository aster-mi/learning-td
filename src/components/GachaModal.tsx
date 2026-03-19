import { useState, useEffect } from "react";

export type GachaReward = {
  type: "coins" | "energy_boost" | "combo_start" | "shield";
  label: string;
  emoji: string;
  desc: string;
  rarity: "common" | "rare" | "epic";
  value: number;
};

const GACHA_POOL: GachaReward[] = [
  { type: "coins", label: "コインボーナス", emoji: "💰", desc: "+30コイン", rarity: "common", value: 30 },
  { type: "coins", label: "コイン袋", emoji: "💰", desc: "+60コイン", rarity: "rare", value: 60 },
  { type: "coins", label: "金塊", emoji: "💎", desc: "+120コイン", rarity: "epic", value: 120 },
  { type: "energy_boost", label: "エネルギーブースト", emoji: "⚡", desc: "次回初期エネルギー+20", rarity: "common", value: 20 },
  { type: "energy_boost", label: "メガエネルギー", emoji: "⚡", desc: "次回初期エネルギー+40", rarity: "rare", value: 40 },
  { type: "combo_start", label: "コンボスタート", emoji: "🔥", desc: "次回コンボ3から開始", rarity: "rare", value: 3 },
  { type: "combo_start", label: "メガコンボ", emoji: "💥", desc: "次回コンボ5から開始", rarity: "epic", value: 5 },
  { type: "shield", label: "シールド", emoji: "🛡️", desc: "次回拠点HP+50", rarity: "common", value: 50 },
  { type: "shield", label: "鉄壁", emoji: "🏰", desc: "次回拠点HP+100", rarity: "rare", value: 100 },
  { type: "shield", label: "要塞", emoji: "🏯", desc: "次回拠点HP+200", rarity: "epic", value: 200 },
];

const RARITY_COLORS = {
  common: { bg: "#1e293b", border: "#475569", glow: "#47556944", label: "★", labelColor: "#94a3b8" },
  rare: { bg: "#1e1b4b", border: "#818cf8", glow: "#818cf844", label: "★★", labelColor: "#818cf8" },
  epic: { bg: "#3b0764", border: "#c084fc", glow: "#c084fc66", label: "★★★", labelColor: "#c084fc" },
};

function rollGacha(stars: number): GachaReward {
  // Higher stars = better odds for rare/epic
  const weights = GACHA_POOL.map(item => {
    if (item.rarity === "epic")   return stars >= 3 ? 15 : stars >= 2 ? 8 : 3;
    if (item.rarity === "rare")   return stars >= 2 ? 25 : 15;
    return 30;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < GACHA_POOL.length; i++) {
    r -= weights[i];
    if (r <= 0) return GACHA_POOL[i];
  }
  return GACHA_POOL[0];
}

interface Props {
  stars: number;
  onClose: (reward: GachaReward) => void;
  isMobile: boolean;
}

export function GachaModal({ stars, onClose, isMobile }: Props) {
  const [phase, setPhase] = useState<"rolling" | "reveal">("rolling");
  const [reward, setReward] = useState<GachaReward | null>(null);
  const [rollIndex, setRollIndex] = useState(0);

  useEffect(() => {
    const result = rollGacha(stars);
    // Rolling animation: cycle through items quickly
    let count = 0;
    const maxRolls = 15 + Math.floor(Math.random() * 8);
    const interval = setInterval(() => {
      setRollIndex(Math.floor(Math.random() * GACHA_POOL.length));
      count++;
      if (count >= maxRolls) {
        clearInterval(interval);
        setReward(result);
        setTimeout(() => setPhase("reveal"), 200);
      }
    }, 80 + count * 8);
    return () => clearInterval(interval);
  }, [stars]);

  const displayItem = phase === "reveal" && reward ? reward : GACHA_POOL[rollIndex % GACHA_POOL.length];
  const rStyle = reward ? RARITY_COLORS[reward.rarity] : RARITY_COLORS.common;
  const isRevealed = phase === "reveal" && reward;

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
        width: isMobile ? 240 : 280,
        padding: "32px 24px",
        background: isRevealed ? rStyle.bg : "#0f172a",
        border: `3px solid ${isRevealed ? rStyle.border : "#334155"}`,
        borderRadius: 16,
        textAlign: "center",
        boxShadow: isRevealed ? `0 0 40px ${rStyle.glow}` : "none",
        transition: "all 0.5s ease",
        transform: isRevealed ? "scale(1)" : "scale(0.95)",
      }}>
        {/* Rarity label */}
        {isRevealed && (
          <div style={{
            fontSize: 14, fontWeight: "bold",
            color: rStyle.labelColor,
            marginBottom: 8,
            animation: "gachaPop 0.5s ease",
          }}>
            {rStyle.label} {reward!.rarity.toUpperCase()}
          </div>
        )}

        {/* Emoji */}
        <div style={{
          fontSize: isRevealed ? 64 : 48,
          transition: "font-size 0.3s",
          animation: phase === "rolling" ? "gachaSpin 0.1s linear infinite" : "gachaPop 0.5s ease",
          marginBottom: 12,
        }}>
          {displayItem.emoji}
        </div>

        {/* Name */}
        <div style={{
          fontSize: 20, fontWeight: "bold",
          color: isRevealed ? "#fff" : "#64748b",
          transition: "color 0.3s",
          marginBottom: 6,
        }}>
          {isRevealed ? displayItem.label : "???"}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 14,
          color: isRevealed ? rStyle.labelColor : "#334155",
          transition: "color 0.3s",
        }}>
          {isRevealed ? displayItem.desc : "..."}
        </div>
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
