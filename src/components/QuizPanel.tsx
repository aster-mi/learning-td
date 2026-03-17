import { useState, useEffect, useCallback } from "react";
import { questions, SUB_CATEGORIES, type Question } from "../data/questions";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  energy: number;
  maxEnergy: number;
  combo: number;
  /** 選択中のサブカテゴリ名リスト */
  subCategories: string[];
  onCorrect: () => void;
  onWrong: () => void;
  disabled?: boolean;
  isPaused?: boolean;
}

function pickRandom(pool: Question[], excludeId?: string): Question {
  const filtered = pool.filter(q => q.id !== excludeId);
  const q = filtered[Math.floor(Math.random() * filtered.length)];
  // 選択肢をシャッフルして場所で覚えるのを防ぐ
  const choices = [...q.choices].sort(() => Math.random() - 0.5);
  return { ...q, choices };
}

export function QuizPanel({ energy, maxEnergy, combo, subCategories, onCorrect, onWrong, disabled, isPaused }: Props) {
  const { isMobile } = useWindowSize();
  const pool = questions.filter(q => subCategories.includes(q.sub));
  const [current, setCurrent] = useState<Question>(() => pickRandom(pool));
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const answer = useCallback(
    (choice: string) => {
      if (disabled || feedback) return;
      if (choice === current.answer) {
        setFeedback("correct");
        onCorrect();
      } else {
        setFeedback("wrong");
        onWrong();
      }
      setTimeout(() => {
        setFeedback(null);
        setCurrent(pickRandom(pool, current.id));
      }, 700);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, feedback, disabled, onCorrect, onWrong]
  );

  // キーボード 1-4 でも回答できる
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = ["1", "2", "3", "4"].indexOf(e.key);
      if (idx !== -1 && current.choices[idx]) answer(current.choices[idx]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answer, current]);

  const meta = SUB_CATEGORIES.find(s => s.name === current.sub)
    ?? { color: "#94a3b8", emoji: "❓" };

  const p = isMobile ? "8px 10px" : "12px 16px";

  return (
    <div style={{
      background: "#1c1028",
      borderTop: isPaused ? "2px solid #fbbf24" : "1px solid #2d1f40",
      overflow: "hidden",
      transition: "border-color 0.3s",
    }}>
      <div style={{ padding: p }}>

        {/* ── ヘッダー行 ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: isMobile ? 6 : 10,
          flexWrap: "wrap", gap: 6,
        }}>
          {/* カテゴリ + コンボ */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: "bold", padding: "2px 6px",
              background: `${meta.color}22`, color: meta.color,
              borderRadius: 5, border: `1px solid ${meta.color}55`,
              whiteSpace: "nowrap",
            }}>
              {meta.emoji} {current.sub}
            </span>
            <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
              コンボ:{" "}
              <span style={{
                color: combo >= 3 ? "#fbbf24" : "#f97316",
                fontSize: combo >= 5 ? 16 : 13,
                fontWeight: "bold",
              }}>
                {combo}🔥
              </span>
            </span>
          </div>

          {/* Energy */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: 12, whiteSpace: "nowrap" }}>⚡{energy}</span>
            <span style={{ color: "#64748b", fontSize: 11 }}>/ {maxEnergy}</span>
            <div style={{
              width: isMobile ? 70 : 100, height: 12,
              background: "#0f172a", borderRadius: 6, overflow: "hidden", border: "1px solid #334155",
            }}>
              <div style={{
                width: `${(energy / maxEnergy) * 100}%`, height: "100%",
                background: energy > 60 ? "#22c55e" : energy > 30 ? "#f97316" : "#ef4444",
                borderRadius: 6, transition: "width 0.3s, background 0.3s",
              }} />
            </div>
          </div>
        </div>

        {/* ── 問題文 ── */}
        <div style={{
          fontSize: isMobile ? 15 : 18, fontWeight: "bold", color: "#f8fafc",
          marginBottom: isMobile ? 6 : 10,
          padding: isMobile ? "8px 12px" : "12px 16px",
          background: "#110822",
          borderRadius: 8,
          borderLeft: `4px solid ${meta.color}`,
          borderTop: `1px solid ${meta.color}55`,
          borderRight: `1px solid ${meta.color}22`,
          borderBottom: `1px solid ${meta.color}22`,
          lineHeight: 1.55,
          letterSpacing: 0.2,
          boxShadow: `inset 0 0 20px ${meta.color}08`,
        }}>
          {current.question}
        </div>

        {/* ── 選択肢 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 5 : 6 }}>
          {current.choices.map((c, i) => {
            const isAnswer = c === current.answer;
            let bg = "#334155";
            let border = "1px solid #475569";
            if (feedback === "correct" && isAnswer) { bg = "#166534"; border = "1px solid #22c55e"; }
            if (feedback === "wrong"   && isAnswer) { bg = "#166534"; border = "1px solid #22c55e"; }
            return (
              <button
                key={c}
                onClick={() => answer(c)}
                disabled={!!disabled || !!feedback}
                style={{
                  padding: isMobile ? "7px 10px" : "9px 13px",
                  background: bg, color: "#f1f5f9",
                  border, borderRadius: 7,
                  cursor: (!disabled && !feedback) ? "pointer" : "default",
                  fontWeight: "bold",
                  fontSize: isMobile ? 13 : 14,
                  textAlign: "left",
                  transition: "background 0.15s",
                  lineHeight: 1.4,
                }}
                onMouseEnter={e => { if (!disabled && !feedback) (e.currentTarget as HTMLElement).style.background = "#475569"; }}
                onMouseLeave={e => { if (!disabled && !feedback) (e.currentTarget as HTMLElement).style.background = bg; }}
              >
                <span style={{ color: "#94a3b8", marginRight: 5 }}>{i + 1}.</span>
                {c}
              </button>
            );
          })}
        </div>

        {/* ── フィードバック（固定高さ・レイアウトズレなし） ── */}
        <div style={{
          height: isMobile ? 22 : 26, marginTop: 5,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "bold", fontSize: isMobile ? 12 : 14,
          color: feedback === "correct" ? "#22c55e" : "#ef4444",
        }}>
          {feedback === "correct" && "✅ 正解！　⚡ +10 Energy"}
          {feedback === "wrong"   && "❌ 不正解　コンボリセット"}
        </div>

      </div>
    </div>
  );
}
