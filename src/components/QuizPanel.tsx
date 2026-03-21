import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { loadQuestions } from "../data/questions";
import { LEVEL_ALL, LEVEL_DEFS, SUB_CATEGORIES, type Question } from "../data/questionMeta";
import { recordWrong, removeWrong, getWrongIds } from "../data/wrongStore";
import { recordCorrect, getCorrectMap } from "../data/correctStore";
import { sfxCorrect, sfxWrong } from "../audio/SoundManager";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  energy: number;
  maxEnergy: number;
  combo: number;
  subCategories: string[];
  selectedLevel: number;
  onCorrect: (question: Question) => void;
  onWrong: (question: Question) => void;
  disabled?: boolean;
  isPaused?: boolean;
  reviewMode?: boolean;
}

function shuffleChoices(choices: string[]): string[] {
  const next = [...choices];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function withShuffledChoices(question: Question): Question {
  return { ...question, choices: shuffleChoices(question.choices) };
}

function pickWeighted(
  pool: Question[],
  correctCounts: Record<string, number>,
  excludeId?: string,
  selectedLevel?: number,
): Question {
  const filtered = pool.filter((question) => question.id !== excludeId);
  if (filtered.length === 0) {
    return withShuffledChoices(pool[Math.floor(Math.random() * pool.length)]);
  }

  const weights = filtered.map((question) => {
    const correctCount = correctCounts[question.id] ?? 0;
    let weight = correctCount === 0 ? 1 : correctCount === 1 ? 0.3 : correctCount === 2 ? 0.15 : 0.08;

    if (selectedLevel != null) {
      const diff = Math.abs(question.level - selectedLevel);
      if (diff === 1) weight *= 0.6;
      else if (diff === 2) weight *= 0.3;
      else if (diff >= 3) weight *= 0.1;
    }

    return weight;
  });

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * totalWeight;
  let index = 0;

  for (let i = 0; i < weights.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) {
      index = i;
      break;
    }
  }

  return withShuffledChoices(filtered[index]);
}

