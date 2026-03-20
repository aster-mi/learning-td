import { useState, useMemo, useCallback } from "react";
import {
  UNIT_CATALOG,
  getCatalogEntry,
  RARITY_INFO,
  SERIES_LIST,
  type UnitCatalogEntry,
} from "../data/unitCatalog";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  ownedUnitIds: string[];
  currentParty: string[];
  onConfirm: (party: string[]) => void;
  onBack: () => void;
}

const MAX_PARTY = 5;
const ALL_FILTER = "全て";
const SERIES_TABS = [ALL_FILTER, ...SERIES_LIST];

/* ── tiny stat label ─────────────────────────────────────── */
function StatPill({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      background: "rgba(255,255,255,0.06)", borderRadius: 4,
      padding: "1px 5px", fontSize: 10, color, whiteSpace: "nowrap",
    }}>
      <span style={{ opacity: 0.7 }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </span>
  );
}

/* ── party slot (top bar) ────────────────────────────────── */
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
        width: size, height: size + 18,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 2,
        background: entry ? rarity!.bg : "rgba(255,255,255,0.04)",
        border: entry
          ? `2px solid ${rarity!.border}`
          : "2px dashed rgba(255,255,255,0.12)",
        borderRadius: 10,
        cursor: entry ? "pointer" : "default",
        padding: 0,
        position: "relative",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: entry ? `0 0 12px ${rarity!.glow}` : "none",
        color: "#fff",
        flexShrink: 0,
      }}
      title={entry ? `${entry.label} を外す` : `スロット ${index + 1}`}
    >
      {entry ? (
        <>
          <span style={{ fontSize: isMobile ? 22 : 28, lineHeight: 1 }}>
            {entry.emoji}
          </span>
          <span style={{
            fontSize: isMobile ? 8 : 9, fontWeight: 600,
            maxWidth: size - 8, overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {entry.label}
          </span>
          <span style={{ fontSize: isMobile ? 7 : 8, color: rarity!.color, lineHeight: 1 }}>
            {rarity!.stars}
          </span>
          {/* remove hint */}
          <span style={{
            position: "absolute", top: -6, right: -6,
            background: "#ef4444", borderRadius: "50%",
            width: 16, height: 16, fontSize: 10, lineHeight: "16px",
            textAlign: "center", fontWeight: 700, color: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          }}>
            ×
          </span>
        </>
      ) : (
        <span style={{ fontSize: isMobile ? 20 : 26, opacity: 0.15 }}>＋</span>
      )}
    </button>
  );
}

