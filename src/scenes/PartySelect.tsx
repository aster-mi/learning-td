import { useMemo, useCallback, useState } from "react";
import {
  getCatalogEntry,
  RARITY_INFO,
  SERIES_LIST,
  UNIT_CATALOG,
  type UnitCatalogEntry,
} from "../data/unitCatalog";
import { useWindowSize } from "../hooks/useWindowSize";
import { UnitIcon } from "../components/UnitIcon";
import {
  getAtkMultiplier,
  getHpMultiplier,
  getUpgrade,
  getUpgradeCost,
  MAX_UPGRADE_LEVEL,
  type SaveData,
} from "../data/saveData";

interface Props {
  ownedUnitIds: string[];
  currentParty: string[];
  saveData: SaveData;
  onConfirm: (party: string[]) => void;
  onSaveData: (save: SaveData) => void;
  onBack: () => void;
}

const MAX_PARTY = 5;
const ALL_FILTER = "すべて";
const SERIES_TABS = [ALL_FILTER, ...SERIES_LIST];

function StatPill({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 4,
        padding: "1px 5px",
        fontSize: 10,
        color,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ opacity: 0.7 }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </span>
  );
}

function PartySlot({
  entry,
  index,
  isMobile,
  onRemove,
}: {
  entry: UnitCatalogEntry | null;
  index: number;
  isMobile: boolean;
  onRemove: () => void;
}) {
  const size = isMobile ? 56 : 72;
  const rarity = entry ? RARITY_INFO[entry.rarity] : null;

  return (
    <button
      onClick={entry ? onRemove : undefined}
      style={{
        width: size,
        height: size + 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        background: entry ? rarity!.bg : "rgba(255,255,255,0.04)",
        border: entry ? `2px solid ${rarity!.border}` : "2px dashed rgba(255,255,255,0.12)",
        borderRadius: 10,
        cursor: entry ? "pointer" : "default",
        padding: 0,
        position: "relative",
        color: "#fff",
        flexShrink: 0,
      }}
      title={entry ? `${entry.label} を外す` : `スロット ${index + 1}`}
    >
      {entry ? (
        <>
          <UnitIcon unitId={entry.id} color={entry.color} size={isMobile ? 32 : 40} emoji={entry.emoji} />
          <span
            style={{
              fontSize: isMobile ? 8 : 9,
              fontWeight: 600,
              maxWidth: size - 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {entry.label}
          </span>
          <span style={{ fontSize: isMobile ? 7 : 8, color: rarity!.color, lineHeight: 1 }}>{rarity!.stars}</span>
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "#ef4444",
              borderRadius: "50%",
              width: 16,
              height: 16,
              fontSize: 10,
              lineHeight: "16px",
              textAlign: "center",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            ×
          </span>
        </>
      ) : (
        <span style={{ fontSize: isMobile ? 20 : 26, opacity: 0.15 }}>□</span>
      )}
    </button>
  );
}

function UnitCard({
  entry,
  inParty,
  partyFull,
  isMobile,
  mastery,
  hpLevel,
  atkLevel,
  onToggle,
  onFocus,
}: {
  entry: UnitCatalogEntry;
  inParty: boolean;
  partyFull: boolean;
  isMobile: boolean;
  mastery: number;
  hpLevel: number;
  atkLevel: number;
  onToggle: () => void;
  onFocus: () => void;
}) {
  const rarity = RARITY_INFO[entry.rarity];
  const disabled = !inParty && partyFull;
  const masteryLevel = Math.min(10, Math.floor(mastery / 25));

  return (
    <button
      onClick={disabled ? undefined : onToggle}
      onContextMenu={(event) => {
        event.preventDefault();
        onFocus();
      }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        background: rarity.bg,
        border: `2px solid ${inParty ? "#22d3ee" : rarity.border}`,
        borderRadius: 12,
        padding: isMobile ? "10px 6px 8px" : "14px 10px 10px",
        cursor: disabled ? "not-allowed" : "pointer",
        color: "#fff",
        opacity: disabled ? 0.4 : 1,
        boxShadow: inParty ? `0 0 16px rgba(34,211,238,0.35)` : `0 0 10px ${rarity.glow}`,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <span style={{ position: "absolute", top: 4, right: 6, fontSize: isMobile ? 8 : 9, color: rarity.color }}>
        {rarity.stars}
      </span>

      <div style={{ lineHeight: 0 }} onClick={(event) => { event.stopPropagation(); onFocus(); }}>
        <UnitIcon unitId={entry.id} color={entry.color} size={isMobile ? 40 : 52} emoji={entry.emoji} />
      </div>

      <span
        style={{
          fontSize: isMobile ? 11 : 13,
          fontWeight: 700,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {entry.label}
      </span>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", marginTop: 2 }}>
        <StatPill label="HP" value={entry.hp} color="#34d399" />
        <StatPill label="ATK" value={entry.atk} color="#f87171" />
        <StatPill label="育成" value={`H${hpLevel}/A${atkLevel}`} color="#c084fc" />
      </div>

      <div style={{ width: "100%", marginTop: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#cbd5e1", marginBottom: 3 }}>
          <span>熟練度</span>
          <span>Lv.{masteryLevel}</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.08)" }}>
          <div
            style={{
              width: `${Math.min(100, mastery % 250 === 0 ? 100 : ((mastery % 250) / 250) * 100)}%`,
              height: "100%",
              borderRadius: 999,
              background: "#22d3ee",
            }}
          />
        </div>
      </div>
    </button>
  );
}

function FocusedUnitPanel({
  entry,
  rarityLabel,
  rarityColor,
  saveData,
  selectedUpgrade,
  applyUpgrade,
  rarityCounts,
  sticky,
}: {
  entry: UnitCatalogEntry;
  rarityLabel: string;
  rarityColor: string;
  saveData: SaveData;
  selectedUpgrade: { hpLevel: number; atkLevel: number };
  applyUpgrade: (type: "hpLevel" | "atkLevel") => void;
  rarityCounts: Record<string, number>;
  sticky: boolean;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "18px",
        ...(sticky ? { position: "sticky" as const, top: 16 } : {}),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <UnitIcon unitId={entry.id} color={entry.color} size={64} emoji={entry.emoji} />
        <div>
          <div style={{ fontSize: 12, color: rarityColor, marginBottom: 4 }}>{rarityLabel}</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{entry.label}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{entry.series}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 16 }}>{entry.desc}</div>

      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <StatPill label="基礎HP" value={entry.hp} color="#34d399" />
        <StatPill label="強化後HP" value={Math.round(entry.hp * getHpMultiplier(selectedUpgrade.hpLevel))} color="#22c55e" />
        <StatPill label="基礎ATK" value={entry.atk} color="#f87171" />
        <StatPill label="強化後ATK" value={Math.round(entry.atk * getAtkMultiplier(selectedUpgrade.atkLevel))} color="#fb7185" />
        <StatPill label="熟練度" value={saveData.unitMastery[entry.id] ?? 0} color="#22d3ee" />
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {[
          { key: "hpLevel" as const, label: "HP強化", level: selectedUpgrade.hpLevel, color: "#22c55e" },
          { key: "atkLevel" as const, label: "ATK強化", level: selectedUpgrade.atkLevel, color: "#f97316" },
        ].map((item) => {
          const cost = getUpgradeCost(item.level);
          const disabled = cost == null || saveData.coins < cost;
          return (
            <div key={item.key} style={{ border: "1px solid #334155", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ color: item.color, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#cbd5e1" }}>Lv.{item.level}/{MAX_UPGRADE_LEVEL}</div>
              </div>
              <div style={{ height: 8, background: "#0f172a", borderRadius: 999, marginBottom: 10 }}>
                <div
                  style={{
                    width: `${(item.level / MAX_UPGRADE_LEVEL) * 100}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: item.color,
                  }}
                />
              </div>
              <button
                disabled={disabled}
                onClick={() => applyUpgrade(item.key)}
                style={{
                  width: "100%",
                  background: disabled ? "#1e293b" : item.color,
                  color: disabled ? "#64748b" : "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 12px",
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {cost == null ? "最大まで強化済み" : `強化する - ${cost}コイン`}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: "#94a3b8" }}>
        レア数: C {rarityCounts.common ?? 0} / R {rarityCounts.rare ?? 0} / E {rarityCounts.epic ?? 0} / L {rarityCounts.legendary ?? 0}
      </div>
    </div>
  );
}

export function PartySelect({ ownedUnitIds, currentParty, saveData, onConfirm, onSaveData, onBack }: Props) {
  const { isMobile } = useWindowSize();
  const [party, setParty] = useState<string[]>(() => [...currentParty]);
  const [seriesFilter, setSeriesFilter] = useState(ALL_FILTER);
  const [focusedUnitId, setFocusedUnitId] = useState<string>(() => currentParty[0] ?? ownedUnitIds[0] ?? "basic");

  const partySet = useMemo(() => new Set(party), [party]);

  const ownedEntries = useMemo(() => {
    const entries: UnitCatalogEntry[] = [];
    for (const id of ownedUnitIds) {
      const entry = getCatalogEntry(id);
      if (entry) entries.push(entry);
    }
    if (seriesFilter !== ALL_FILTER) return entries.filter((entry) => entry.series === seriesFilter);
    return entries;
  }, [ownedUnitIds, seriesFilter]);

  const removeUnit = useCallback((id: string) => {
    setParty((prev) => prev.filter((unitId) => unitId !== id));
  }, []);

  const toggleUnit = useCallback((id: string) => {
    setFocusedUnitId(id);
    setParty((prev) => {
      if (prev.includes(id)) return prev.filter((unitId) => unitId !== id);
      if (prev.length >= MAX_PARTY) return prev;
      return [...prev, id];
    });
  }, []);

  const selectedEntry = getCatalogEntry(focusedUnitId) ?? getCatalogEntry(ownedUnitIds[0] ?? "basic");
  const selectedUpgrade = selectedEntry ? getUpgrade(saveData, selectedEntry.id) : { hpLevel: 0, atkLevel: 0 };
  const collectionRate = Math.round((ownedUnitIds.length / UNIT_CATALOG.length) * 100);
  const rarityCounts = useMemo(() => {
    return ownedUnitIds.reduce<Record<string, number>>((acc, unitId) => {
      const entry = getCatalogEntry(unitId);
      if (!entry) return acc;
      acc[entry.rarity] = (acc[entry.rarity] ?? 0) + 1;
      return acc;
    }, {});
  }, [ownedUnitIds]);

  const applyUpgrade = useCallback((type: "hpLevel" | "atkLevel") => {
    if (!selectedEntry) return;
    const current = getUpgrade(saveData, selectedEntry.id);
    const nextLevel = current[type] + 1;
    if (nextLevel > MAX_UPGRADE_LEVEL) return;
    const cost = getUpgradeCost(current[type]);
    if (cost == null || saveData.coins < cost) return;
    onSaveData({
      ...saveData,
      coins: saveData.coins - cost,
      unitUpgrades: {
        ...saveData.unitUpgrades,
        [selectedEntry.id]: {
          ...current,
          [type]: nextLevel,
        },
      },
    });
  }, [onSaveData, saveData, selectedEntry]);

  const slotEntries: (UnitCatalogEntry | null)[] = Array.from({ length: MAX_PARTY }, (_, index) =>
    party[index] ? getCatalogEntry(party[index]) ?? null : null,
  );

  const partyFull = party.length >= MAX_PARTY;
  const partyEmpty = party.length === 0;
  const gridCols = isMobile ? 3 : 5;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? "16px 10px 32px" : "32px 16px 48px",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          gap: 8,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#94a3b8",
            borderRadius: 8,
            padding: "8px 14px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ← 戻る
        </button>

        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? 18 : 24,
            fontWeight: 800,
            letterSpacing: 2,
            background: "linear-gradient(90deg, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          編成 / 図鑑 / 育成
        </h1>

        <button
          onClick={() => {
            if (!partyEmpty) onConfirm(party);
          }}
          disabled={partyEmpty}
          style={{
            background: partyEmpty ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #22d3ee, #818cf8)",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            cursor: partyEmpty ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: partyEmpty ? "#475569" : "#fff",
          }}
        >
          編成を保存
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 980, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr", gap: 16 }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {[
              { label: "所持ユニット", value: `${ownedUnitIds.length}/${UNIT_CATALOG.length}`, color: "#38bdf8" },
              { label: "図鑑達成率", value: `${collectionRate}%`, color: "#f59e0b" },
              { label: "編成数", value: `${party.length}/${MAX_PARTY}`, color: "#22d3ee" },
              { label: "所持コイン", value: `${saveData.coins}`, color: "#fbbf24" },
            ].map((item) => (
              <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "5px 8px" }}>
                <div style={{ fontSize: 8, color: "#94a3b8", marginBottom: 2, lineHeight: 1.1 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: item.color, lineHeight: 1.1 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {isMobile && selectedEntry && (
            <FocusedUnitPanel
              entry={selectedEntry}
              rarityLabel={RARITY_INFO[selectedEntry.rarity].label}
              rarityColor={RARITY_INFO[selectedEntry.rarity].color}
              saveData={saveData}
              selectedUpgrade={selectedUpgrade}
              applyUpgrade={applyUpgrade}
              rarityCounts={rarityCounts}
              sticky={false}
            />
          )}

          <div
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: isMobile ? "12px 10px" : "16px 20px",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span>パーティ</span>
              <span
                style={{
                  background: party.length >= MAX_PARTY ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.06)",
                  color: party.length >= MAX_PARTY ? "#22d3ee" : "#64748b",
                  borderRadius: 6,
                  padding: "2px 8px",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {party.length}/{MAX_PARTY}
              </span>
            </div>

            <div style={{ display: "flex", gap: isMobile ? 6 : 10, justifyContent: "center" }}>
              {slotEntries.map((entry, index) => (
                <PartySlot
                  key={index}
                  entry={entry}
                  index={index}
                  isMobile={isMobile}
                  onRemove={() => {
                    if (party[index]) removeUnit(party[index]);
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 4,
              WebkitOverflowScrolling: "touch",
            }}
          >
            {SERIES_TABS.map((series) => {
              const active = seriesFilter === series;
              return (
                <button
                  key={series}
                  onClick={() => setSeriesFilter(series)}
                  style={{
                    flexShrink: 0,
                    background: active ? "rgba(129,140,248,0.2)" : "rgba(255,255,255,0.04)",
                    border: active ? "1px solid #818cf8" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#c7d2fe" : "#64748b",
                    cursor: "pointer",
                  }}
                >
                  {series}
                </button>
              );
            })}
          </div>

          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: isMobile ? 8 : 12,
            }}
          >
            {ownedEntries.map((entry) => {
              const upgrade = getUpgrade(saveData, entry.id);
              return (
                <UnitCard
                  key={entry.id}
                  entry={entry}
                  inParty={partySet.has(entry.id)}
                  partyFull={partyFull}
                  isMobile={isMobile}
                  mastery={saveData.unitMastery[entry.id] ?? 0}
                  hpLevel={upgrade.hpLevel}
                  atkLevel={upgrade.atkLevel}
                  onToggle={() => toggleUnit(entry.id)}
                  onFocus={() => setFocusedUnitId(entry.id)}
                />
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {selectedEntry && (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "18px",
                position: "sticky",
                top: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <UnitIcon unitId={selectedEntry.id} color={selectedEntry.color} size={64} emoji={selectedEntry.emoji} />
                <div>
                  <div style={{ fontSize: 12, color: RARITY_INFO[selectedEntry.rarity].color, marginBottom: 4 }}>
                    {RARITY_INFO[selectedEntry.rarity].label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{selectedEntry.label}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{selectedEntry.series}</div>
                </div>
              </div>

              <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 16 }}>{selectedEntry.desc}</div>

              <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                <StatPill label="基礎HP" value={selectedEntry.hp} color="#34d399" />
                <StatPill label="育成後HP" value={Math.round(selectedEntry.hp * getHpMultiplier(selectedUpgrade.hpLevel))} color="#22c55e" />
                <StatPill label="基礎ATK" value={selectedEntry.atk} color="#f87171" />
                <StatPill label="育成後ATK" value={Math.round(selectedEntry.atk * getAtkMultiplier(selectedUpgrade.atkLevel))} color="#fb7185" />
                <StatPill label="熟練度" value={saveData.unitMastery[selectedEntry.id] ?? 0} color="#22d3ee" />
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { key: "hpLevel" as const, label: "HP強化", level: selectedUpgrade.hpLevel, color: "#22c55e" },
                  { key: "atkLevel" as const, label: "ATK強化", level: selectedUpgrade.atkLevel, color: "#f97316" },
                ].map((item) => {
                  const cost = getUpgradeCost(item.level);
                  const disabled = cost == null || saveData.coins < cost;
                  return (
                    <div key={item.key} style={{ border: "1px solid #334155", borderRadius: 12, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ color: item.color, fontWeight: 700 }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: "#cbd5e1" }}>Lv.{item.level}/{MAX_UPGRADE_LEVEL}</div>
                      </div>
                      <div style={{ height: 8, background: "#0f172a", borderRadius: 999, marginBottom: 10 }}>
                        <div
                          style={{
                            width: `${(item.level / MAX_UPGRADE_LEVEL) * 100}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: item.color,
                          }}
                        />
                      </div>
                      <button
                        disabled={disabled}
                        onClick={() => applyUpgrade(item.key)}
                        style={{
                          width: "100%",
                          background: disabled ? "#1e293b" : item.color,
                          color: disabled ? "#64748b" : "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "9px 12px",
                          cursor: disabled ? "not-allowed" : "pointer",
                          fontWeight: 700,
                        }}
                      >
                        {cost == null ? "最大まで強化済み" : `強化する - ${cost}コイン`}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 16, fontSize: 12, color: "#94a3b8" }}>
                レア数:
                {" "}
                C {rarityCounts.common ?? 0} / R {rarityCounts.rare ?? 0} / E {rarityCounts.epic ?? 0} / L {rarityCounts.legendary ?? 0}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
