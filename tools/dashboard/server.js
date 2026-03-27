const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');
const os = require('os');

if (process.platform === 'win32') {
  try { execSync('chcp 65001', { stdio: 'ignore' }); } catch {}
}

const app = express();
const PORT = process.env.PORT || 3030;

const PROJECT_DIR = path.join(__dirname, '../..');
const PUBLIC_DIR = path.join(__dirname, 'public');
const SUMMARY_HTML = path.join(PUBLIC_DIR, 'summary.html');
const LOG_DIR = path.join(PROJECT_DIR, 'tools/agents/logs');

const SOURCE_OF_TRUTH = {
  project: 'https://github.com/users/aster-mi/projects/2',
  issues: 'https://github.com/aster-mi/learning-td/issues',
  discussions: 'https://github.com/aster-mi/learning-td/discussions',
  repository: 'https://github.com/aster-mi/learning-td',
};

const AGENT_DEFINITIONS = [
  { agent: 'scout', taskName: 'learning-td-scout', start: '00:30', intervalMinutes: 12 * 60, repetitionInterval: 'PT12H' },
  { agent: 'ceo', taskName: 'learning-td-ceo', start: '07:00', intervalMinutes: 12 * 60, repetitionInterval: 'PT12H' },
  { agent: 'planning', taskName: 'learning-td-planning', start: '08:30', intervalMinutes: 4 * 60, repetitionInterval: 'PT4H' },
  { agent: 'design', taskName: 'learning-td-design', start: '09:30', intervalMinutes: 4 * 60, repetitionInterval: 'PT4H' },
  { agent: 'gm', taskName: 'learning-td-gm', start: '10:00', intervalMinutes: 60, repetitionInterval: 'PT1H' },
  { agent: 'librarian', taskName: 'learning-td-librarian', start: '22:30', intervalMinutes: 24 * 60, repetitionInterval: 'PT24H' },
  { agent: 'maintainer', taskName: 'learning-td-maintainer', start: '03:15', intervalMinutes: 24 * 60, repetitionInterval: 'PT24H' },
];

app.use(express.json());
app.get('/', (_req, res) => res.sendFile(SUMMARY_HTML));
app.get('/summary', (_req, res) => res.sendFile(SUMMARY_HTML));
app.use(express.static(PUBLIC_DIR, { index: false }));

function readFile(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
      return buffer.slice(2).toString('utf16le');
    }
    if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
      const swapped = Buffer.from(buffer.slice(2));
      swapped.swap16();
      return swapped.toString('utf16le');
    }

    const sampleLength = Math.min(buffer.length, 4096);
    let nulCount = 0;
    for (let index = 0; index < sampleLength; index += 1) {
      if (buffer[index] === 0) nulCount += 1;
    }

    if (sampleLength > 0 && nulCount > sampleLength / 6) {
      return buffer.toString('utf16le');
    }

    return buffer.toString('utf-8');
  } catch {
    return '';
  }
}

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

function validDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getFullYear() < 2001) return null;
  return date;
}

function encodePowerShellCommand(script) {
  return Buffer.from(script, 'utf16le').toString('base64');
}

