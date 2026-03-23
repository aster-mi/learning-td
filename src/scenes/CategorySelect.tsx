import { useMemo, useState } from "react";
import { QUESTION_STATS_BY_SUB } from "../data/questionStats";
import {
  LEVEL_ALL,
  LEVEL_DEFS,
  MAIN_CATEGORY_META,
  MAIN_CATEGORY_ORDER,
  SUB_CATEGORIES,
  type MainCategory,
} from "../data/questionMeta";
import { APP_VERSION } from "../data/releaseNotes";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  initialSelected: string[];
  initialLevel: number;
  onConfirm: (selected: string[], level: number) => void;
  wrongCount: number;
  onReview: () => void;
  onReleaseNotes: () => void;
}

export function CategorySelect({
  initialSelected,
  initialLevel,
  onConfirm,
  wrongCount,
  onReview,
  onReleaseNotes,
}: Props) {
  const { isMobile } = useWindowSize();
  const allSubs = SUB_CATEGORIES.map((subCategory) => subCategory.name);

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialSelected.length > 0 ? initialSelected : allSubs),
  );
  const [level, setLevel] = useState<number>(initialLevel > 0 ? initialLevel : LEVEL_ALL);
  const [openMain, setOpenMain] = useState<Set<MainCategory>>(() => new Set());

  const visibleQuestionCount = useMemo(() => {
    return [...selected].reduce((total, subName) => {
      const stats = QUESTION_STATS_BY_SUB[subName];
      if (!stats) return total;

      if (level === LEVEL_ALL) return total + stats.total;

      let count = 0;
      for (const [levelKey, levelCount] of Object.entries(stats.byLevel)) {
        if (Number(levelKey) <= level) count += levelCount ?? 0;
      }
      return total + count;
    }, 0);
  }, [level, selected]);

  const toggleSub = (subName: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(subName)) next.delete(subName);
      else next.add(subName);
      return next;
    });
  };

  const toggleMain = (main: MainCategory) => {
    const subs = SUB_CATEGORIES.filter((subCategory) => subCategory.main === main).map((subCategory) => subCategory.name);
    const allOn = subs.every((subName) => selected.has(subName));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOn) subs.forEach((subName) => next.delete(subName));
      else subs.forEach((subName) => next.add(subName));
      return next;
    });
  };

  const toggleOpen = (main: MainCategory) => {
    setOpenMain((prev) => {
      const next = new Set(prev);
      if (next.has(main)) next.delete(main);
      else next.add(main);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === allSubs.length) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(allSubs));
  };

  const isAllSelected = selected.size === allSubs.length;
  const isEmpty = selected.size === 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? "24px 12px 60px" : "40px 16px 60px",
        color: "#fff",
      }}
    >
      {!isMobile && (
        <div style={{ fontSize: 13, color: "#94a3b8", letterSpacing: 2, marginBottom: 8 }}>
          LEARNING BATTLE CATS
        </div>
      )}
      <h1 style={{ margin: "0 0 6px", fontSize: isMobile ? 20 : 24, fontWeight: "bold" }}>問題選択</h1>
      <p
        style={{
          color: "#94a3b8",
          marginBottom: isMobile ? 14 : 20,
          textAlign: "center",
          lineHeight: 1.6,
          maxWidth: 440,
          fontSize: isMobile ? 13 : 14,
        }}
      >
        遊びたい難易度とカテゴリを選んでください。
      </p>

      <div style={{ width: "100%", maxWidth: 500 }}>
        <div
          style={{
            marginBottom: 18,
            padding: isMobile ? "12px" : "14px 16px",
            background: "#0d1a2a",
            borderRadius: 10,
            border: "1px solid #1e293b",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: "bold", color: "#94a3b8", marginBottom: 10, letterSpacing: 1 }}>
            難易度
          </div>
          <select
            value={level}
            onChange={(event) => setLevel(Number(event.target.value))}
            style={{
              width: "100%",
              padding: isMobile ? "10px 12px" : "11px 14px",
              background: "#1e293b",
              color: "#f1f5f9",
              border: `2px solid ${
                level === LEVEL_ALL ? "#a78bfa" : LEVEL_DEFS.find((def) => def.level === level)?.color ?? "#334155"
              }`,
              borderRadius: 8,
              fontSize: 15,
              cursor: "pointer",
              outline: "none",
              appearance: "auto",
            }}
          >
            <option value={LEVEL_ALL} style={{ background: "#1e293b" }}>
              すべて
            </option>
            {LEVEL_DEFS.map((levelDef) => (
              <option key={levelDef.level} value={levelDef.level} style={{ background: "#1e293b" }}>
                {levelDef.emoji} {levelDef.label}まで
              </option>
            ))}
          </select>
          <div style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>
            {level === LEVEL_ALL
              ? `選択カテゴリの問題数: ${visibleQuestionCount}問`
              : `${LEVEL_DEFS.find((def) => def.level === level)?.label ?? ""}以下の問題数: ${visibleQuestionCount}問`}
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: "bold", color: "#94a3b8", marginBottom: 8, letterSpacing: 1 }}>
          カテゴリ
        </div>
        <button
          onClick={toggleAll}
          style={{
            width: "100%",
            marginBottom: 12,
            padding: "9px",
            background: isAllSelected ? "#1e40af" : "#1e293b",
            border: `2px solid ${isAllSelected ? "#3b82f6" : "#334155"}`,
            borderRadius: 8,
            color: "#f1f5f9",
            fontWeight: "bold",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {isAllSelected ? "すべて選択中" : "すべて選択する"}
        </button>

        {MAIN_CATEGORY_ORDER.map((main) => {
          const meta = MAIN_CATEGORY_META[main];
          const subs = SUB_CATEGORIES.filter((subCategory) => subCategory.main === main);
          const allOn = subs.every((subCategory) => selected.has(subCategory.name));
          const someOn = subs.some((subCategory) => selected.has(subCategory.name));
          const isOpen = openMain.has(main);

          return (
            <div key={main} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: someOn ? `${meta.color}18` : "#0f172a",
                  border: `2px solid ${someOn ? meta.color : "#1e293b"}`,
                  borderRadius: isOpen ? "8px 8px 0 0" : 8,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => toggleMain(main)}
                  style={{
                    padding: "12px 14px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: 1,
                    color: allOn ? meta.color : someOn ? "#94a3b8" : "#475569",
                  }}
                  title="このカテゴリ全体をON/OFF"
                >
                  {allOn ? "■" : someOn ? "▲" : "□"}
                </button>

                <button
                  onClick={() => toggleOpen(main)}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#f1f5f9",
                  }}
                >
                  <span style={{ fontSize: 18, marginRight: 8 }}>{meta.emoji}</span>
                  <span style={{ fontWeight: "bold", fontSize: 15, color: someOn ? meta.color : "#94a3b8" }}>{main}</span>
                  <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>
                    ({subs.filter((subCategory) => selected.has(subCategory.name)).length}/{subs.length})
                  </span>
                </button>

                <button
                  onClick={() => toggleOpen(main)}
                  style={{
                    padding: "12px 14px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    fontSize: 14,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  ▼
                </button>
              </div>

              {isOpen && (
                <div
                  style={{
                    background: "#0d1a2a",
                    borderLeft: `2px solid ${someOn ? meta.color : "#1e293b"}`,
                    borderRight: `2px solid ${someOn ? meta.color : "#1e293b"}`,
                    borderBottom: `2px solid ${someOn ? meta.color : "#1e293b"}`,
                    borderTop: "none",
                    borderRadius: "0 0 8px 8px",
                    overflow: "hidden",
                  }}
                >
                  {subs.map((subCategory, index) => {
                    const isOn = selected.has(subCategory.name);
                    const stats = QUESTION_STATS_BY_SUB[subCategory.name];
                    const minDef = LEVEL_DEFS.find((def) => def.level === stats?.minLevel);
                    const maxDef = LEVEL_DEFS.find((def) => def.level === stats?.maxLevel);

                    return (
                      <button
                        key={subCategory.name}
                        onClick={() => toggleSub(subCategory.name)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 16px",
                          background: isOn ? `${subCategory.color}12` : "transparent",
                          border: "none",
                          borderTop: index > 0 ? "1px solid #1e293b" : "none",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                      >
                        <span style={{ fontSize: 15, color: isOn ? "#22c55e" : "#475569" }}>{isOn ? "■" : "□"}</span>
                        <span style={{ fontSize: 16 }}>{subCategory.emoji}</span>
                        <div>
                          <div style={{ fontWeight: "bold", fontSize: 14, color: isOn ? subCategory.color : "#94a3b8" }}>
                            {subCategory.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#475569" }}>{subCategory.desc}</div>
                        </div>
                        <div
                          style={{
                            marginLeft: "auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: 3,
                          }}
                        >
                          {stats && minDef && maxDef && (
                            <span
                              style={{
                                fontSize: 10,
                                padding: "1px 5px",
                                background: "#1e293b",
                                color: "#94a3b8",
                                borderRadius: 4,
                                border: "1px solid #334155",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {stats.minLevel === stats.maxLevel ? `${minDef.emoji} ${minDef.label}` : `${minDef.emoji} - ${maxDef.emoji}`}
                            </span>
                          )}
                          <span style={{ fontSize: 11, color: "#475569" }}>{stats?.total ?? 0}問</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: isEmpty ? "#ef4444" : "#64748b", textAlign: "center", maxWidth: 500 }}>
        {isEmpty
          ? "カテゴリを1つ以上選択してください"
          : `選択中: ${[...selected]
              .map((name) => {
                const def = SUB_CATEGORIES.find((subCategory) => subCategory.name === name);
                return def ? `${def.emoji}${name}` : name;
              })
              .join("  ")}`}
      </div>

      {wrongCount > 0 && (
        <button
          onClick={onReview}
          style={{
            marginTop: 20,
            padding: "12px 32px",
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            color: "#fff",
            border: "2px solid #f9731688",
            borderRadius: 10,
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 4px 16px #ef444444",
            transition: "transform 0.1s",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "scale(1.04)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "scale(1)";
          }}
        >
          間違えた問題を復習
          <span
            style={{
              background: "#fff3",
              padding: "2px 8px",
              borderRadius: 12,
              fontSize: 13,
            }}
          >
            {wrongCount}問
          </span>
        </button>
      )}

      <button
        onClick={() => {
          if (!isEmpty) onConfirm([...selected], level);
        }}
        disabled={isEmpty}
        style={{
          marginTop: wrongCount > 0 ? 10 : 20,
          padding: "14px 48px",
          background: isEmpty ? "#334155" : "#3b82f6",
          color: isEmpty ? "#64748b" : "#fff",
          border: "none",
          borderRadius: 10,
          fontWeight: "bold",
          fontSize: 18,
          cursor: isEmpty ? "not-allowed" : "pointer",
          boxShadow: isEmpty ? "none" : "0 4px 16px #3b82f644",
          transition: "all 0.2s",
        }}
        onMouseEnter={(event) => {
          if (!isEmpty) event.currentTarget.style.transform = "scale(1.04)";
        }}
        onMouseLeave={(event) => {
          if (!isEmpty) event.currentTarget.style.transform = "scale(1)";
        }}
      >
        ステージ選択へ
      </button>
      <button
        onClick={onReleaseNotes}
        style={{
          position: "fixed",
          right: isMobile ? 12 : 20,
          bottom: isMobile ? 12 : 20,
          minWidth: 36,
          minHeight: 36,
          padding: "8px 12px",
          background: "rgba(15, 23, 42, 0.88)",
          color: "#94a3b8",
          border: "1px solid #334155",
          borderRadius: 999,
          fontSize: 12,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(6px)",
        }}
        aria-label={`バージョン ${APP_VERSION} のリリースノートを開く`}
      >
        v{APP_VERSION}
      </button>
    </div>
  );
}