export function QuizPanel({
  energy,
  maxEnergy,
  combo,
  subCategories,
  selectedLevel,
  onCorrect,
  onWrong,
  disabled,
  isPaused,
  reviewMode,
}: Props) {
  const { isMobile } = useWindowSize();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [current, setCurrent] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [reviewCleared, setReviewCleared] = useState(false);

  const correctMapRef = useRef<Record<string, number> | null>(null);
  const answeredCorrectRef = useRef(new Set<string>());
  const currentPoolRef = useRef<Question[]>([]);

  if (correctMapRef.current === null) {
    const map = getCorrectMap();
    const counts: Record<string, number> = {};
    for (const [id, entry] of Object.entries(map)) counts[id] = entry.count;
    correctMapRef.current = counts;
  }

  useEffect(() => {
    let active = true;
    void loadQuestions({ subCategories }).then((loaded) => {
      if (!active) return;
      setQuestions(loaded);
    });
    return () => {
      active = false;
    };
  }, [subCategories]);

  useEffect(() => {
    if (!questions) return;

    const wrongIds = reviewMode ? new Set(getWrongIds()) : null;
    const filteredPool = questions.filter((question) => {
      if (reviewMode) return wrongIds?.has(question.id) ?? false;
      if (selectedLevel === LEVEL_ALL) return subCategories.includes(question.sub);
      return (
        subCategories.includes(question.sub) &&
        question.level >= Math.max(1, selectedLevel - 2) &&
        question.level <= selectedLevel
      );
    });
    const fallbackPool = questions.filter((question) => subCategories.includes(question.sub));
    const nextPool = filteredPool.length > 0 ? filteredPool : fallbackPool;

    currentPoolRef.current = nextPool;
    answeredCorrectRef.current = new Set();
    setReviewCleared(false);

    if (nextPool.length === 0) {
      setCurrent(null);
      return;
    }

    setCurrent(pickWeighted(nextPool, correctMapRef.current ?? {}, undefined, reviewMode ? undefined : selectedLevel));
    setFeedback(null);
    setSelected(null);
  }, [questions, reviewMode, selectedLevel, subCategories]);

  const answer = useCallback(
    (choice: string) => {
      if (disabled || feedback || !current) return;

      setSelected(choice);

      if (choice === current.answer) {
        setFeedback("correct");
        setCorrectCount((count) => count + 1);
        onCorrect(current);
        answeredCorrectRef.current.add(current.id);
        recordCorrect(current.id);
        if (reviewMode) removeWrong(current.id);
        sfxCorrect();
      } else {
        setFeedback("wrong");
        setWrongCount((count) => count + 1);
        onWrong(current);
        recordWrong(current.id);
        sfxWrong();
      }

      window.setTimeout(() => {
        setFeedback(null);
        setSelected(null);

        const latestPool = reviewMode
          ? (questions ?? []).filter((question) => getWrongIds().includes(question.id))
          : currentPoolRef.current;

        if (latestPool.length === 0) {
          setReviewCleared(true);
          setCurrent(null);
          return;
        }

        const remaining = latestPool.filter(
          (question) => question.id !== current.id && !answeredCorrectRef.current.has(question.id),
        );

        const counts = correctMapRef.current ?? {};
        if (choice === current.answer) {
          counts[current.id] = (counts[current.id] ?? 0) + 1;
        }

        if (remaining.length === 0) {
          answeredCorrectRef.current = new Set();
          setCurrent(pickWeighted(latestPool, counts, current.id, reviewMode ? undefined : selectedLevel));
          return;
        }

        setCurrent(pickWeighted(remaining, counts, undefined, reviewMode ? undefined : selectedLevel));
      }, 900);
    },
    [current, disabled, feedback, onCorrect, onWrong, questions, reviewMode, selectedLevel],
  );

  useEffect(() => {
    if (!current) return undefined;

    const handler = (event: KeyboardEvent) => {
      const idx = ["1", "2", "3", "4"].indexOf(event.key);
      if (idx !== -1 && current.choices[idx]) answer(current.choices[idx]);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answer, current]);

  if (!questions || !current) {
    if (reviewMode && reviewCleared) {
      return (
        <div
          style={{
            background: "#1c1028",
            borderTop: "1px solid #2d1f40",
            padding: isMobile ? "24px 16px" : "32px 24px",
            textAlign: "center",
            ...(isMobile ? { flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "center" } : {}),
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>OK</div>
          <div style={{ fontSize: 18, fontWeight: "bold", color: "#22c55e", marginBottom: 8 }}>復習対象をクリアしました</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
            正解 {correctCount} / 不正解 {wrongCount}
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          background: "#1c1028",
          borderTop: isPaused ? "2px solid #fbbf24" : "1px solid #2d1f40",
          padding: isMobile ? "24px 16px" : "32px 24px",
          textAlign: "center",
          color: "#cbd5e1",
        }}
      >
        問題を読み込み中...
      </div>
    );
  }

  const meta = SUB_CATEGORIES.find((subcategory) => subcategory.name === current.sub) ?? {
    color: "#94a3b8",
    emoji: "?",
  };
  const levelDef = LEVEL_DEFS.find((levelDefItem) => levelDefItem.level === current.level) ?? LEVEL_DEFS[0];
  const p = isMobile ? "8px 10px" : "12px 16px";

  const getButtonStyle = (choice: string): CSSProperties => {
    const isAnswer = choice === current.answer;
    const isSelected = choice === selected;

    let bg = "#334155";
    let border = "1px solid #475569";
    let color = "#f1f5f9";
    let animation = "none";
    let boxShadow = "none";

    if (feedback === "correct" && isAnswer) {
      bg = "#14532d";
      border = "2px solid #22c55e";
      boxShadow = "0 0 16px #22c55e88";
      animation = "correctPulse 0.6s ease forwards";
    } else if (feedback === "wrong") {
      if (isSelected) {
        bg = "#450a0a";
        border = "2px solid #ef4444";
        boxShadow = "0 0 14px #ef444488";
        animation = "wrongShake 0.5s ease";
        color = "#fca5a5";
      } else if (isAnswer) {
        bg = "#14532d";
        border = "2px solid #22c55e";
        boxShadow = "0 0 12px #22c55e66";
        color = "#86efac";
      }
    }

    return {
      padding: isMobile ? "0 14px" : "9px 13px",
      ...(isMobile ? { flex: 1 } : {}),
      background: bg,
      color,
      border,
      borderRadius: 7,
      cursor: !disabled && !feedback ? "pointer" : "default",
      fontWeight: "bold",
      fontSize: isMobile ? 16 : 14,
      textAlign: "left",
      lineHeight: 1.4,
      boxShadow,
      animation,
      transition: "background 0.15s, box-shadow 0.15s",
      position: "relative",
    };
  };

  if (reviewMode && (currentPoolRef.current.length === 0 || reviewCleared)) {
    return (
      <div
        style={{
          background: "#1c1028",
          borderTop: "1px solid #2d1f40",
          padding: isMobile ? "24px 16px" : "32px 24px",
          textAlign: "center",
          ...(isMobile ? { flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "center" } : {}),
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>OK</div>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#22c55e", marginBottom: 8 }}>
          {currentPoolRef.current.length === 0 ? "復習する問題はありません" : "復習完了"}
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
          正解 {correctCount} / 不正解 {wrongCount}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes correctPulse {
          0% { transform: scale(1); box-shadow: 0 0 0px #22c55e00; }
          35% { transform: scale(1.04); box-shadow: 0 0 22px #22c55ecc; }
          70% { transform: scale(1.02); box-shadow: 0 0 14px #22c55e88; }
          100% { transform: scale(1); box-shadow: 0 0 10px #22c55e55; }
        }
        @keyframes wrongShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-7px); }
          35% { transform: translateX(7px); }
          55% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
          90% { transform: translateX(-2px); }
        }
        @keyframes flashGreen {
          0%,100% { background: transparent; }
          30% { background: #22c55e22; }
        }
        @keyframes flashRed {
          0%,100% { background: transparent; }
          30% { background: #ef444422; }
        }
      `}</style>

      <div
        role="form"
        aria-label="クイズ"
        style={{
          background: "#1c1028",
          borderTop: isPaused ? "2px solid #fbbf24" : "1px solid #2d1f40",
          overflow: "hidden",
          transition: "border-color 0.3s",
          animation: feedback === "correct" ? "flashGreen 0.6s ease" : feedback === "wrong" ? "flashRed 0.5s ease" : "none",
          ...(isMobile ? { flex: 1, display: "flex", flexDirection: "column" as const } : {}),
        }}
      >
        <div
          style={{
            padding: p,
            ...(isMobile ? { flex: 1, display: "flex", flexDirection: "column" as const } : {}),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isMobile ? 6 : 10,
              flexWrap: "wrap",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  padding: "2px 6px",
                  background: `${meta.color}22`,
                  color: meta.color,
                  borderRadius: 5,
                  border: `1px solid ${meta.color}55`,
                  whiteSpace: "nowrap",
                }}
              >
                {meta.emoji} {current.sub}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  padding: "2px 6px",
                  background: `${levelDef.color}22`,
                  color: levelDef.color,
                  borderRadius: 5,
                  border: `1px solid ${levelDef.color}55`,
                  whiteSpace: "nowrap",
                }}
              >
                {levelDef.emoji} {levelDef.label}
              </span>
              <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                コンボ <span style={{ color: combo >= 3 ? "#fbbf24" : "#f97316", fontSize: combo >= 5 ? 16 : 13, fontWeight: "bold" }}>{combo}</span>
              </span>
              <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap", letterSpacing: 0.3 }}>
                <span style={{ color: "#4ade80" }}>正解 {correctCount}</span> / <span style={{ color: "#f87171" }}>不正解 {wrongCount}</span>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: 12, whiteSpace: "nowrap" }}>EN {energy}</span>
              <span style={{ color: "#64748b", fontSize: 11 }}>/ {maxEnergy}</span>
              <div
                style={{
                  width: isMobile ? 70 : 100,
                  height: 12,
                  background: "#0f172a",
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid #334155",
                }}
              >
                <div
                  style={{
                    width: `${(energy / maxEnergy) * 100}%`,
                    height: "100%",
                    background: energy > 60 ? "#22c55e" : energy > 30 ? "#f97316" : "#ef4444",
                    borderRadius: 6,
                    transition: "width 0.3s, background 0.3s",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: isMobile ? 13 : 15,
              fontWeight: "bold",
              color: "#f8fafc",
              marginBottom: isMobile ? 6 : 10,
              padding: isMobile ? "8px 12px" : "12px 16px",
              background: "#110822",
              borderRadius: 8,
              borderLeft: `4px solid ${meta.color}`,
              borderTop: `1px solid ${meta.color}55`,
              borderRight: `1px solid ${meta.color}22`,
              borderBottom: `1px solid ${meta.color}22`,
              lineHeight: 1.6,
              letterSpacing: 0.2,
              boxShadow: `inset 0 0 20px ${meta.color}08`,
              flexShrink: 0,
              whiteSpace: "pre-wrap",
              fontFamily:
                current.question.includes("\n") && current.question.includes("{")
                  ? "'Consolas','Courier New',monospace"
                  : "inherit",
              overflowX: "auto",
            }}
          >
            {current.question}
          </div>

          <div
            style={
              isMobile
                ? {
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                  }
                : {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                  }
            }
          >
            {current.choices.map((choice, index) => (
              <button
                key={choice}
                aria-label={`選択肢${index + 1}: ${choice}`}
                onClick={() => answer(choice)}
                disabled={!!disabled || !!feedback}
                style={getButtonStyle(choice)}
                onMouseEnter={(event) => {
                  if (!disabled && !feedback) event.currentTarget.style.background = "#475569";
                }}
                onMouseLeave={(event) => {
                  if (!disabled && !feedback) event.currentTarget.style.background = "#334155";
                }}
              >
                <span style={{ color: "#94a3b8", marginRight: 5 }}>{index + 1}.</span>
                {choice}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