function runPowerShellJson(script) {
  try {
    const output = execFileSync(
      'powershell.exe',
      ['-NoProfile', '-EncodedCommand', encodePowerShellCommand(script)],
      { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 12000 }
    ).trim();

    if (!output) return [];
    const parsed = JSON.parse(output);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

function readScheduledTasks() {
  const script = `
    $ProgressPreference = 'SilentlyContinue'
    $InformationPreference = 'SilentlyContinue'
    $WarningPreference = 'SilentlyContinue'
    $tasks = Get-ScheduledTask | Where-Object { $_.TaskName -like 'learning-td-*' } | ForEach-Object {
      $info = Get-ScheduledTaskInfo -TaskName $_.TaskName
      $trigger = $_.Triggers | Select-Object -First 1
      [PSCustomObject]@{
        TaskName = $_.TaskName
        State = [string]$_.State
        LastRunTime = $info.LastRunTime
        LastTaskResult = [int]$info.LastTaskResult
        NextRunTime = $info.NextRunTime
        StartBoundary = if ($trigger) { [string]$trigger.StartBoundary } else { $null }
        RepetitionInterval = if ($trigger -and $trigger.Repetition.Interval) { [string]$trigger.Repetition.Interval } else { $null }
      }
    }
    $tasks | ConvertTo-Json -Depth 4 -Compress
  `;

  return runPowerShellJson(script);
}

function statusLabel(status) {
  const labels = {
    success: '成功',
    'no-op': 'No-op',
    running: '実行中',
    'needs-human': '人判断待ち',
    failed: '失敗',
    completed: '完了ログ',
    'smoke-test': 'Smoke test',
    unknown: '不明',
  };
  return labels[status] || '不明';
}

function normalizeLogContent(content) {
  return content
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

function buildLogTail(content, maxLines = 25, maxChars = 3500) {
  const normalized = normalizeLogContent(content).trim();
  if (!normalized) return '';

  const tailByLines = normalized.split('\n').slice(-maxLines).join('\n').trim();
  if (tailByLines.length <= maxChars) return tailByLines;
  return `...${tailByLines.slice(-maxChars)}`.trim();
}

function extractLastRunMarker(lines, label) {
  const regex = new RegExp(`^${label}:\\s*(.+)$`, 'i');
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const match = lines[index].match(regex);
    if (match) return match[1].trim();
  }
  return '';
}

function parseLogStatus(content, updatedAt) {
  const normalized = normalizeLogContent(content);
  const lines = normalized.split('\n').slice(-160);
  const result = extractLastRunMarker(lines, 'RUN RESULT').toLowerCase();
  const summary = extractLastRunMarker(lines, 'RUN SUMMARY');

  if (result) {
    return { status: result, label: statusLabel(result), summary };
  }

  const ageMs = Date.now() - updatedAt.getTime();
  if (/SMOKE TEST OK/i.test(normalized)) {
    return { status: 'smoke-test', label: statusLabel('smoke-test'), summary: 'Smoke test passed' };
  }
  if (/Starting agent:/i.test(normalized) && ageMs < 15 * 60 * 1000) {
    return { status: 'running', label: statusLabel('running'), summary: 'runner 実行中' };
  }
  if (/error/i.test(normalized)) {
    return { status: 'failed', label: statusLabel('failed'), summary: 'ログ内に error を検出' };
  }

  return { status: 'completed', label: statusLabel('completed'), summary: '最新ログに RUN RESULT がありません' };
}

function readAgentLogs(agent) {
  if (!fs.existsSync(LOG_DIR)) return [];

  const logs = fs.readdirSync(LOG_DIR)
    .filter((fileName) => fileName.startsWith(`${agent}_`) && fileName.endsWith('.log'))
    .map((fileName) => {
      const fullPath = path.join(LOG_DIR, fileName);
      const stats = fs.statSync(fullPath);
      const content = readFile(fullPath);
      const parsed = parseLogStatus(content, stats.mtime);

      return {
        fileName,
        fullPath,
        updatedAt: stats.mtime.toISOString(),
        tail: buildLogTail(content),
        ...parsed,
      };
    })
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));

  return logs;
}

function computeNextPlannedRun(definition) {
  const now = new Date();
  const [hours, minutes] = definition.start.split(':').map(Number);
  const intervalMs = definition.intervalMinutes * 60 * 1000;

  // 今日の起動時刻をローカル時間で作成（anchor）
  const anchor = new Date(now);
  anchor.setHours(hours, minutes, 0, 0);

  // anchor から経過した ms → floor+1 で次回インターバルのステップ数を算出
  // 負数になる場合（anchor が未来）も正しく処理する
  const msSinceAnchor = now.getTime() - anchor.getTime();
  const k = Math.floor(msSinceAnchor / intervalMs) + 1;
  return new Date(anchor.getTime() + k * intervalMs).toISOString();
}

