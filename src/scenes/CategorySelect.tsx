import { useState } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { MAIN_CATEGORY_META, SUB_CATEGORIES, type MainCategory } from "../data/questions";

interface Props {
  initialSelected: string[];       // sub名のリスト
  onConfirm: (selected: string[]) => void;
}

// メインカテゴリの順序
const MAIN_ORDER: MainCategory[] = ["算数", "国語", "理科", "社会", "英語", "プログラミング"];

export function CategorySelect({ initialSelected, onConfirm }: Props) {
  const { isMobile } = useWindowSize();
  const allSubs = SUB_CATEGORIES.map(s => s.name);

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialSelected.length > 0 ? initialSelected : allSubs)
  );
  // どのメインカテゴリが開いているか（デフォルト閉じ）
  const [openMain, setOpenMain] = useState<Set<MainCategory>>(() => new Set());

  // サブカテゴリ単体トグル
  const toggleSub = (subName: string) => {
    setSelected(prev => {
      if (prev.size <= 1 && prev.has(subName)) return prev; // 最低1つ
      const next = new Set(prev);
      next.has(subName) ? next.delete(subName) : next.add(subName);
      return next;
    });
  };

  // メインカテゴリ全体トグル
  const toggleMain = (main: MainCategory) => {
    const subs = SUB_CATEGORIES.filter(s => s.main === main).map(s => s.name);
    const allOn = subs.every(s => selected.has(s));
    setSelected(prev => {
      const next = new Set(prev);
      if (allOn) {
        // 全OFF → ただし全体が1つになるなら最後の1つは残す
        subs.forEach(s => {
          if (next.size > 1) next.delete(s);
        });
      } else {
        subs.forEach(s => next.add(s));
      }
      return next;
    });
  };

  // アコーディオン開閉
  const toggleOpen = (main: MainCategory) => {
    setOpenMain(prev => {
      const next = new Set(prev);
      next.has(main) ? next.delete(main) : next.add(main);
      return next;
    });
  };

  // 全選択 / 全解除
  const toggleAll = () => {
    if (selected.size === allSubs.length) {
      setSelected(new Set([allSubs[0]]));
    } else {
      setSelected(new Set(allSubs));
    }
  };

  const isAllSelected = selected.size === allSubs.length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: isMobile ? "24px 12px" : "40px 16px", color: "#fff",
    }}>
      {!isMobile && (
        <div style={{ fontSize: 13, color: "#94a3b8", letterSpacing: 2, marginBottom: 8 }}>
          LEARNING BATTLE CATS（仮）
        </div>
      )}
      <h1 style={{ margin: "0 0 6px", fontSize: isMobile ? 20 : 24, fontWeight: "bold" }}>
        📚 問題カテゴリ選択
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: isMobile ? 14 : 20, textAlign: "center", lineHeight: 1.6, maxWidth: 440, fontSize: isMobile ? 13 : 14 }}>
        カテゴリをタップして展開し、サブカテゴリを選択してください。
      </p>

      <div style={{ width: "100%", maxWidth: 500 }}>
        {/* 全選択トグル */}
        <button
          onClick={toggleAll}
          style={{
            width: "100%", marginBottom: 12, padding: "9px",
            background: isAllSelected ? "#1e40af" : "#1e293b",
            border: `2px solid ${isAllSelected ? "#3b82f6" : "#334155"}`,
            borderRadius: 8, color: "#f1f5f9",
            fontWeight: "bold", fontSize: 13, cursor: "pointer",
          }}
        >
          {isAllSelected ? "✅ すべて選択中" : "⬜ すべて選択する"}
        </button>

        {/* メインカテゴリ一覧 */}
        {MAIN_ORDER.map(main => {
          const meta    = MAIN_CATEGORY_META[main];
          const subs    = SUB_CATEGORIES.filter(s => s.main === main);
          const allOn   = subs.every(s => selected.has(s.name));
          const someOn  = subs.some(s => selected.has(s.name));
          const isOpen  = openMain.has(main);

          return (
            <div key={main} style={{ marginBottom: 8 }}>
              {/* メインカテゴリヘッダー */}
              <div style={{
                display: "flex", alignItems: "center",
                background: someOn ? `${meta.color}18` : "#0f172a",
                border: `2px solid ${someOn ? meta.color : "#1e293b"}`,
                borderRadius: isOpen ? "8px 8px 0 0" : 8,
                overflow: "hidden",
              }}>
                {/* チェックボックス領域 */}
                <button
                  onClick={() => toggleMain(main)}
                  style={{
                    padding: "12px 14px",
                    background: "transparent", border: "none",
                    cursor: "pointer", fontSize: 18, lineHeight: 1,
                    color: allOn ? meta.color : someOn ? "#94a3b8" : "#475569",
                  }}
                  title="このカテゴリ全体をON/OFF"
                >
                  {allOn ? "✅" : someOn ? "☑️" : "⬜"}
                </button>

                {/* カテゴリ名（クリックで展開） */}
                <button
                  onClick={() => toggleOpen(main)}
                  style={{
                    flex: 1, padding: "12px 8px",
                    background: "transparent", border: "none",
                    cursor: "pointer", textAlign: "left",
                    color: "#f1f5f9",
                  }}
                >
                  <span style={{ fontSize: 18, marginRight: 8 }}>{meta.emoji}</span>
                  <span style={{ fontWeight: "bold", fontSize: 15, color: someOn ? meta.color : "#94a3b8" }}>
                    {main}
                  </span>
                  <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>
                    ({subs.filter(s => selected.has(s.name)).length}/{subs.length})
                  </span>
                </button>

                {/* 展開矢印 */}
                <button
                  onClick={() => toggleOpen(main)}
                  style={{
                    padding: "12px 14px", background: "transparent",
                    border: "none", cursor: "pointer",
                    color: "#64748b", fontSize: 14,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  ▼
                </button>
              </div>

              {/* サブカテゴリ一覧（展開時） */}
              {isOpen && (
                <div style={{
                  background: "#0d1a2a",
                  borderLeft: `2px solid ${someOn ? meta.color : "#1e293b"}`,
                  borderRight: `2px solid ${someOn ? meta.color : "#1e293b"}`,
                  borderBottom: `2px solid ${someOn ? meta.color : "#1e293b"}`,
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  overflow: "hidden",
                }}>
                  {subs.map((sub, idx) => {
                    const isOn = selected.has(sub.name);
                    return (
                      <button
                        key={sub.name}
                        onClick={() => toggleSub(sub.name)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center",
                          gap: 10, padding: "10px 16px",
                          background: isOn ? `${sub.color}12` : "transparent",
                          border: "none",
                          borderTop: idx > 0 ? "1px solid #1e293b" : "none",
                          cursor: "pointer", textAlign: "left",
                          transition: "background 0.15s",
                        }}
                      >
                        <span style={{ fontSize: 15, color: isOn ? "#22c55e" : "#475569" }}>
                          {isOn ? "✅" : "⬜"}
                        </span>
                        <span style={{ fontSize: 16 }}>{sub.emoji}</span>
                        <div>
                          <div style={{ fontWeight: "bold", fontSize: 14, color: isOn ? sub.color : "#94a3b8" }}>
                            {sub.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#475569" }}>{sub.desc}</div>
                        </div>
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569" }}>
                          {questions_count(sub.name)}問
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 選択中サマリー */}
      <div style={{ marginTop: 16, fontSize: 12, color: "#64748b", textAlign: "center", maxWidth: 500 }}>
        選択中：{[...selected].map(s => {
          const def = SUB_CATEGORIES.find(d => d.name === s);
          return def ? `${def.emoji}${s}` : s;
        }).join("  ")}
      </div>

      {/* 決定ボタン */}
      <button
        onClick={() => onConfirm([...selected])}
        style={{
          marginTop: 20, padding: "14px 48px",
          background: "#3b82f6", color: "#fff",
          border: "none", borderRadius: 10,
          fontWeight: "bold", fontSize: 18,
          cursor: "pointer", boxShadow: "0 4px 16px #3b82f644",
          transition: "transform 0.1s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        決定 → ステージ選択へ
      </button>
    </div>
  );
}

// サブカテゴリの問題数を数えるヘルパー（静的import不要にするためここで定義）
import { questions } from "../data/questions";
function questions_count(subName: string) {
  return questions.filter(q => q.sub === subName).length;
}
