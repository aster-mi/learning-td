import { UNIT_DEFS, type UnitType } from "../domain/Unit";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  energy: number;
  onDeploy: (type: UnitType) => void;
  disabled?: boolean;
}

const UNIT_TYPES: UnitType[] = ["basic", "fast", "tank", "shooter", "bomber"];

const UNIT_EMOJI: Record<UnitType, string> = {
  basic:   "🐱",
  fast:    "💨",
  tank:    "🛡️",
  shooter: "🏹",
  bomber:  "🔥",
};

export function CommandPanel({ energy, onDeploy, disabled }: Props) {
  const { isMobile } = useWindowSize();

  return (
    <div style={{
      padding: isMobile ? "5px 8px" : "8px 16px",
      background: "#0d1f35",
      borderTop: "2px solid #1a3050",
      display: "flex",
      gap: isMobile ? 5 : 8,
      alignItems: "stretch",
      flexWrap: "nowrap",
      overflowX: "auto",
    }}>
      {/* エネルギー表示 */}
      <div style={{
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: isMobile ? "3px 6px" : "6px 12px",
        background: "#0a1828",
        borderRadius: 8, border: "1px solid #1a3050",
        minWidth: isMobile ? 46 : 58, flexShrink: 0,
      }}>
        {!isMobile && <span style={{ fontSize: 10, color: "#94a3b8", marginBottom: 1 }}>現在</span>}
        <span style={{ fontSize: isMobile ? 17 : 24, fontWeight: "bold", color: "#fbbf24", lineHeight: 1 }}>⚡{energy}</span>
      </div>

      <div style={{ color: "#334155", fontSize: 14, alignSelf: "center", flexShrink: 0 }}>▶</div>

      {/* ユニットボタン */}
      {UNIT_TYPES.map(type => {
        const def = UNIT_DEFS[type];
        const canAfford = energy >= def.cost && !disabled;
        const emoji = UNIT_EMOJI[type];

        return (
          <button
            key={type}
            onClick={() => canAfford && onDeploy(type)}
            disabled={!canAfford}
            title={`HP:${def.hp}  ATK:${def.atk}  射程:${def.range}  SPD:${def.speed}  COST:${def.cost}`}
            style={{
              padding: isMobile ? "4px 6px" : "7px 12px",
              background: canAfford ? "#1a3050" : "#0a1828",
              color: canAfford ? "#f1f5f9" : "#475569",
              border: canAfford ? `2px solid ${def.color}` : "2px solid #1e293b",
              borderRadius: 8,
              cursor: canAfford ? "pointer" : "not-allowed",
              fontWeight: "bold",
              fontSize: 12,
              transition: "all 0.15s",
              textAlign: "center",
              minWidth: isMobile ? 54 : 72,
              flexShrink: 0,
              boxShadow: canAfford ? `0 0 8px ${def.color}55` : "none",
            }}
            onMouseEnter={e => {
              if (canAfford) (e.currentTarget as HTMLElement).style.background = "#244060";
            }}
            onMouseLeave={e => {
              if (canAfford) (e.currentTarget as HTMLElement).style.background = "#1a3050";
            }}
          >
            <div style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.2 }}>{emoji}</div>
            <div style={{ fontSize: isMobile ? 10 : 11, marginTop: 1 }}>{def.label}</div>
            <div style={{ fontSize: 11, marginTop: 1, color: canAfford ? "#fbbf24" : "#64748b", fontWeight: "bold" }}>
              ⚡{def.cost}
            </div>
            {!isMobile && (
              <div style={{ fontSize: 9, color: canAfford ? "#94a3b8" : "#334155" }}>
                HP {def.hp}
              </div>
            )}
          </button>
        );
      })}

      {/* 説明（PCのみ） */}
      {!isMobile && (
        <div style={{
          marginLeft: "auto", color: "#475569", fontSize: 10,
          lineHeight: 1.9, alignSelf: "center",
          borderLeft: "1px solid #1e293b", paddingLeft: 10, flexShrink: 0,
        }}>
          <div>🐱 ネコ：バランス型</div>
          <div>💨 速ネコ：高速・低HP</div>
          <div>🛡️ タンク：高HP・低速</div>
          <div>🏹 遠距離：長射程</div>
          <div>🔥 火炎：高火力・低速</div>
        </div>
      )}
    </div>
  );
}
