import { useState } from "react";

interface Props {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "ようこそ！",
    text: "学習タワーディフェンスへようこそ！\nクイズに答えてユニットを召喚し、敵の拠点を攻め落とそう！",
    icon: "🏰",
  },
  {
    title: "カテゴリを選ぼう",
    text: "算数・国語・理科・社会など、好きなジャンルを選んでスタート。\n得意分野も苦手分野もバランスよく挑戦しよう！",
    icon: "📚",
  },
  {
    title: "クイズに答えよう",
    text: "出題されるクイズに正解するとエネルギーが溜まり、\nユニットを戦場に送り出せるよ！",
    icon: "❓",
  },
  {
    title: "ユニットを召喚！",
    text: "エネルギーが溜まったらユニットボタンをタップ！\nユニットは自動で敵に向かって進撃するよ。",
    icon: "⚔️",
  },
  {
    title: "編成を工夫しよう",
    text: "ガチャで新しいユニットを入手したら編成画面で入れ替え。\nコインで強化もできるよ！",
    icon: "🎯",
  },
];

export function Tutorial({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(2,6,23,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #1e293b, #0f172a)",
          border: "1px solid #334155",
          borderRadius: 20,
          padding: "32px 28px",
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
          animation: "sceneFadeIn 0.3s ease-out",
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: 48, marginBottom: 12 }}>{current.icon}</div>

        {/* Title */}
        <div style={{
          fontSize: 20, fontWeight: 800, color: "#f1f5f9",
          marginBottom: 8,
        }}>
          {current.title}
        </div>

        {/* Text */}
        <div style={{
          fontSize: 14, color: "#94a3b8", lineHeight: 1.7,
          marginBottom: 24, whiteSpace: "pre-line",
        }}>
          {current.text}
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 20 : 8,
                height: 8,
                borderRadius: 4,
                background: i === step ? "#818cf8" : "#334155",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid #334155",
                borderRadius: 10, padding: "10px 20px",
                color: "#94a3b8", fontSize: 14, cursor: "pointer",
              }}
            >
              戻る
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) {
                onComplete();
              } else {
                setStep(step + 1);
              }
            }}
            style={{
              background: isLast
                ? "linear-gradient(135deg, #22d3ee, #818cf8)"
                : "linear-gradient(135deg, #6366f1, #818cf8)",
              border: "none",
              borderRadius: 10, padding: "10px 24px",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isLast ? "はじめる！" : "次へ"}
          </button>
        </div>

        {/* Skip link */}
        {!isLast && (
          <button
            onClick={onComplete}
            style={{
              background: "none", border: "none",
              color: "#475569", fontSize: 11, cursor: "pointer",
              marginTop: 12,
            }}
          >
            スキップ
          </button>
        )}
      </div>
    </div>
  );
}
