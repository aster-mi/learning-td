import { RELEASE_NOTES } from "../data/releaseNotes";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  onClose: () => void;
}

export function ReleaseNotesScreen({ onClose }: Props) {
  const { isMobile } = useWindowSize();
  const notes = [...RELEASE_NOTES].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    return b.version.localeCompare(a.version, undefined, { numeric: true });
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: isMobile ? "12px 16px" : "16px 24px",
          background: "rgba(15, 23, 42, 0.92)",
          borderBottom: "1px solid #334155",
          backdropFilter: "blur(6px)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "8px 14px",
            background: "#334155",
            color: "#fff",
            border: "1px solid #475569",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          戻る
        </button>
        <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 24 }}>リリースノート</h1>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 760,
          margin: "0 auto",
          padding: isMobile ? "16px" : "24px",
          boxSizing: "border-box",
        }}
      >
        {notes.map((note) => (
          <section
            key={`${note.version}-${note.date}`}
            style={{
              marginBottom: 16,
              padding: isMobile ? "16px" : "20px",
              background: "rgba(15, 23, 42, 0.72)",
              border: "1px solid #334155",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              <strong style={{ fontSize: isMobile ? 18 : 20, color: "#c4b5fd" }}>v{note.version}</strong>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{note.date}</span>
            </div>

            <ul style={{ margin: 0, paddingLeft: 20, color: "#e2e8f0", lineHeight: 1.7 }}>
              {note.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