/* ── unit card (grid) ────────────────────────────────────── */
function UnitCard({
  entry,
  inParty,
  partyFull,
  isMobile,
  onToggle,
}: {
  entry: UnitCatalogEntry;
  inParty: boolean;
  partyFull: boolean;
  isMobile: boolean;
  onToggle: () => void;
}) {
  const rarity = RARITY_INFO[entry.rarity];
  const disabled = !inParty && partyFull;

  return (
    <button
      onClick={disabled ? undefined : onToggle}
      style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 4,
        background: rarity.bg,
        border: `2px solid ${inParty ? "#22d3ee" : rarity.border}`,
        borderRadius: 12,
        padding: isMobile ? "10px 6px 8px" : "14px 10px 10px",
        cursor: disabled ? "not-allowed" : "pointer",
        color: "#fff",
        opacity: disabled ? 0.4 : 1,
        transition: "transform 0.12s, box-shadow 0.15s, opacity 0.2s",
        boxShadow: inParty
          ? `0 0 16px rgba(34,211,238,0.35), inset 0 0 20px rgba(34,211,238,0.08)`
          : `0 0 10px ${rarity.glow}`,
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* rarity stars */}
      <span style={{
        position: "absolute", top: 4, right: 6,
        fontSize: isMobile ? 8 : 9, color: rarity.color, opacity: 0.9,
      }}>
        {rarity.stars}
      </span>

      {/* emoji */}
      <span style={{
        fontSize: isMobile ? 32 : 40, lineHeight: 1,
        filter: disabled ? "grayscale(0.8)" : "none",
      }}>
        {entry.emoji}
      </span>

      {/* name */}
      <span style={{
        fontSize: isMobile ? 11 : 13, fontWeight: 700,
        whiteSpace: "nowrap", overflow: "hidden",
        textOverflow: "ellipsis", maxWidth: "100%",
      }}>
        {entry.label}
      </span>

      {/* stats row */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 3,
        justifyContent: "center", marginTop: 2,
      }}>
        <StatPill label="HP" value={entry.hp} color="#34d399" />
        <StatPill label="ATK" value={entry.atk} color="#f87171" />
        <StatPill label="SPD" value={entry.speed} color="#60a5fa" />
        <StatPill label="RNG" value={entry.range} color="#c084fc" />
        <StatPill label="COST" value={entry.cost} color="#fbbf24" />
      </div>

      {/* checkmark overlay */}
      {inParty && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(34,211,238,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 10,
          pointerEvents: "none",
        }}>
          <span style={{
            position: "absolute", top: 4, left: 6,
            background: "#22d3ee", color: "#0f172a",
            borderRadius: "50%", width: 20, height: 20,
            fontSize: 13, lineHeight: "20px", textAlign: "center",
            fontWeight: 900, boxShadow: "0 2px 8px rgba(34,211,238,0.4)",
          }}>
            ✓
          </span>
        </div>
      )}
    </button>
  );
}

