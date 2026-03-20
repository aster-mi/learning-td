import { useState, useEffect, useCallback, useRef } from "react";
import { questions, SUB_CATEGORIES, LEVEL_DEFS, type Question } from "../data/questions";
import { useWindowSize } from "../hooks/useWindowSize";
import { recordWrong, removeWrong, getWrongIds } from "../data/wrongStore";
import { recordCorrect, getCorrectMap } from "../data/correctStore";

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
  reviewMode?: boolean;
}

/**
 * 重み付きランダム選択
 * 正解履歴による重み:
 *   未正解: 1.0 / 正解1回: 0.3 / 正解2回: 0.15 / 正解3回以上: 0.08
 * レベル近接ボーナス（selectedLevel 指定時）:
 *   同レベル: ×1.0 / -1: ×0.6 / -2: ×0.3
 * excludeId は直前に出した問題（連続回避）
 */
function pickWeighted(
  pool: Question[],
  correctCounts: Record<string, number>,
  excludeId?: string,
  selectedLevel?: number,
): Question {
  const filtered = pool.filter(q => q.id !== excludeId);
  if (filtered.length === 0) {
    const q = pool[Math.floor(Math.random() * pool.length)];
    const choices = [...q.choices].sort(() => Math.random() - 0.5);
    return { ...q, choices };
  }

  const weights = filtered.map(q => {
    // 正解履歴による重み
    const c = correctCounts[q.id] ?? 0;
    let w = c === 0 ? 1.0 : c === 1 ? 0.3 : c === 2 ? 0.15 : 0.08;
    // レベル近接ボーナス（選択レベルに近いほど出やすい）
    if (selectedLevel != null) {
      const diff = Math.abs(q.level - selectedLevel);
      if (diff === 0) w *= 1.0;
      else if (diff === 1) w *= 0.6;
      else if (diff === 2) w *= 0.3;
      else w *= 0.1;
    }
    return w;
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  let idx = 0;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) { idx = i; break; }
  }

  const q = filtered[idx];
  const choices = [...q.choices].sort(() => Math.random() - 0.5);
  return { ...q, choices };
}

export function QuizPanel({ energy, maxEnergy, combo, subCategories, selectedLevel, onCorrect, onWrong, disabled, isPaused, reviewMode }: Props) {
  const { isMobile } = useWindowSize();

  // 復習モード時は間違えた問題IDでフィルタ
  const wrongIds = reviewMode ? new Set(getWrongIds()) : null;

  const filteredPool = questions.filter(q => {
    if (reviewMode) {
      return wrongIds!.has(q.id);
    }
    // 選択レベル ±2 の範囲でフィルタ（近い問題が出やすくなるよう pickWeighted でも重み付け）
    return subCategories.includes(q.sub) && q.level >= Math.max(1, selectedLevel - 2) && q.level <= selectedLevel;
  });
  const pool = filteredPool.length > 0
    ? filteredPool
    : questions.filter(q => subCategories.includes(q.sub));

  // 正解履歴マップ（{ questionId: count }）をセッション開始時にロード
  const correctMapRef = useRef<Record<string, number> | null>(null);
  if (correctMapRef.current === null) {
    const map = getCorrectMap();
    const counts: Record<string, number> = {};
    for (const [id, entry] of Object.entries(map)) counts[id] = entry.count;
    correctMapRef.current = counts;
  }

  const [current, setCurrent]       = useState<Question>(() => pickWeighted(pool, correctMapRef.current!, undefined, selectedLevel));
  const [feedback, setFeedback]     = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected]     = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount,   setWrongCount]   = useState(0);
  // 復習モードで全問正解した状態
  const [reviewCleared, setReviewCleared] = useState(false);

  const answeredCorrectRef = useRef(new Set<string>());

  const answer = useCallback(
    (choice: string) => {
      if (disabled || feedback) return;
      setSelected(choice);
      if (choice === current.answer) {
        setFeedback("correct");
        setCorrectCount(n => n + 1);
        onCorrect();
        answeredCorrectRef.current.add(current.id);
        // 正解履歴をlocalStorageに記録（出題優先度を下げるため）
        recordCorrect(current.id);
        // 復習モードで正解 → 復習リストから除外
        if (reviewMode) removeWrong(current.id);
      } else {
        setFeedback("wrong");
        setWrongCount(n => n + 1);
        onWrong();
        // 間違えた問題を記録
        recordWrong(current.id);
      }
      setTimeout(() => {
        setFeedback(null);
        setSelected(null);

        // 復習モード: 最新の間違いリストでプールを再構築
        const latestPool = reviewMode
          ? questions.filter(q => getWrongIds().includes(q.id))
          : pool;

        if (latestPool.length === 0) {
          // 復習モードで全問正解 → 完了状態
          setReviewCleared(true);
          return;
        }

        const remaining = latestPool.filter(
          q => q.id !== current.id && !answeredCorrectRef.current.has(q.id)
        );
        const counts = correctMapRef.current!;
        // 正解を記録した場合、メモリ上のカウントも更新
        if (choice === current.answer) {
          counts[current.id] = (counts[current.id] ?? 0) + 1;
        }
        if (remaining.length === 0) {
          answeredCorrectRef.current = new Set();
          setCurrent(pickWeighted(latestPool, counts, current.id, reviewMode ? undefined : selectedLevel));
        } else {
          setCurrent(pickWeighted(remaining, counts, undefined, reviewMode ? undefined : selectedLevel));
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

  // 復習モードで問題がない or 全問正解した場合
  if (reviewMode && (filteredPool.length === 0 || reviewCleared)) {
    return (
      <div style={{
        background: "#1c1028",
        borderTop: "1px solid #2d1f40",
        padding: isMobile ? "24px 16px" : "32px 24px",
        textAlign: "center",
        ...(isMobile ? { flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "center" } : {}),
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#22c55e", marginBottom: 8 }}>
          {filteredPool.length === 0 ? "間違えた問題はありません！" : "復習完了！全問正解しました！"}
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
          {reviewCleared && `✓${correctCount} / ✗${wrongCount}`}
        </div>
      </div>
    );
  }

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

          {/* フィードバックはフィールド上部に表示（GameScene側） */}

        </div>
      </div>
    </>
  );
}
