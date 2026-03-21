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

type DetailTab = "info" | "upgrade";

/* ── sub-components ─────────────────────────────────────── */

function PartySlot({
  entry,
  index,
  isMobile,
  isSelected,
  onRemove,
  onFocus,
}: {
  entry: UnitCatalogEntry | null;
  index: number;
  isMobile: boolean;
  isSelected: boolean;
  onRemove: () => void;
  onFocus: () => void;
}) {
  const size = isMobile ? 48 : 56;
  const rarity = entry ? RARITY_INFO[entry.rarity] : null;

  return (
    <button
      onClick={entry ? onFocus : undefined}
      onContextMenu={(e) => { e.preventDefault(); if (entry) onRemove(); }}
      style={{
        width: size,
        height: size + 14,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        background: entry ? rarity!.bg : "rgba(255,255,255,0.03)",
        border: entry
          ? `2px solid ${isSelected ? "#22d3ee" : rarity!.border}`
          : "2px dashed rgba(255,255,255,0.1)",
        borderRadius: 10,
        cursor: entry ? "pointer" : "default",
        padding: 0,
        position: "relative",
        color: "#fff",
        flexShrink: 0,
        boxShadow: isSelected ? "0 0 12px rgba(34,211,238,0.4)" : "none",
      }}
      title={entry ? `クリックで詳細 / 右クリックで外す` : `スロット ${index + 1}`}
    >
      {entry ? (
        <>
          <UnitIcon unitId={entry.id} color={entry.color} size={isMobile ? 28 : 34} emoji={entry.emoji} />
          <span style={{ fontSize: isMobile ? 7 : 8, fontWeight: 600, maxWidth: size - 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {entry.label}
          </span>
          <span style={{ fontSize: 7, color: rarity!.color, lineHeight: 1 }}>{rarity!.stars}</span>
          <span
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            style={{
              position: "absolute", top: -5, right: -5,
              background: "#ef4444", borderRadius: "50%",
              width: 14, height: 14, fontSize: 9, lineHeight: "14px",
              textAlign: "center", fontWeight: 700, color: "#fff", cursor: "pointer",
            }}
          >
            ×
          </span>
        </>
      ) : (
        <span style={{ fontSize: isMobile ? 16 : 20, opacity: 0.12 }}>＋</span>
      )}
    </button>
  );
}

function UnitCard({
  entry,
  inParty,
  partyFull,
  isMobile,
  isSelected,
  onToggle,
  onFocus,
}: {
  entry: UnitCatalogEntry;
  inParty: boolean;
  partyFull: boolean;
  isMobile: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onFocus: () => void;
}) {
  const rarity = RARITY_INFO[entry.rarity];
  const disabled = !inParty && partyFull;

  return (
    <button
      onClick={disabled ? onFocus : onToggle}
      onContextMenu={(e) => { e.preventDefault(); onFocus(); }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        background: rarity.bg,
        border: `2px solid ${isSelected ? "#22d3ee" : inParty ? "#22d3ee88" : rarity.border}`,
        borderRadius: 10,
        padding: isMobile ? "8px 4px 6px" : "10px 6px 8px",
        cursor: disabled ? "default" : "pointer",
        color: "#fff",
        opacity: disabled ? 0.35 : 1,
        boxShadow: isSelected ? "0 0 14px rgba(34,211,238,0.3)" : `0 0 6px ${rarity.glow}`,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <span style={{ position: "absolute", top: 2, right: 4, fontSize: 7, color: rarity.color }}>
        {rarity.stars}
      </span>
      {inParty && (
        <span style={{ position: "absolute", top: 2, left: 4, fontSize: 7, color: "#22d3ee", fontWeight: 800 }}>
          IN
        </span>
      )}

      <UnitIcon unitId={entry.id} color={entry.color} size={isMobile ? 34 : 44} emoji={entry.emoji} />

      <span style={{
        fontSize: isMobile ? 9 : 11, fontWeight: 700,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%",
      }}>
        {entry.label}
      </span>

      <div style={{ display: "flex", gap: 4, fontSize: 9, color: "#94a3b8" }}>
        <span style={{ color: "#34d399" }}>HP{entry.hp}</span>
        <span style={{ color: "#f87171" }}>AT{entry.atk}</span>
      </div>
    </button>
  );
}

/* ── detail panel ───────────────────────────────────────── */

function DetailPanel({
  entry,
  saveData,
  isMobile,
  applyUpgrade,
}: {
  entry: UnitCatalogEntry;
  saveData: SaveData;
  isMobile: boolean;
  applyUpgrade: (type: "hpLevel" | "atkLevel") => void;
}) {
  const [tab, setTab] = useState<DetailTab>("info");
  const rarity = RARITY_INFO[entry.rarity];
  const upgrade = getUpgrade(saveData, entry.id);
  const mastery = saveData.unitMastery[entry.id] ?? 0;
  const masteryLevel = Math.min(10, Math.floor(mastery / 25));

  return (
    <div
      style={{
        background: "rgba(15,23,42,0.85)",
        border: "1px solid #334155",
        borderRadius: 16,
        overflow: "hidden",
        ...(isMobile ? {} : { position: "sticky" as const, top: 16 }),
      }}
    >
      {/* unit header */}
      <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 12 }}>
        <UnitIcon unitId={entry.id} color={entry.color} size={isMobile ? 48 : 56} emoji={entry.emoji} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: rarity.color, fontWeight: 700 }}>{rarity.label}</span>
            <span style={{ fontSize: 10, color: "#64748b" }}>{entry.series}</span>
          </div>
          <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, marginTop: 2 }}>{entry.label}</div>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #334155" }}>
        {[
          { key: "info" as const, label: "情報" },
          { key: "upgrade" as const, label: "育成" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: "8px 0",
              background: "transparent",
              border: "none",
              borderBottom: tab === t.key ? "2px solid #818cf8" : "2px solid transparent",
              color: tab === t.key ? "#fff" : "#64748b",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* tab content */}
      <div style={{ padding: "12px 16px 16px" }}>
        {tab === "info" ? (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}>{entry.desc}</div>

            {/* stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "HP", base: entry.hp, boosted: Math.round(entry.hp * getHpMultiplier(upgrade.hpLevel)), color: "#34d399", lv: upgrade.hpLevel },
                { label: "ATK", base: entry.atk, boosted: Math.round(entry.atk * getAtkMultiplier(upgrade.atkLevel)), color: "#f87171", lv: upgrade.atkLevel },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.boosted}</span>
                    {s.lv > 0 && <span style={{ fontSize: 10, color: "#64748b" }}>({s.base}+{s.boosted - s.base})</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* mastery */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
                <span>熟練度</span>
                <span style={{ color: "#22d3ee", fontWeight: 700 }}>Lv.{masteryLevel} ({mastery}pt)</span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,0.06)" }}>
                <div
                  style={{
                    width: `${Math.min(100, mastery % 250 === 0 && mastery > 0 ? 100 : ((mastery % 250) / 250) * 100)}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "#22d3ee",
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(251,191,36,0.1)", borderRadius: 8, padding: "6px 10px",
              fontSize: 12, color: "#fbbf24",
            }}>
              <span>所持コイン</span>
              <span style={{ fontWeight: 800 }}>{saveData.coins}</span>
            </div>

            {[
              { key: "hpLevel" as const, label: "HP強化", level: upgrade.hpLevel, color: "#22c55e", icon: "♥" },
              { key: "atkLevel" as const, label: "ATK強化", level: upgrade.atkLevel, color: "#f97316", icon: "⚔" },
            ].map((item) => {
              const cost = getUpgradeCost(item.level);
              const disabled = cost == null || saveData.coins < cost;
              const isMax = cost == null;
              return (
                <div key={item.key} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: item.color }}>{item.icon}</span>
                      <span style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      Lv.{item.level}<span style={{ color: "#475569" }}>/{MAX_UPGRADE_LEVEL}</span>
                    </span>
                  </div>
                  <div style={{ height: 6, background: "rgba(0,0,0,0.3)", borderRadius: 999, marginBottom: 8 }}>
                    <div
                      style={{
                        width: `${(item.level / MAX_UPGRADE_LEVEL) * 100}%`,
                        height: "100%", borderRadius: 999,
                        background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <button
                    disabled={disabled}
                    onClick={() => applyUpgrade(item.key)}
                    style={{
                      width: "100%",
                      background: isMax ? "#1e293b" : disabled ? "#1e293b" : item.color,
                      color: isMax ? "#4ade80" : disabled ? "#64748b" : "#fff",
                      border: isMax ? `1px solid ${item.color}44` : "none",
                      borderRadius: 8,
                      padding: "7px 10px",
                      cursor: disabled ? "default" : "pointer",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {isMax ? "MAX" : `強化 −${cost} コイン`}
                  </button>
                </div>
              );
            })}

            {/* stat preview */}
            <div style={{ fontSize: 11, color: "#64748b", textAlign: "center", marginTop: 4 }}>
              HP {entry.hp} → {Math.round(entry.hp * getHpMultiplier(upgrade.hpLevel))}
              {" / "}
              ATK {entry.atk} → {Math.round(entry.atk * getAtkMultiplier(upgrade.atkLevel))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── main ────────────────────────────────────────────────── */

export function PartySelect({ ownedUnitIds, currentParty, saveData, onConfirm, onSaveData, onBack }: Props) {
  const { isMobile } = useWindowSize();
  const [party, setParty] = useState<string[]>(() => [...currentParty]);
  const [seriesFilter, setSeriesFilter] = useState(ALL_FILTER);
  const [focusedUnitId, setFocusedUnitId] = useState<string>(() => currentParty[0] ?? ownedUnitIds[0] ?? "basic");
  const [showDetail, setShowDetail] = useState(false);

  const partySet = useMemo(() => new Set(party), [party]);

  const ownedEntries = useMemo(() => {
    const entries: UnitCatalogEntry[] = [];
    for (const id of ownedUnitIds) {
      const entry = getCatalogEntry(id);
      if (entry) entries.push(entry);
    }
    if (seriesFilter !== ALL_FILTER) return entries.filter((e) => e.series === seriesFilter);
    return entries;
  }, [ownedUnitIds, seriesFilter]);

  const removeUnit = useCallback((id: string) => {
    setParty((prev) => prev.filter((uid) => uid !== id));
  }, []);

  const toggleUnit = useCallback((id: string) => {
    setFocusedUnitId(id);
    setParty((prev) => {
      if (prev.includes(id)) return prev.filter((uid) => uid !== id);
      if (prev.length >= MAX_PARTY) return prev;
      return [...prev, id];
    });
  }, []);

  const focusUnit = useCallback((id: string) => {
    setFocusedUnitId(id);
    setShowDetail(true);
  }, []);

  const selectedEntry = getCatalogEntry(focusedUnitId) ?? getCatalogEntry(ownedUnitIds[0] ?? "basic");

  const collectionRate = Math.round((ownedUnitIds.length / UNIT_CATALOG.length) * 100);

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
        [selectedEntry.id]: { ...current, [type]: nextLevel },
      },
    });
  }, [onSaveData, saveData, selectedEntry]);

  const slotEntries: (UnitCatalogEntry | null)[] = Array.from({ length: MAX_PARTY }, (_, i) =>
    party[i] ? getCatalogEntry(party[i]) ?? null : null,
  );

  const partyFull = party.length >= MAX_PARTY;
  const partyEmpty = party.length === 0;
  const gridCols = isMobile ? 4 : 6;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? "12px 8px 28px" : "24px 16px 40px",
        color: "#fff",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1060, display: "grid", gap: 12 }}>
        {/* ── header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={onBack}
            style={{
              background: "#1e293b", border: "1px solid #334155", color: "#94a3b8",
              borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13,
            }}
          >
            戻る
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <div style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid #334155", borderRadius: 999,
              padding: "4px 10px", fontSize: 11, color: "#94a3b8",
            }}>
              図鑑 <span style={{ color: "#f59e0b", fontWeight: 700 }}>{collectionRate}%</span>
              <span style={{ margin: "0 6px", color: "#334155" }}>|</span>
              <span style={{ color: "#fbbf24" }}>🪙 {saveData.coins}</span>
            </div>
            <button
              onClick={() => { if (!partyEmpty) onConfirm(party); }}
              disabled={partyEmpty}
              style={{
                background: partyEmpty ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #22d3ee, #818cf8)",
                border: "none", borderRadius: 8, padding: "7px 16px",
                cursor: partyEmpty ? "default" : "pointer",
                fontSize: 13, fontWeight: 700,
                color: partyEmpty ? "#475569" : "#fff",
              }}
            >
              保存
            </button>
          </div>
        </div>

        {/* ── party slots ── */}
        <div
          style={{
            background: "rgba(15,23,42,0.7)",
            border: "1px solid #334155",
            borderRadius: 14,
            padding: isMobile ? "10px" : "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 6 : 10,
          }}
        >
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, writingMode: isMobile ? undefined : "vertical-rl", flexShrink: 0 }}>
            {isMobile ? `${party.length}/${MAX_PARTY}` : `PARTY ${party.length}/${MAX_PARTY}`}
          </div>
          <div style={{ display: "flex", gap: isMobile ? 4 : 8, justifyContent: "center", flex: 1 }}>
            {slotEntries.map((entry, index) => (
              <PartySlot
                key={index}
                entry={entry}
                index={index}
                isMobile={isMobile}
                isSelected={entry?.id === focusedUnitId}
                onRemove={() => { if (party[index]) removeUnit(party[index]); }}
                onFocus={() => { if (entry) focusUnit(entry.id); }}
              />
            ))}
          </div>
        </div>

        {/* ── main content ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : (showDetail && selectedEntry ? "1fr 280px" : "1fr"),
            gap: 12,
            alignItems: "start",
          }}
        >
          {/* left: grid */}
          <div style={{ display: "grid", gap: 10 }}>
            {/* series filter */}
            <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2, WebkitOverflowScrolling: "touch" }}>
              {SERIES_TABS.map((series) => {
                const active = seriesFilter === series;
                return (
                  <button
                    key={series}
                    onClick={() => setSeriesFilter(series)}
                    style={{
                      flexShrink: 0,
                      background: active ? "rgba(129,140,248,0.18)" : "rgba(255,255,255,0.03)",
                      border: active ? "1px solid #818cf8" : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8, padding: "5px 12px",
                      fontSize: 11, fontWeight: active ? 700 : 500,
                      color: active ? "#c7d2fe" : "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    {series}
                  </button>
                );
              })}
            </div>

            {/* unit grid */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: isMobile ? 6 : 8 }}>
              {ownedEntries.map((entry) => (
                <UnitCard
                  key={entry.id}
                  entry={entry}
                  inParty={partySet.has(entry.id)}
                  partyFull={partyFull}
                  isMobile={isMobile}
                  isSelected={entry.id === focusedUnitId && showDetail}
                  onToggle={() => toggleUnit(entry.id)}
                  onFocus={() => focusUnit(entry.id)}
                />
              ))}
            </div>
          </div>

          {/* right: detail panel (desktop) */}
          {!isMobile && showDetail && selectedEntry && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowDetail(false)}
                style={{
                  position: "absolute", top: 8, right: 8, zIndex: 1,
                  background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6,
                  width: 24, height: 24, color: "#94a3b8", cursor: "pointer",
                  fontSize: 14, lineHeight: "24px", textAlign: "center",
                }}
              >
                ×
              </button>
              <DetailPanel entry={selectedEntry} saveData={saveData} isMobile={false} applyUpgrade={applyUpgrade} />
            </div>
          )}
        </div>

        {/* mobile detail panel (bottom sheet style) */}
        {isMobile && showDetail && selectedEntry && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowDetail(false)}
              style={{
                position: "absolute", top: 8, right: 8, zIndex: 1,
                background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6,
                width: 24, height: 24, color: "#94a3b8", cursor: "pointer",
                fontSize: 14, lineHeight: "24px", textAlign: "center",
              }}
            >
              ×
            </button>
            <DetailPanel entry={selectedEntry} saveData={saveData} isMobile={true} applyUpgrade={applyUpgrade} />
          </div>
        )}
      </div>
    </div>
  );
}