function lastTaskResultLabel(task) {
  if (!task) return '未登録';
  if (!validDate(task.LastRunTime)) return '未実行';
  if (task.LastTaskResult === 0) return 'OK';
  return `Exit ${task.LastTaskResult}`;
}

function buildHealth(task, latestLog) {
  if (!task) return { kind: 'missing', detail: 'Task Scheduler 未登録' };
  if (task.State === 'Running') return { kind: 'running', detail: 'Task Scheduler 実行中' };
  const hasRunBefore = validDate(task.LastRunTime);
  if (!hasRunBefore && !latestLog) return { kind: 'never-run', detail: 'まだ本番実行なし' };
  if (latestLog && ['failed', 'needs-human'].includes(latestLog.status)) {
    return { kind: 'attention', detail: latestLog.summary || latestLog.label };
  }
  // LastTaskResult は LastRunTime が有効なときのみ信頼する（タスク再登録後のリセット対策）
  if (hasRunBefore && task.LastTaskResult !== 0 && (!latestLog || latestLog.status !== 'success')) {
    return { kind: 'attention', detail: `LastTaskResult=${task.LastTaskResult}` };
  }
  if (task.State === 'Disabled') return { kind: 'never-run', detail: 'disabled で待機中' };
  return { kind: 'ready', detail: '待機中' };
}

function buildStatusPayload() {
  const scheduledTasks = readScheduledTasks();
  const taskByName = new Map(scheduledTasks.map((task) => [task.TaskName, task]));

  const agents = AGENT_DEFINITIONS.map((definition) => {
    const task = taskByName.get(definition.taskName) || null;
    const logs = readAgentLogs(definition.agent);
    const latestLog = logs[0] || null;
    const recentLogs = logs.slice(0, 8).map(({ fileName, updatedAt, status, label, summary }) => ({
      fileName,
      updatedAt,
      status,
      label,
      summary,
    }));

    const hasRunBefore = validDate(task?.LastRunTime);
    const taskNextRun = validDate(task?.NextRunTime) ? new Date(task.NextRunTime) : null;
    // 実行済みの場合のみ Task Scheduler の NextRunTime を信頼する。
    // 未実行時は StartBoundary がそのまま返るため computeNextPlannedRun を使う。
    const nextRunTime = (hasRunBefore && taskNextRun && taskNextRun > new Date())
      ? taskNextRun.toISOString()
      : computeNextPlannedRun(definition);

    return {
      agent: definition.agent,
      taskName: definition.taskName,
      taskState: task?.State || 'Missing',
      startBoundary: task?.StartBoundary || definition.start,
      repetitionInterval: task?.RepetitionInterval || definition.repetitionInterval,
      lastRunTime: validDate(task?.LastRunTime)?.toISOString() || null,
      nextRunTime,
      lastTaskResult: task?.LastTaskResult ?? null,
      lastTaskResultLabel: lastTaskResultLabel(task),
      latestLog,
      recentLogs,
      health: buildHealth(task, latestLog),
    };
  });

  return {
    updatedAt: new Date().toISOString(),
    cacheAgeMs: 0,
    stale: false,
    sourceOfTruth: SOURCE_OF_TRUTH,
    agents,
  };
}

app.get('/api/status', (_req, res) => {
  res.json(buildStatusPayload());
});

app.get('/api/logs/:agent/latest', (req, res) => {
  const agent = String(req.params.agent || '').toLowerCase();
  if (!AGENT_DEFINITIONS.some((definition) => definition.agent === agent)) {
    return res.status(404).type('text/plain').send('unknown agent');
  }

  const latestLog = readAgentLogs(agent)[0];
  if (!latestLog) {
    return res.status(404).type('text/plain').send('latest log not found');
  }

  return res.type('text/plain').send(readFile(latestLog.fullPath));
});

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('\nLearning TD Dashboard');
  console.log(`  Summary: http://localhost:${PORT}`);
  console.log(`  LAN    : http://${ip}:${PORT}\n`);
});
