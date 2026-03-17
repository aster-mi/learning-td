import { UNIT_DEFS, type UnitType } from "../domain/Unit";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  energy: number;
  onDeploy: (type: UnitType) => void;
  disabled?: boolean;
}

const UNIT_TYPES: UnitType[] = ["basic", "fast", "tank"];

export function CommandPanel({ energy, onDeploy, disabled }: Props) {
  const { isMobile } = useWindowSize();

  return (
    <div style={{
      padding: isMobile ? "6px 10px" : "10px 16px",
      background: "#0d1f35",
      borderTop: "2px solid #1a3050",
      display: "flex",
      gap: isMobile ? 6 : 10,
      alignItems: "stretch",
      flexWrap: "wrap",
    }}>
      {/* 現在のエネルギー表示（左端） */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "4px 8px" : "6px 12px",
        background: "#0a1828",
        borderRadius: 8,
        border: "1px solid #1a3050",
        minWidth: isMobile ? 52 : 64,
      }}>
        {!isMobile && <span style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>現在</span>}
        <span style={{ fontSize: isMobile ? 20 : 26, fontWeight: "bold", color: "#fbbf24", lineHeight: 1 }}>⚡{energy}</span>
      </div>

      {/* 区切り */}
      <div style={{ color: "#334155", fontSize: 16, alignSelf: "center" }}>▶</div>

      {/* ユニットボタン */}
      {UNIT_TYPES.map(type => {
        const def = UNIT_DEFS[type];
        const canAfford = energy >= def.cost && !disabled;
        const emoji = type === "basic" ? "🐱" : type === "fast" ? "💨" : "🛡️";

        return (
          <button
            key={type}
            onClick={() => canAfford && onDeploy(type)}
            disabled={!canAfford}
            title={`HP:${def.hp}  ATK:${def.atk}  SPD:${def.speed}  COST:${def.cost}`}
            style={{
              padding: isMobile ? "5px 8px" : "8px 14px",
              background: canAfford ? "#1a3050" : "#0a1828",
              color: canAfford ? "#f1f5f9" : "#475569",
              border: canAfford
                ? `2px solid ${def.color}`
                : "2px solid #1e293b",
              borderRadius: 8,
              cursor: canAfford ? "pointer" : "not-allowed",
              fontWeight: "bold",
              fontSize: 13,
              transition: "all 0.15s",
              textAlign: "center",
              minWidth: isMobile ? 64 : 80,
              flex: isMobile ? 1 : undefined,
              boxShadow: canAfford ? `0 0 8px ${def.color}55` : "none",
            }}
            onMouseEnter={e => {
              if (canAfford) (e.currentTarget as HTMLElement).style.background = "#244060";
            }}
            onMouseLeave={e => {
              if (canAfford) (e.currentTarget as HTMLElement).style.background = "#1a3050";
            }}
          >
            <div style={{ fontSize: isMobile ? 18 : 20, lineHeight: 1.2 }}>{emoji}</div>
            <div style={{ color: canAfford ? "#f1f5f9" : "#475569", fontSize: isMobile ? 12 : 13 }}>{def.label}</div>
            <div style={{
              fontSize: 12,
              marginTop: 2,
              color: canAfford ? "#fbbf24" : "#64748b",
              fontWeight: "bold",
            }}>
              ⚡{def.cost}
            </div>
            {!isMobile && (
              <div style={{ fontSize: 10, color: canAfford ? "#94a3b8" : "#334155" }}>
                HP {def.hp}
              </div>
            )}
          </button>
        );
      })}

      {/* 説明（PC のみ表示） */}
      {!isMobile && (
        <div style={{
          marginLeft: "auto",
          color: "#475569",
          fontSize: 11,
          lineHeight: 1.8,
          alignSelf: "center",
          borderLeft: "1px solid #1e293b",
          paddingLeft: 10,
        }}>
          <div>🐱 ネコ：バランス型</div>
          <div>💨 速ネコ：高速・低HP</div>
          <div>🛡️ タンク：高HP・低速</div>
        </div>
      )}
    </div>
  );
}
