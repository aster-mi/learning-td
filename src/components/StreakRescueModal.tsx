interface Props {
  previousStreak: number;
  rescueCost: number;
  coins: number;
  onRescue: () => void;
  onDismiss: () => void;
}

export function StreakRescueModal({ previousStreak, rescueCost, coins, onRescue, onDismiss }: Props) {
  const canRescue = coins >= rescueCost;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 16,
          padding: 24,
          color: "#fff",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          display: "grid",
          gap: 16,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.6 }}>
          {`🔥 ストリークが途切れました…（前回: ${previousStreak}日）`}
          <br />
          {`${rescueCost}コインで救済できます`}
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <button
            onClick={onRescue}
            disabled={!canRescue}
            style={{
              background: "#f59e0b",
              border: "none",
              color: "#0f172a",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 15,
              fontWeight: 700,
              cursor: canRescue ? "pointer" : "not-allowed",
              opacity: canRescue ? 1 : 0.5,
            }}
          >
            {`💰 ${rescueCost}コインで救済する`}
          </button>
          <button
            onClick={onDismiss}
            style={{
              background: "#1e293b",
              border: "1px solid #475569",
              color: "#e2e8f0",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            あきらめる（リセット）
          </button>
        </div>
      </div>
    </div>
  );
}