/* ── main component ──────────────────────────────────────── */
export function PartySelect({ ownedUnitIds, currentParty, onConfirm, onBack }: Props) {
  const { isMobile } = useWindowSize();
  const [party, setParty] = useState<string[]>(() => [...currentParty]);
  const [seriesFilter, setSeriesFilter] = useState(ALL_FILTER);

  const partySet = useMemo(() => new Set(party), [party]);

  /* owned entries, filtered */
  const ownedEntries = useMemo(() => {
    const entries: UnitCatalogEntry[] = [];
    for (const id of ownedUnitIds) {
      const e = getCatalogEntry(id);
      if (e) entries.push(e);
    }
    if (seriesFilter !== ALL_FILTER) {
      return entries.filter(e => e.series === seriesFilter);
    }
    return entries;
  }, [ownedUnitIds, seriesFilter]);

  const addUnit = useCallback((id: string) => {
    setParty(prev => {
      if (prev.length >= MAX_PARTY || prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const removeUnit = useCallback((id: string) => {
    setParty(prev => prev.filter(u => u !== id));
  }, []);

  const toggleUnit = useCallback((id: string) => {
    setParty(prev => {
      if (prev.includes(id)) return prev.filter(u => u !== id);
      if (prev.length >= MAX_PARTY) return prev;
      return [...prev, id];
    });
  }, []);

  const partyFull = party.length >= MAX_PARTY;
  const partyEmpty = party.length === 0;

  /* build party slot entries (always 5 slots) */
  const slotEntries: (UnitCatalogEntry | null)[] = Array.from({ length: MAX_PARTY }, (_, i) =>
    party[i] ? getCatalogEntry(party[i]) ?? null : null,
  );

  const gridCols = isMobile ? 3 : 5;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: isMobile ? "16px 10px 32px" : "32px 16px 48px",
      color: "#fff",
    }}>
      {/* ── header bar ─────────────────────── */}
      <div style={{
        width: "100%", maxWidth: 700,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16, gap: 8,
      }}>
        <button onClick={onBack} style={{
          background: "#1e293b", border: "1px solid #334155", color: "#94a3b8",
          borderRadius: 8, padding: "8px 14px", cursor: "pointer",
          fontSize: 13, fontWeight: 600,
          transition: "background 0.15s",
        }}>
          ← 戻る
        </button>

        <h1 style={{
          margin: 0, fontSize: isMobile ? 18 : 24, fontWeight: 800,
          letterSpacing: 2, textShadow: "0 2px 12px rgba(129,140,248,0.3)",
          background: "linear-gradient(90deg, #818cf8, #c084fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          出陣編成
        </h1>

        <button
          onClick={() => { if (!partyEmpty) onConfirm(party); }}
          disabled={partyEmpty}
          style={{
            background: partyEmpty
              ? "rgba(255,255,255,0.06)"
              : "linear-gradient(135deg, #22d3ee, #818cf8)",
            border: "none",
            borderRadius: 8, padding: "8px 18px",
            cursor: partyEmpty ? "not-allowed" : "pointer",
            fontSize: 13, fontWeight: 700,
            color: partyEmpty ? "#475569" : "#fff",
            boxShadow: partyEmpty ? "none" : "0 4px 16px rgba(34,211,238,0.3)",
            transition: "all 0.2s",
          }}
        >
          出陣 →
        </button>
      </div>

      {/* ── party slots ────────────────────── */}
      <div style={{
        width: "100%", maxWidth: 700,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: isMobile ? "12px 10px" : "16px 20px",
        marginBottom: 16,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: "#94a3b8",
          marginBottom: 8, display: "flex", alignItems: "center", gap: 6,
        }}>
          <span>パーティ</span>
          <span style={{
            background: party.length >= MAX_PARTY
              ? "rgba(34,211,238,0.15)"
              : "rgba(255,255,255,0.06)",
            color: party.length >= MAX_PARTY ? "#22d3ee" : "#64748b",
            borderRadius: 6, padding: "2px 8px",
            fontWeight: 800, fontSize: 12,
            transition: "all 0.2s",
          }}>
            {party.length}/{MAX_PARTY}
          </span>
        </div>

        <div style={{
          display: "flex", gap: isMobile ? 6 : 10,
          justifyContent: "center",
        }}>
          {slotEntries.map((entry, i) => (
            <PartySlot
              key={i}
              entry={entry}
              index={i}
              isMobile={isMobile}
              onRemove={() => { if (party[i]) removeUnit(party[i]); }}
            />
          ))}
        </div>
      </div>

      {/* ── series filter tabs ─────────────── */}
      <div style={{
        width: "100%", maxWidth: 700,
        display: "flex", gap: 6, marginBottom: 16,
        overflowX: "auto", paddingBottom: 4,
        WebkitOverflowScrolling: "touch",
      }}>
        {SERIES_TABS.map(s => {
          const active = seriesFilter === s;
          return (
            <button key={s} onClick={() => setSeriesFilter(s)} style={{
              flexShrink: 0,
              background: active
                ? "rgba(129,140,248,0.2)"
                : "rgba(255,255,255,0.04)",
              border: active
                ? "1px solid #818cf8"
                : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12, fontWeight: active ? 700 : 500,
              color: active ? "#c7d2fe" : "#64748b",
              cursor: "pointer",
              transition: "all 0.15s",
            }}>
              {s}
            </button>
          );
        })}
      </div>

      {/* ── unit grid ──────────────────────── */}
      <div style={{
        width: "100%", maxWidth: 700,
        display: "grid",
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: isMobile ? 8 : 12,
      }}>
        {ownedEntries.map(entry => (
          <UnitCard
            key={entry.id}
            entry={entry}
            inParty={partySet.has(entry.id)}
            partyFull={partyFull}
            isMobile={isMobile}
            onToggle={() => toggleUnit(entry.id)}
          />
        ))}
      </div>

      {/* empty state */}
      {ownedEntries.length === 0 && (
        <div style={{
          marginTop: 48, textAlign: "center",
          color: "#475569", fontSize: 14,
        }}>
          <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>📭</span>
          {seriesFilter === ALL_FILTER
            ? "ユニットを所持していません"
            : `「${seriesFilter}」シリーズのユニットを所持していません`}
        </div>
      )}
    </div>
  );
}
