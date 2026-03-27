
    const META = {
      success: { label: "成功", color: "#34d399" },
      "no-op": { label: "No-op", color: "#fbbf24" },
      running: { label: "実行中", color: "#38bdf8" },
      primed: { label: "準備完了", color: "#a78bfa" },
      scheduled: { label: "待機中", color: "#60a5fa" },
      "needs-human": { label: "人判断待ち", color: "#f87171" },
      failed: { label: "失敗", color: "#f87171" },
      attention: { label: "要確認", color: "#fb923c" },
      "never-run": { label: "未実行", color: "#94a3b8" },
      "smoke-test": { label: "Smoke test", color: "#e879f9" },
      completed: { label: "完了ログ", color: "#60a5fa" },
      unknown: { label: "不明", color: "#475569" },
      missing: { label: "未登録", color: "#f87171" },
    };

    const esc = (value) => String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

    function toDate(value) {
      if (!value) return null;
      const date = new Date(value);
      if (Number.isNaN(date.getTime()) || date.getFullYear() < 2001) return null;
      return date;
    }

    function formatDate(value, long = false) {
      const date = toDate(value);
      if (!date) return "未実行";
      const options = long
        ? { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }
        : { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
      return new Intl.DateTimeFormat("ja-JP", options).format(date);
    }

    function parseIntervalMinutes(value) {
      if (!value) return 0;
      const hours = value.match(/(\d+)H/);
      const minutes = value.match(/(\d+)M/);
      return ((hours ? Number(hours[1]) : 0) * 60) + (minutes ? Number(minutes[1]) : 0);
    }

    function minutesUntil(value) {
      const date = toDate(value);
      return date ? Math.round((date.getTime() - Date.now()) / 60000) : null;
    }

    function formatCountdown(value) {
      const minutes = minutesUntil(value);
      if (minutes === null) return "未設定";
      if (minutes <= 0) return "まもなく";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours && mins) return `${hours}時間 ${mins}分`;
      if (hours) return `${hours}時間`;
      return `${mins}分`;
    }

    function formatCompactCountdown(value) {
      const minutes = minutesUntil(value);
      if (minutes === null) return "--";
      if (minutes <= 0) return "Now";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours && mins) return `${hours}h ${mins}m`;
      if (hours) return `${hours}h`;
      return `${mins}m`;
    }

    function formatCacheAge(ms) {
      if (ms === null || ms === undefined) return "--";
      if (ms < 1000) return `${ms}ms`;
      const seconds = Math.round(ms / 1000);
      if (seconds < 60) return `${seconds}秒前`;
      return `${Math.round(seconds / 60)}分前`;
    }

    function formatInterval(value) {
      if (!value) return "未設定";
      const days = value.match(/(\d+)D/);
      const hours = value.match(/(\d+)H/);
      const mins = value.match(/(\d+)M/);
      const parts = [];
      if (days) parts.push(`${days[1]}日`);
      if (hours) parts.push(`${hours[1]}時間`);
      if (mins) parts.push(`${mins[1]}分`);
      return parts.length ? parts.join("") + "ごと" : value;
    }

    function formatStartTime(value) {
      if (!value) return "未設定";
      const match = String(value).match(/T(\d{2}:\d{2})/);
      return match ? `${match[1]} 開始` : String(value).slice(0, 5);
    }

    function initials(agent) {
      return agent.toUpperCase().slice(0, Math.min(3, agent.length));
    }

    function compositeState(agent) {
      const latest = agent.latestLog?.status;
      if (agent.health.kind === "running") return "running";
      if (latest === "success") return "success";
      if (latest === "no-op") return "no-op";
      if (latest === "needs-human") return "needs-human";
      if (latest === "failed" || agent.health.kind === "attention" || agent.health.kind === "missing") return "failed";
      if (agent.health.kind === "never-run" && latest === "smoke-test") return "primed";
      if (agent.health.kind === "never-run") return "never-run";
      if (latest === "smoke-test") return "primed";
      if (agent.health.kind === "ready" || latest === "completed" || agent.health.kind === "success") return "scheduled";
      return "unknown";
    }

    function progressPercent(agent) {
      const totalMinutes = parseIntervalMinutes(agent.repetitionInterval);
      const remaining = minutesUntil(agent.nextRunTime);
      if (!totalMinutes || remaining === null) return 8;
      const ratio = 100 - ((Math.max(remaining, 0) / totalMinutes) * 100);
      return Math.max(8, Math.min(100, Math.round(ratio)));
    }

    function buildCounts(agents) {
      const counts = {};
      agents.forEach((agent) => {
        const key = compositeState(agent);
        counts[key] = (counts[key] || 0) + 1;
      });
      return counts;
    }

    function buildRingGradient(counts, total) {
      const order = ["success", "no-op", "running", "primed", "scheduled", "needs-human", "failed", "never-run", "unknown"];
      let cursor = 0;
      const segments = [];
      order.forEach((key) => {
        const count = counts[key] || 0;
        if (!count) return;
        const next = cursor + ((count / total) * 100);
        segments.push(`${META[key].color} ${cursor}% ${next}%`);
        cursor = next;
      });
      segments.push(`rgba(255,255,255,0.08) ${cursor}% 100%`);
      return `conic-gradient(${segments.join(", ")})`;
    }

    function buildHistory(agent) {
      const entries = [...(agent.recentLogs || [])].reverse().slice(-8);
      while (entries.length < 8) entries.unshift(null);
      return entries.map((entry) => {
        if (!entry) {
          return '<div class="history-cell" title="履歴なし"><div class="history-fill" style="background:rgba(255,255,255,0.06)">-</div></div>';
        }
        const meta = META[entry.status] || META.unknown;
        const title = `${formatDate(entry.updatedAt)} / ${entry.label}${entry.summary ? ` / ${entry.summary}` : ""}`;
        return `<div class="history-cell" title="${esc(title)}"><div class="history-fill" style="background:${meta.color}">${esc(entry.label.slice(0, 2))}</div></div>`;
      }).join("");
    }

    function buildHorizon(agent) {
      const interval = parseIntervalMinutes(agent.repetitionInterval);
      const nextRun = toDate(agent.nextRunTime);
      const buckets = Array.from({ length: 12 }, () => 0);
      if (nextRun) {
        let cursor = nextRun.getTime();
        const now = Date.now();
        const end = now + (24 * 60 * 60000);
        let guard = 0;
        while (cursor < now && interval > 0 && guard < 256) {
          cursor += interval * 60000;
          guard += 1;
        }
        guard = 0;
        while (cursor <= end && guard < 256) {
          const index = Math.floor((cursor - now) / (120 * 60000));
          if (index >= 0 && index < buckets.length) buckets[index] += 1;
          if (!interval) break;
          cursor += interval * 60000;
          guard += 1;
        }
      }
      const color = (META[compositeState(agent)] || META.unknown).color;
      return buckets.map((count, index) => {
        const label = index === 0 ? "now" : `${index * 2}h`;
        return `<div class="horizon-cell" title="${esc(`${label}〜${(index + 1) * 2}h / ${count} run`)}"><div class="horizon-fill" style="background:${count ? color : "transparent"}">${count || ""}</div></div>`;
      }).join("");
    }

    function renderLinks(source) {
      document.getElementById("source-links").innerHTML = `
        <a class="source-link" href="${source.project}" target="_blank" rel="noreferrer">Project</a>
        <a class="source-link" href="${source.issues}" target="_blank" rel="noreferrer">Issues</a>
        <a class="source-link" href="${source.discussions}" target="_blank" rel="noreferrer">Discussions</a>
        <a class="source-link" href="${source.repository}" target="_blank" rel="noreferrer">Repository</a>
      `;
    }

    function renderPulse(payload) {
      const counts = buildCounts(payload.agents);
      const total = payload.agents.length || 1;
      const stable = (counts.success || 0) + (counts["no-op"] || 0) + (counts.primed || 0) + (counts.scheduled || 0);
      const attention = (counts.failed || 0) + (counts["needs-human"] || 0) + (counts.missing || 0) + (counts.unknown || 0);
      const next = [...payload.agents]
        .filter((agent) => toDate(agent.nextRunTime))
        .sort((a, b) => toDate(a.nextRunTime) - toDate(b.nextRunTime))[0] || null;

      document.getElementById("updated-at").textContent = formatDate(payload.updatedAt, true);
      document.getElementById("cache-age").textContent = formatCacheAge(payload.cacheAgeMs);
      document.getElementById("stale-pill").textContent = payload.stale ? "古いスナップショット" : "同期済み";
      document.getElementById("pulse-total").textContent = String(total);
      document.getElementById("pulse-ring").style.background = buildRingGradient(counts, total);
      document.getElementById("pulse-headline").textContent =
        attention > 0 ? `${attention}件の要確認があります` : `${stable} agent が安定稼働中`;
      document.getElementById("pulse-copy").textContent =
        next
          ? `次は ${next.agent.toUpperCase()} — ${formatCountdown(next.nextRunTime)}後`
          : "次回実行時刻が読めない agent があります";

      document.getElementById("legend-grid").innerHTML = [
        "success", "no-op", "primed", "scheduled", "failed", "never-run",
      ].filter((key) => counts[key]).map((key) => `
        <div class="legend-item">
          <span class="legend-dot" style="background:${META[key].color}"></span>
          <span>${esc(META[key].label)}</span>
          <strong>${esc(counts[key])}</strong>
        </div>
      `).join("");

      document.getElementById("glance-grid").innerHTML = [
        {
          label: "次に動く agent",
          value: next ? next.agent.toUpperCase() : "未定",
          note: next ? `${formatDate(next.nextRunTime)} / ${formatCountdown(next.nextRunTime)}` : "次回時刻なし",
        },
        {
          label: "安定状態",
          value: String(stable),
          note: "成功 / no-op / 準備完了 / 待機中",
        },
        {
          label: "要確認",
          value: String(attention),
          note: "失敗・人判断待ち・不明・未登録",
        },
        {
          label: "未実行",
          value: String(counts["never-run"] || 0),
          note: "本番実行前",
        },
      ].map((item) => `
        <div class="stat-card">
          <div class="stat-label">${esc(item.label)}</div>
          <div class="stat-value">${esc(item.value)}</div>
          <div class="stat-note">${esc(item.note)}</div>
        </div>
      `).join("");
    }

    function renderTimeline(agents) {
      document.getElementById("timeline-grid").innerHTML = [...agents]
        .sort((a, b) => {
          const left = toDate(a.nextRunTime);
          const right = toDate(b.nextRunTime);
          if (!left && !right) return 0;
          if (!left) return 1;
          if (!right) return -1;
          return left - right;
        })
        .map((agent) => {
          const state = compositeState(agent);
          const meta = META[state] || META.unknown;
          const progress = progressPercent(agent);
          return `
            <article class="timeline-card" style="border-top-color:${meta.color}">
              <div class="tl-badge" style="color:${meta.color}">${esc(initials(agent.agent))}</div>
              <div class="tl-agent">${esc(agent.agent)}</div>
              <div class="tl-time">${esc(formatDate(agent.nextRunTime))}</div>
              <div class="countdown" style="color:${meta.color}">${esc(formatCompactCountdown(agent.nextRunTime))}</div>
              <div class="tag-row">
                <span class="tag">${esc(meta.label)}</span>
                <span class="tag">${esc(agent.latestLog?.label || "ログなし")}</span>
              </div>
              <div class="bar" style="--accent:${meta.color}; --pct:${progress}%"><span></span></div>
              <div class="tl-cadence">${esc(formatInterval(agent.repetitionInterval))}</div>
            </article>
          `;
        })
        .join("");
    }

    function renderAgents(agents) {
      document.getElementById("agent-grid").innerHTML = agents.map((agent) => {
        const state = compositeState(agent);
        const meta = META[state] || META.unknown;
        const progress = progressPercent(agent);
        const summary = agent.latestLog?.summary || "まだ run summary はありません。";
        return `
          <article class="agent-card" style="border-top-color:${meta.color}">
            <div class="agent-card-body">
              <div class="agent-header">
                <div class="orb" style="--accent:${meta.color}; --pct:${progress}%">
                  <div class="orb-center">
                    <span class="orb-time">${esc(formatCompactCountdown(agent.nextRunTime))}</span>
                    <span class="orb-note">next</span>
                  </div>
                </div>
                <div class="agent-info">
                  <div class="agent-task">${esc(agent.taskName)}</div>
                  <div class="agent-name">${esc(agent.agent)}</div>
                  <div class="agent-next">${esc(formatDate(agent.nextRunTime))} に次回実行</div>
                </div>
              </div>

              <div class="chip-row">
                <span class="chip">Scheduler: ${esc(meta.label)}</span>
                <span class="chip">Latest: ${esc(agent.latestLog?.label || "ログなし")}</span>
              </div>

              <div class="metric-grid">
                <div class="metric">
                  <div class="label">次回実行</div>
                  <strong>${esc(formatCountdown(agent.nextRunTime))}</strong>
                  <div>${esc(formatDate(agent.nextRunTime))}</div>
                </div>
                <div class="metric">
                  <div class="label">前回結果</div>
                  <strong>${esc(agent.lastTaskResultLabel || "不明")}</strong>
                  <div>${esc(formatDate(agent.lastRunTime))}</div>
                </div>
                <div class="metric">
                  <div class="label">Cadence</div>
                  <strong>${esc(formatInterval(agent.repetitionInterval))}</strong>
                  <div>${esc(formatStartTime(agent.startBoundary))}</div>
                </div>
                <div class="metric">
                  <div class="label">最新ログ</div>
                  <strong>${esc(formatDate(agent.latestLog?.updatedAt || null))}</strong>
                  <div>${esc(agent.latestLog?.fileName || "ログなし")}</div>
                </div>
              </div>

              <div class="summary-band">
                <strong>Latest Summary</strong>
                <p class="summary-text">${esc(summary)}</p>
                <div class="bar" style="--accent:${meta.color}; --pct:${progress}%"><span></span></div>
              </div>

              <div class="history-section">
                <div class="subgrid-head">
                  <span class="mini-label">Recent Runs</span>
                  <span class="submeta">直近 8 本</span>
                </div>
                <div class="history-strip">${buildHistory(agent)}</div>
              </div>

              <div class="horizon-section">
                <div class="subgrid-head">
                  <span class="mini-label">Next 24h</span>
                  <span class="submeta">2h 刻み</span>
                </div>
                <div class="horizon-strip">${buildHorizon(agent)}</div>
              </div>
            </div>

            <div class="log-details">
              <details>
                <summary>最新ログ tail</summary>
                <div class="log-body">
                  <pre>${esc(agent.latestLog?.tail || "latest log はまだありません")}</pre>
                  <a class="ghost-link" href="/api/logs/${encodeURIComponent(agent.agent)}/latest" target="_blank" rel="noreferrer">Raw log ↗</a>
                </div>
              </details>
            </div>
          </article>
        `;
      }).join("");
    }

    async function loadStatus() {
      const errorBox = document.getElementById("error-box");
      try {
        const response = await fetch("/api/status", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "dashboard load failed");
        errorBox.style.display = "none";
        renderLinks(payload.sourceOfTruth);
        renderPulse(payload);
        renderTimeline(payload.agents);
        renderAgents(payload.agents);
      } catch (error) {
        errorBox.textContent = `Dashboard の読み込みに失敗しました: ${error.message}`;
        errorBox.style.display = "block";
      }
    }

    loadStatus();
