const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Windows CP932環境でもUTF-8で動作させる
if (process.platform === 'win32') {
  try { execSync('chcp 65001', { stdio: 'ignore' }); } catch {}
}

const app = express();
const PORT = process.env.PORT || 3030;

const AI_DIR = path.join(__dirname, '../../.ai');
const PROJECT_DIR = path.join(__dirname, '../..');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf-8'); }
  catch { return ''; }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

function countPattern(content, pattern) {
  return (content.match(pattern) || []).length;
}

function extractSpecTitles(content) {
  const matches = [...content.matchAll(/^## \[SPEC-[\d-]+\] (.+)$/gm)];
  return matches.map(m => m[1]);
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

app.get('/api/data', (req, res) => {
  const pendingContent = readFile(path.join(AI_DIR, 'specs/PENDING.md'));
  const readyContent   = readFile(path.join(AI_DIR, 'specs/READY.md'));
  const doneContent    = readFile(path.join(AI_DIR, 'specs/DONE.md'));
  const inboxContent   = readFile(path.join(AI_DIR, 'inbox/human.md'));
  const handoffContent = readFile(path.join(AI_DIR, 'AGENT_HANDOFF.md'));

  // PRs via gh CLI
  let prs = [];
  try {
    const out = execSync('gh pr list --json number,title,headRefName,state --limit 20', {
      cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 8000
    });
    prs = JSON.parse(out);
  } catch { /* gh未認証やエラー時はスキップ */ }

  // Build status from last handoff entry
  const buildOk = handoffContent.includes('npm run build: OK');
  const buildNg = handoffContent.includes('npm run build: NG');
  const buildStatus = buildNg ? 'NG' : buildOk ? 'OK' : 'unknown';

  // Recent handoff entries (split by ## [20)
  const handoffEntries = handoffContent
    .split(/(?=^## \[2)/m)
    .filter(e => e.trim())
    .slice(0, 5);

  const channels = {
    general:    readFile(path.join(AI_DIR, 'channels/general.md')),
    specs:      readFile(path.join(AI_DIR, 'channels/specs.md')),
    dev:        readFile(path.join(AI_DIR, 'channels/dev.md')),
    escalation: readFile(path.join(AI_DIR, 'channels/escalation.md')),
  };

  // escalation の未返信スレッド数をカウント
  const escalationThreads = channels.escalation.split(/(?=^## \[)/m).filter(t => t.startsWith('## ['));
  const escalationUnread = escalationThreads.filter(t => !t.includes('> [あなた') && !t.includes('[指示済み]')).length;

  res.json({
    dashboard:  readFile(path.join(AI_DIR, 'DASHBOARD.md')),
    inbox:      inboxContent,
    strategy:   readFile(path.join(AI_DIR, 'STRATEGY.md')),
    research:   readFile(path.join(AI_DIR, 'RESEARCH.md')),
    handoffEntries,
    specs: {
      pending: { count: countPattern(pendingContent, /^## \[SPEC-/gm), titles: extractSpecTitles(pendingContent), content: pendingContent },
      ready:   { count: countPattern(readyContent,   /^## \[SPEC-/gm), titles: extractSpecTitles(readyContent),   content: readyContent },
      done:    { count: countPattern(doneContent,    /^## \[SPEC-/gm), titles: extractSpecTitles(doneContent),    content: doneContent },
    },
    channels,
    escalationUnread,
    prs,
    unreadCount: countPattern(inboxContent, /STATUS: unread/g),
    buildStatus,
    updatedAt: new Date().toISOString(),
  });
});

// チャンネルにスレッド投稿
app.post('/api/channel/post', (req, res) => {
  const { channel, subject, body } = req.body;
  const allowed = ['general', 'specs', 'dev', 'escalation'];
  if (!allowed.includes(channel) || !subject) return res.status(400).json({ error: 'invalid' });

  const filePath = path.join(AI_DIR, `channels/${channel}.md`);
  let content = readFile(filePath);

  const now = new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).replace(/\//g, '-');

  const thread = `\n## [${now} JST] FROM: あなた → #${channel} | ${subject}\n${body || ''}\n\n---\n`;

  // 最初の --- の直前に挿入
  const sepIdx = content.indexOf('\n---\n');
  if (sepIdx !== -1) {
    content = content.slice(0, sepIdx) + thread + content.slice(sepIdx + 5);
  } else {
    content = content.trimEnd() + '\n' + thread;
  }
  writeFile(filePath, content);
  res.json({ ok: true });
});

// チャンネルスレッドに返信
app.post('/api/channel/reply', (req, res) => {
  const { channel, threadSubject, reply } = req.body;
  const allowed = ['general', 'specs', 'dev', 'escalation'];
  if (!allowed.includes(channel) || !reply) return res.status(400).json({ error: 'invalid' });

  const filePath = path.join(AI_DIR, `channels/${channel}.md`);
  let content = readFile(filePath);

  const now = new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit'
  });

  const replyLine = `  > [あなた | ${now}] ${reply}`;

  // スレッドを探して返信を挿入（件名でマッチ）
  if (threadSubject) {
    const escaped = threadSubject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(
      new RegExp(`(## \\[.*?\\].*?\\| ${escaped}[\\s\\S]*?)(\\n---)`),
      `$1\n${replyLine}$2`
    );
  }
  writeFile(filePath, content);
  res.json({ ok: true });
});

// ユーザーが返信を書く
app.post('/api/inbox/reply', (req, res) => {
  const { original, reply } = req.body;
  if (!reply) return res.status(400).json({ error: 'reply required' });

  const filePath = path.join(AI_DIR, 'inbox/human.md');
  let content = readFile(filePath);

  // STATUS: unread → STATUS: replied + Reply を挿入
  content = content.replace(
    /(STATUS: unread)([\s\S]*?)(Reply:)([\s\S]*?)(---)/,
    `STATUS: replied$2$3 ${reply}\n$5`
  );
  writeFile(filePath, content);
  res.json({ ok: true });
});

// ユーザーから指示を投稿する
app.post('/api/inbox/instruct', (req, res) => {
  const { subject, body } = req.body;
  if (!subject) return res.status(400).json({ error: 'subject required' });

  const filePath = path.join(AI_DIR, 'inbox/human.md');
  let content = readFile(filePath);

  const now = new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).replace(/\//g, '-');

  const entry = `\n## [指示] ${subject}\n${body || ''}\n_投稿: ${now} JST_\n`;
  content = content.trimEnd() + '\n' + entry;
  writeFile(filePath, content);
  res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log(`\n📊 Learning TD Dashboard`);
  console.log(`   Local : http://localhost:${PORT}`);
  console.log(`   LAN   : http://${ip}:${PORT}\n`);
});
