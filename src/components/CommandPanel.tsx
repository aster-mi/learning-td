import { getUnitDef } from "../domain/Unit";
import { getCatalogEntry, RARITY_INFO } from "../data/unitCatalog";
import { useWindowSize } from "../hooks/useWindowSize";
import { UnitIcon } from "./UnitIcon";
import { sfxDeploy } from "../audio/SoundManager";

interface Props {
  energy: number;
  party: string[];           // 出陣デッキのユニットID配列
  onDeploy: (type: string) => void;
  disabled?: boolean;
}

export function CommandPanel({ energy, party, onDeploy, disabled }: Props) {
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

      {/* パーティユニットボタン */}
      {party.map(unitId => {
        const def = getUnitDef(unitId);
        const catalog = getCatalogEntry(unitId);
        const rarity = catalog ? RARITY_INFO[catalog.rarity] : null;
        const canAfford = energy >= def.cost && !disabled;

        return (
          <button
            key={unitId}
            onClick={() => { if (canAfford) { sfxDeploy(); onDeploy(unitId); } }}
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
            <div style={{ lineHeight: 1, display: "flex", justifyContent: "center" }}>
              <UnitIcon unitId={unitId} color={def.color} size={isMobile ? 28 : 34} emoji={def.emoji} />
            </div>
            <div style={{
              fontSize: isMobile ? 9 : 11, marginTop: 1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              maxWidth: isMobile ? 48 : 64,
            }}>{def.label}</div>
            <div style={{ fontSize: 11, marginTop: 1, color: canAfford ? "#fbbf24" : "#64748b", fontWeight: "bold" }}>
              ⚡{def.cost}
            </div>
            {!isMobile && rarity && (
              <div style={{ fontSize: 9, color: rarity.color }}>
                {rarity.stars}
              </div>
            )}
          </button>
        );
      })}

      {/* 空スロット表示 */}
      {Array.from({ length: Math.max(0, 5 - party.length) }).map((_, i) => (
        <div key={`empty-${i}`} style={{
          padding: isMobile ? "4px 6px" : "7px 12px",
          background: "#0a1828",
          border: "2px dashed #1e293b",
          borderRadius: 8,
          minWidth: isMobile ? 54 : 72,
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#334155", fontSize: 20,
        }}>
          +
        </div>
      ))}
    </div>
  );
}
