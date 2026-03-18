import { useState, useEffect, useCallback, useRef } from "react";
import { questions, SUB_CATEGORIES, LEVEL_DEFS, type Question } from "../data/questions";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  energy: number;
  maxEnergy: number;
  combo: number;
  subCategories: string[];
  selectedLevel: number;
  onCorrect: () => void;
  onWrong: () => void;
  disabled?: boolean;
  isPaused?: boolean;
}

function pickRandom(pool: Question[], excludeId?: string): Question {
  const filtered = pool.filter(q => q.id !== excludeId);
  const q = filtered[Math.floor(Math.random() * filtered.length)];
  const choices = [...q.choices].sort(() => Math.random() - 0.5);
  return { ...q, choices };
}

export function QuizPanel({ energy, maxEnergy, combo, subCategories, selectedLevel, onCorrect, onWrong, disabled, isPaused }: Props) {
  const { isMobile } = useWindowSize();

  const filteredPool = questions.filter(
    q => subCategories.includes(q.sub) && q.level <= selectedLevel
  );
  const pool = filteredPool.length > 0
    ? filteredPool
    : questions.filter(q => subCategories.includes(q.sub));

  const [current, setCurrent]       = useState<Question>(() => pickRandom(pool));
  const [feedback, setFeedback]     = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected]     = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount,   setWrongCount]   = useState(0);
  // "float" key for re-triggering the +10 animation
  const [floatKey, setFloatKey]     = useState(0);

  const answeredCorrectRef = useRef(new Set<string>());

  const answer = useCallback(
    (choice: string) => {
      if (disabled || feedback) return;
      setSelected(choice);
      if (choice === current.answer) {
        setFeedback("correct");
        setCorrectCount(n => n + 1);
        setFloatKey(k => k + 1);
        onCorrect();
        answeredCorrectRef.current.add(current.id);
      } else {
        setFeedback("wrong");
        setWrongCount(n => n + 1);
        onWrong();
      }
      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
        const remaining = pool.filter(
          q => q.id !== current.id && !answeredCorrectRef.current.has(q.id)
        );
        if (remaining.length === 0) {
          answeredCorrectRef.current = new Set();
          setCurrent(pickRandom(pool, current.id));
        } else {
          setCurrent(pickRandom(remaining));
        }
      }, 900);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, feedback, disabled, onCorrect, onWrong]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = ["1", "2", "3", "4"].indexOf(e.key);
      if (idx !== -1 && current.choices[idx]) answer(current.choices[idx]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answer, current]);

  const meta     = SUB_CATEGORIES.find(s => s.name === current.sub) ?? { color: "#94a3b8", emoji: "❓" };
  const levelDef = LEVEL_DEFS.find(d => d.level === current.level) ?? LEVEL_DEFS[0];
  const p = isMobile ? "8px 10px" : "12px 16px";

  // ── ボタンスタイルを決定 ──
  const getButtonStyle = (c: string): React.CSSProperties => {
    const isAnswer   = c === current.answer;
    const isSelected = c === selected;

    let bg        = "#334155";
    let border    = "1px solid #475569";
    let color     = "#f1f5f9";
    let animation = "none";
    let boxShadow = "none";
    let transform = "scale(1)";

    if (feedback === "correct" && isAnswer) {
      bg        = "#14532d";
      border    = "2px solid #22c55e";
      boxShadow = "0 0 16px #22c55e88";
      animation = "correctPulse 0.6s ease forwards";
    } else if (feedback === "wrong") {
      if (isSelected) {
        bg        = "#450a0a";
        border    = "2px solid #ef4444";
        boxShadow = "0 0 14px #ef444488";
        animation = "wrongShake 0.5s ease";
        color     = "#fca5a5";
      } else if (isAnswer) {
        bg        = "#14532d";
        border    = "2px solid #22c55e";
        boxShadow = "0 0 12px #22c55e66";
        color     = "#86efac";
      }
    }

    return {
      padding: isMobile ? "0 14px" : "9px 13px",
      ...(isMobile ? { flex: 1 } : {}),
      background: bg,
      color,
      border,
      borderRadius: 7,
      cursor: (!disabled && !feedback) ? "pointer" : "default",
      fontWeight: "bold",
      fontSize: isMobile ? 16 : 14,
      textAlign: "left",
      lineHeight: 1.4,
      transform,
      boxShadow,
      animation,
      transition: "background 0.15s, box-shadow 0.15s",
      position: "relative",
    };
  };

  return (
    <>
      <style>{`
        @keyframes correctPulse {
          0%   { transform: scale(1);    box-shadow: 0 0 0px #22c55e00; }
          35%  { transform: scale(1.04); box-shadow: 0 0 22px #22c55ecc; }
          70%  { transform: scale(1.02); box-shadow: 0 0 14px #22c55e88; }
          100% { transform: scale(1);    box-shadow: 0 0 10px #22c55e55; }
        }
        @keyframes wrongShake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-7px); }
          35%     { transform: translateX(7px); }
          55%     { transform: translateX(-5px); }
          75%     { transform: translateX(5px); }
          90%     { transform: translateX(-2px); }
        }
        @keyframes floatUp {
          0%   { opacity: 1;   transform: translateY(0)    scale(1); }
          60%  { opacity: 1;   transform: translateY(-22px) scale(1.15); }
          100% { opacity: 0;   transform: translateY(-40px) scale(0.9); }
        }
        @keyframes flashGreen {
          0%,100% { background: transparent; }
          30%     { background: #22c55e22; }
        }
        @keyframes flashRed {
          0%,100% { background: transparent; }
          30%     { background: #ef444422; }
        }
      `}</style>

      <div style={{
        background: "#1c1028",
        borderTop: isPaused ? "2px solid #fbbf24" : "1px solid #2d1f40",
        overflow: "hidden",
        transition: "border-color 0.3s",
        animation: feedback === "correct" ? "flashGreen 0.6s ease"
                 : feedback === "wrong"   ? "flashRed 0.5s ease"
                 : "none",
        ...(isMobile ? { flex: 1, display: "flex", flexDirection: "column" as const } : {}),
      }}>
        <div style={{
          padding: p,
          ...(isMobile ? { flex: 1, display: "flex", flexDirection: "column" as const } : {}),
        }}>

          {/* ── ヘッダー行 ── */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: isMobile ? 6 : 10,
            flexWrap: "wrap", gap: 6, flexShrink: 0,
          }}>
            {/* カテゴリ + コンボ + 正誤カウント */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 11, fontWeight: "bold", padding: "2px 6px",
                background: `${meta.color}22`, color: meta.color,
                borderRadius: 5, border: `1px solid ${meta.color}55`, whiteSpace: "nowrap",
              }}>
                {meta.emoji} {current.sub}
              </span>
              <span style={{
                fontSize: 11, fontWeight: "bold", padding: "2px 6px",
                background: `${levelDef.color}22`, color: levelDef.color,
                borderRadius: 5, border: `1px solid ${levelDef.color}55`, whiteSpace: "nowrap",
              }}>
                {levelDef.emoji} {levelDef.label}
              </span>
              <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                コンボ:{" "}
                <span style={{
                  color: combo >= 3 ? "#fbbf24" : "#f97316",
                  fontSize: combo >= 5 ? 16 : 13, fontWeight: "bold",
                }}>
                  {combo}🔥
                </span>
              </span>
              {/* 正答・誤答カウント（控えめ） */}
              <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap", letterSpacing: 0.3 }}>
                <span style={{ color: "#4ade80" }}>✓{correctCount}</span>
                {" "}/{" "}
                <span style={{ color: "#f87171" }}>✗{wrongCount}</span>
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
            fontSize: isMobile ? 13 : 15, fontWeight: "bold", color: "#f8fafc",
            marginBottom: isMobile ? 6 : 10,
            padding: isMobile ? "8px 12px" : "12px 16px",
            background: "#110822",
            borderRadius: 8,
            borderLeft: `4px solid ${meta.color}`,
            borderTop: `1px solid ${meta.color}55`,
            borderRight: `1px solid ${meta.color}22`,
            borderBottom: `1px solid ${meta.color}22`,
            lineHeight: 1.6, letterSpacing: 0.2,
            boxShadow: `inset 0 0 20px ${meta.color}08`,
            flexShrink: 0,
            whiteSpace: "pre-wrap",       // コードスニペットの改行を保持
            fontFamily: current.question.includes('\n') && current.question.includes('{')
              ? "'Consolas','Courier New',monospace"
              : "inherit",               // コードを含む問題はモノスペースフォント
            overflowX: "auto",
          }}>
            {current.question}
          </div>

          {/* ── 選択肢 ── */}
          <div style={isMobile ? {
            flex: 1, minHeight: 0,
            display: "flex", flexDirection: "column", gap: 5,
          } : {
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
          }}>
            {current.choices.map((c, i) => (
              <button
                key={c}
                onClick={() => answer(c)}
                disabled={!!disabled || !!feedback}
                style={getButtonStyle(c)}
                onMouseEnter={e => {
                  if (!disabled && !feedback)
                    (e.currentTarget as HTMLElement).style.background = "#475569";
                }}
                onMouseLeave={e => {
                  if (!disabled && !feedback)
                    (e.currentTarget as HTMLElement).style.background = "#334155";
                }}
              >
                <span style={{ color: "#94a3b8", marginRight: 5 }}>{i + 1}.</span>
                {c}
              </button>
            ))}
          </div>

          {/* ── フィードバック行（+10⚡ アニメ or 不正解メッセージ） ── */}
          <div style={{
            height: isMobile ? 24 : 28, marginTop: 5, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "visible",
          }}>
            {/* 正解：浮かび上がる +10⚡ */}
            {feedback === "correct" && (
              <span
                key={floatKey}
                style={{
                  position: "absolute",
                  fontWeight: "bold",
                  fontSize: isMobile ? 18 : 20,
                  color: "#22c55e",
                  textShadow: "0 0 12px #22c55ecc",
                  animation: "floatUp 0.9s ease forwards",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                ✅ 正解！　⚡ +10
              </span>
            )}
            {/* 不正解：固定メッセージ */}
            {feedback === "wrong" && (
              <span style={{
                fontWeight: "bold",
                fontSize: isMobile ? 13 : 14,
                color: "#ef4444",
                textShadow: "0 0 8px #ef4444aa",
              }}>
                ❌ 不正解　— 正解は緑のボタン
              </span>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
