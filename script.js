/* ===================== OPERATION: LAB-09 — CORE ENGINE ===================== */
'use strict';

/* ---------------------------------------------------------------
   0. SUPABASE CONNECTION (shared realtime state across 3 devices)
----------------------------------------------------------------*/
const SUPABASE_URL = 'https://crfqnijmrfaaaygwrtly.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1iNdl1kYmKe4FnRBfz4gOA_xrsQ1bKk';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ---------------------------------------------------------------
   1. DATA: TEAMS, MISSION POOLS, IMMERSION MESSAGES
----------------------------------------------------------------*/

const TEAMS = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: `TEAM ${i + 1}`,
}));

const ALERT_MESSAGES = [
  'WARNING: Virus spread detected in sector 4.',
  'Agent, you have 15 minutes remaining.',
  'Unauthorized activity detected on mainframe.',
  'Laboratory security system compromised.',
  'Emergency protocol activated.',
  'NULLPOINT signature detected — stay alert.',
  'Power fluctuation in vault grid. Proceed.',
  'Backup generators online. Systems stable.',
  'Encryption layer 2 weakening. Move fast.',
  'ECHO-9: I am still with you, agents.',
];

/* ---- AGENT A: HTML / LOGIC (5 mission variants) ---- */
const POOL_A = [
  {
    id: 'a1', title: 'CORRUPTED MARKUP',
    body: `The lab's welcome banner is corrupted. Fix the broken HTML tag so it renders correctly.`,
    code: `<h1>WELCOME<h1>`,
    type: 'text', answer: '<h1>WELCOME</h1>',
    hint: 'The closing tag needs a forward slash: </h1>',
  },
  {
    id: 'a2', title: 'BROKEN LINK PROTOCOL',
    body: `This anchor tag won't open the security feed. Fix the attribute name.`,
    code: `<a herf="feed.html">Open Feed</a>`,
    type: 'text', answer: '<a href="feed.html">Open Feed</a>',
    hint: 'The attribute is spelled "href", not "herf".',
  },
  {
    id: 'a3', title: 'UNCLOSED LIST',
    body: `The vault inventory list is missing its closing tag. Fix it.`,
    code: `<ul>\n  <li>Keycard</li>\n  <li>Badge</li>\n</li>`,
    type: 'text', answer: '<ul>\n  <li>Keycard</li>\n  <li>Badge</li>\n</ul>',
    hint: 'A list opened with <ul> must close with </ul>, not </li>.',
  },
  {
    id: 'a4', title: 'LOGIC GATE: ACCESS CHECK',
    body: `The door opens only if (power IS ON) AND (badge IS VALID). Power = ON. Badge = INVALID. Does the door open?`,
    type: 'choice', options: ['YES, door opens', 'NO, door stays locked'],
    answer: 'NO, door stays locked',
    hint: 'AND requires BOTH conditions to be true.',
  },
  {
    id: 'a5', title: 'IMAGE TAG MALFUNCTION',
    body: `This image element is missing a required attribute for accessibility/loading. Fix the tag (use src="scan.png").`,
    code: `<img alt="scan result">`,
    type: 'text', answer: '<img src="scan.png" alt="scan result">',
    hint: 'Images need a "src" attribute pointing to the file.',
  },
];

/* ---- AGENT B: CIPHER / RECON (5 mission variants) ---- */
const POOL_B = [
  {
    id: 'b1', title: 'CAESAR CIPHER — SHIFT 3',
    body: `NULLPOINT intercepted this message, shifted by 3 letters. Decode it:`,
    code: `KHOOR ZRUOG`,
    type: 'text', answer: 'HELLO WORLD',
    hint: 'Shift every letter BACK by 3 (K→H, H→E...).',
  },
  {
    id: 'b2', title: 'BINARY TRANSMISSION',
    body: `Decode this binary message into text (1 byte = 1 letter):`,
    code: `01001100 01000001 01000010`,
    type: 'text', answer: 'LAB',
    hint: '01001100=L, 01000001=A, 01000010=B.',
  },
  {
    id: 'b3', title: 'REVERSED SIGNAL',
    body: `The signal was captured backwards. Reverse it to read the true message:`,
    code: `9-BAL EVAS`,
    type: 'text', answer: 'SAVE LAB-9',
    hint: 'Read every character from right to left.',
  },
  {
    id: 'b4', title: 'HIDDEN PIXEL REPORT',
    body: `Surveillance log: "Row 7 of the security grid lists exactly FOUR anomalies. Column C lists exactly NINE." What is the access number formed by ROW-then-COLUMN counts?`,
    type: 'text', answer: '49',
    hint: 'Combine the two counts in order: row count then column count.',
  },
  {
    id: 'b5', title: 'VIGENÈRE FRAGMENT (KEY: LAB)',
    body: `Using keyword cipher logic where each letter shifts by the matching key letter's position (L=11,A=0,B=1), decode: "PADM" (hint: it decrypts to a 4-letter word about defense).`,
    type: 'text', answer: 'GUARD',
    hint: 'Answer relates to protecting the lab: G-U-A-R-D.',
  },
];

/* ---- AGENT C: AI / QUIZ / LOGIC (5 mission variants) ---- */
const POOL_C = [
  {
    id: 'c1', title: 'IDENTIFY THE AI',
    body: `Which of these is an example of Artificial Intelligence?`,
    type: 'choice',
    options: ['A calculator adding two numbers', 'A chess engine that learns from games', 'A light switch', 'A printed book'],
    answer: 'A chess engine that learns from games',
    hint: 'AI involves learning or decision-making, not fixed mechanical actions.',
  },
  {
    id: 'c2', title: 'IT QUIZ: NETWORK BASICS',
    body: `What does "QR" stand for in "QR Code"?`,
    type: 'choice',
    options: ['Quick Response', 'Quality Rating', 'Query Register', 'Quad Render'],
    answer: 'Quick Response',
    hint: 'It is about how fast the code can be scanned and read.',
  },
  {
    id: 'c3', title: 'LOGIC RIDDLE: THE THREE SWITCHES',
    body: `ECHO-9 says: "I have a sister AI who always lies, and I always tell the truth. My sister says this number sequence is FAKE: 7-3-9. Is the sequence real or fake?"`,
    type: 'choice', options: ['REAL', 'FAKE'],
    answer: 'REAL',
    hint: 'The sister always lies — so if she says "fake", the truth is the opposite.',
  },
  {
    id: 'c4', title: 'IT QUIZ: CYBERSECURITY',
    body: `What is the main purpose of a firewall?`,
    type: 'choice',
    options: ['To speed up internet', 'To block unauthorized network access', 'To store passwords', 'To cool down the CPU'],
    answer: 'To block unauthorized network access',
    hint: 'Think of it as a security guard for network traffic.',
  },
  {
    id: 'c5', title: 'PATTERN SEQUENCE',
    body: `Find the next number in NULLPOINT's sequence: 2, 4, 8, 16, ?`,
    type: 'text', answer: '32',
    hint: 'Each number doubles the previous one.',
  },
];

const POOLS = { A: POOL_A, B: POOL_B, C: POOL_C };
const ROLE_META = {
  A: { name: 'THE ARCHITECT', desc: 'HTML & Logic' },
  B: { name: 'THE GHOST', desc: 'Cipher & Recon' },
  C: { name: 'THE ORACLE', desc: 'AI & Puzzles' },
};

const MISSION_TIME_LIMIT = 8 * 60; // seconds per mission stage
const GLOBAL_TIME_LIMIT = 25 * 60; // seconds total

/* ---------------------------------------------------------------
   2. SEEDED RANDOM — every device derives IDENTICAL content
      from team name + role, so nothing needs to be stored in DB.
----------------------------------------------------------------*/
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function seededShuffle(arr, seed) {
  const rand = seededRandom(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function seedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  // Avalanche-mix the hash so near-identical inputs (e.g. "TEAM 1" vs "TEAM 2")
  // produce widely different seeds instead of off-by-one values.
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h || 1;
}

function missionsForRole(teamName, role) {
  const seed = seedFromString(teamName + role);
  return seededShuffle(POOLS[role], seed).slice(0, 3);
}

function fragmentForRole(teamName, role) {
  const seed = seedFromString(teamName + role);
  const rand = seededRandom(seed + 999);
  return String(10 + Math.floor(rand() * 89)).padStart(2, '0');
}

/* ---------------------------------------------------------------
   3. STATE
----------------------------------------------------------------*/
let state = null;
/*
  state = {
    teamId, teamName, role,
    missions: { A:[...], B:[...], C:[...] }  // content, derived locally
    row: { ...latest DB row... }
    channel: realtime channel
    timerInterval, alertInterval
  }
*/

/* ---------------------------------------------------------------
   4. SCREEN NAVIGATION
----------------------------------------------------------------*/
function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => { s.classList.remove('active'); s.style.display = ''; });
  const el = document.getElementById(id);
  el.classList.add('active');
  el.style.display = 'block';
}

/* ---------------------------------------------------------------
   5. BOOT / INTRO SEQUENCE
----------------------------------------------------------------*/
const BOOT_LINES = [
  '> INITIALIZING LAB-09 MAINFRAME...',
  '> CONNECTING TO SECURITY GRID... OK',
  '> SCANNING FOR INTRUSIONS...',
  '> !! ALERT: UNKNOWN ENTITY DETECTED — "NULLPOINT" !!',
  '> DIGITAL BOMB SIGNATURE FOUND IN CORE SYSTEM',
  '> ESTIMATED DETONATION: 25:00',
  '> REQUESTING FIELD AGENTS...',
];

function typeLines(lines, container, onDone) {
  let li = 0;
  function nextLine() {
    if (li >= lines.length) { onDone && onDone(); return; }
    const line = lines[li];
    let ci = 0;
    const p = document.createElement('div');
    container.appendChild(p);
    const iv = setInterval(() => {
      p.textContent = line.slice(0, ci + 1);
      ci++;
      if (ci >= line.length) {
        clearInterval(iv);
        li++;
        setTimeout(nextLine, 250);
      }
    }, 18);
  }
  nextLine();
}

function startIntro() {
  const bootLog = document.getElementById('boot-log');
  typeLines(BOOT_LINES, bootLog, () => {
    setTimeout(() => {
      bootLog.style.display = 'none';
      const introMain = document.getElementById('intro-main');
      introMain.hidden = false;
      triggerGlitchFlash();
      playTone(80, 0.4, 'sawtooth');
      const typeTarget = document.getElementById('intro-typewriter');
      typeLines([
        'LAB-09 has been infiltrated. A digital bomb is active inside the mainframe.',
        '9 squads have been activated. Each squad uses THREE separate devices — one per agent.',
        'You have 25 minutes. Three agents. Three vaults. One disarm code.',
        'Good luck, agents. LAB-09 is counting on you.',
      ], typeTarget, () => {
        document.getElementById('btn-start-mission').hidden = false;
      });
    }, 500);
  });
}

/* ---------------------------------------------------------------
   6. TEAM SELECTION → ROLE SELECTION
----------------------------------------------------------------*/
async function renderTeamGrid() {
  const grid = document.getElementById('team-grid');
  grid.innerHTML = '<p class="section-sub">Loading squad status...</p>';
  const { data, error } = await sb.from('team_state').select('team_id,finished');
  const finishedSet = new Set((data || []).filter((r) => r.finished).map((r) => r.team_id));

  grid.innerHTML = '';
  TEAMS.forEach((t) => {
    const done = finishedSet.has(t.id);
    const card = document.createElement('div');
    card.className = 'team-card' + (done ? ' done' : '');
    card.innerHTML = `<div class="tnum">${t.id}</div><div class="tlabel">TEAM ${t.id}${done ? '<br>(COMPLETED)' : ''}</div>`;
    card.addEventListener('click', async () => {
      if (done) {
        const replay = confirm(`TEAM ${t.id} already has a saved result. Replay this team? (previous score will be overwritten for everyone)`);
        if (!replay) return;
        await sb.from('team_state').delete().eq('team_id', t.id);
      }
      pickTeam(t.id);
    });
    grid.appendChild(card);
  });
}

function pickTeam(teamId) {
  state = {
    teamId,
    teamName: `TEAM ${teamId}`,
    role: null,
    missions: null,
    row: null,
    channel: null,
    timerInterval: null,
    alertInterval: null,
  };
  document.getElementById('role-team-name').textContent = state.teamName;
  document.getElementById('role-connect-status').textContent = '';
  showScreen('screen-role');
  refreshRolePickLocks();
}

async function refreshRolePickLocks() {
  // Show which agent roles are already claimed on OTHER devices isn't tracked server-side
  // (no per-device presence needed) — any agent may (re)join their role from their own device.
}

async function pickRole(role) {
  state.role = role;
  state.missions = missionsForRole(state.teamName, role);
  const statusEl = document.getElementById('role-connect-status');
  statusEl.textContent = 'Connecting to LAB-09 mainframe...';

  // Idempotent row creation: if the team row doesn't exist yet, create it. If it
  // already exists (another agent joined first), this does nothing and preserves state.
  await sb.from('team_state').upsert(
    { team_id: state.teamId, team_name: state.teamName },
    { onConflict: 'team_id', ignoreDuplicates: true }
  );

  const { data: row } = await sb.from('team_state').select('*').eq('team_id', state.teamId).single();
  state.row = row;

  subscribeRealtime();

  statusEl.textContent = 'Connected. Briefing incoming...';
  document.getElementById('briefing-team-name').textContent = `${state.teamName} — AGENT ${role}`;
  showScreen('screen-briefing');
  document.getElementById('screen-briefing').style.display = 'flex';
  typeLines([
    `Welcome, Agent ${role}. This is ECHO-9, the lab's last functioning AI core.`,
    'NULLPOINT has locked three vaults inside the mainframe. Each holds a fragment of the disarm code.',
    'Your teammates are connecting on their own devices right now. The mission timer starts the moment ANY of you deploys.',
  ], document.getElementById('briefing-text'), () => {});
}

function subscribeRealtime() {
  if (state.channel) sb.removeChannel(state.channel);
  state.channel = sb
    .channel(`team-${state.teamId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'team_state', filter: `team_id=eq.${state.teamId}` }, (payload) => {
      state.row = payload.new;
      onRemoteStateChange();
    })
    .subscribe();
}

/* ---------------------------------------------------------------
   7. DASHBOARD
----------------------------------------------------------------*/
async function enterDashboard() {
  document.getElementById('screen-briefing').style.display = 'none';
  showScreen('screen-dashboard');
  document.getElementById('dash-team-name').textContent = `${state.teamName} — AGENT ${state.role}`;

  await sb.rpc('start_timer', { p_team_id: state.teamId });
  const { data: row } = await sb.from('team_state').select('*').eq('team_id', state.teamId).single();
  state.row = row;

  renderVaults();
  updateScoreDisplay();
  startGlobalTimer();
  startAlertTicker();
}

function onRemoteStateChange() {
  if (document.getElementById('screen-dashboard').classList.contains('active')) {
    renderVaults();
    updateScoreDisplay();
  }
  if (state.row.finished && !state._handledFinish) {
    state._handledFinish = true;
    showFinalOutcome();
  }
}

function solvedArrayFor(role) {
  const key = 'solved_' + role.toLowerCase();
  return (state.row && state.row[key]) || [false, false, false];
}

function renderVaults() {
  ['A', 'B', 'C'].forEach((role) => {
    const solved = solvedArrayFor(role);
    const solvedCount = solved.filter(Boolean).length;
    document.getElementById(`vp-fill-${role}`).style.width = `${(solvedCount / 3) * 100}%`;
    document.getElementById(`vault-status-${role}`).textContent = `${solvedCount} / 3 STAGES`;
    const card = document.getElementById(`vault-${role.toLowerCase()}`);
    card.classList.toggle('complete', solvedCount === 3);
    card.classList.toggle('locked-other', role !== state.role);
    const btn = card.querySelector('.btn-vault');
    if (solvedCount === 3) btn.textContent = 'VAULT BREACHED ✓';
    else if (role !== state.role) btn.textContent = `AGENT ${role} ONLY`;
    else btn.textContent = 'ENTER VAULT';
  });
  checkAllVaultsComplete();
}

function checkAllVaultsComplete() {
  const allDone = ['A', 'B', 'C'].every((r) => solvedArrayFor(r).every(Boolean));
  document.getElementById('fusion-panel').classList.toggle('show', allDone);
}

function updateScoreDisplay() {
  const score = (state.row && state.row.score) || 0;
  const hintsUsed = (state.row && state.row.hints_used) || 0;
  document.getElementById('score-display').textContent = score;
  const timeLeft = computeTimeLeft();
  const pct = Math.max(0, 100 - hintsUsed * 3 - Math.floor(((GLOBAL_TIME_LIMIT - timeLeft) / GLOBAL_TIME_LIMIT) * 30));
  const clamped = Math.max(10, Math.min(100, pct));
  document.getElementById('stability-pct').textContent = clamped + '%';
  const fill = document.getElementById('stability-fill');
  fill.style.width = clamped + '%';
  fill.style.background = clamped > 60 ? 'var(--green)' : clamped > 30 ? 'var(--amber)' : 'var(--red)';
}

/* ---------------------------------------------------------------
   8. GLOBAL TIMER — derived from shared started_at, not per-device
----------------------------------------------------------------*/
function formatTime(sec) {
  sec = Math.max(0, sec);
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function computeTimeLeft() {
  if (!state.row || !state.row.started_at) return GLOBAL_TIME_LIMIT;
  const elapsed = Math.floor((Date.now() - new Date(state.row.started_at).getTime()) / 1000);
  return Math.max(0, GLOBAL_TIME_LIMIT - elapsed);
}

function startGlobalTimer() {
  const display = document.getElementById('main-timer');
  const miniDisplay = document.getElementById('clock-mini');
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(async () => {
    const timeLeft = computeTimeLeft();
    display.textContent = formatTime(timeLeft);
    if (miniDisplay) miniDisplay.textContent = formatTime(timeLeft);
    display.classList.remove('warn', 'danger');
    if (timeLeft <= 300) display.classList.add('danger');
    else if (timeLeft <= 900) display.classList.add('warn');
    updateScoreDisplay();

    if (timeLeft <= 0 && state.row && !state.row.finished) {
      clearInterval(state.timerInterval);
      await sb.rpc('finish_team', { p_team_id: state.teamId, p_outcome: 'timeout', p_points: 0 });
    }
  }, 1000);
}

/* ---------------------------------------------------------------
   9. ALERT TICKER / IMMERSION EVENTS
----------------------------------------------------------------*/
function startAlertTicker() {
  const tickerText = document.getElementById('alert-ticker-text');
  function fireAlert() {
    if (state.row && state.row.finished) return;
    const msg = ALERT_MESSAGES[Math.floor(Math.random() * ALERT_MESSAGES.length)];
    tickerText.textContent = '⚠ ' + msg;
    triggerGlitchFlash();
    if (Math.random() < 0.4) shakeScreen();
    playTone(220, 0.15, 'square');
  }
  fireAlert();
  clearInterval(state.alertInterval);
  state.alertInterval = setInterval(fireAlert, 45000 + Math.random() * 30000);
}

function shakeScreen() {
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 400);
}

function triggerGlitchFlash() {
  const f = document.getElementById('glitch-flash');
  f.classList.remove('active');
  void f.offsetWidth;
  f.classList.add('active');
}

/* ---------------------------------------------------------------
   10. SOUND (Web Audio synthesized — no external files needed)
----------------------------------------------------------------*/
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTone(freq, dur, type = 'sine', vol = 0.06) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.stop(ctx.currentTime + dur + 0.05);
  } catch (e) { /* audio unsupported — fail silently */ }
}
function playSuccessChime() {
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => playTone(f, 0.25, 'triangle', 0.08), i * 100));
}
function playErrorBuzz() { playTone(110, 0.3, 'sawtooth', 0.08); }
function playVictoryFanfare() {
  [392, 523, 659, 784, 988].forEach((f, i) => setTimeout(() => playTone(f, 0.4, 'triangle', 0.1), i * 150));
}

/* ---------------------------------------------------------------
   11. MISSION MODAL (only the device's OWN role may open its vault)
----------------------------------------------------------------*/
let activeMissionCtx = null;

function openVault(role) {
  if (role !== state.role) {
    alert(`This vault belongs to Agent ${role}. Switch devices with that agent to continue.`);
    return;
  }
  const solved = solvedArrayFor(role);
  const stageIdx = solved.findIndex((s) => !s);
  if (stageIdx === -1) return;
  const mission = state.missions[stageIdx];
  activeMissionCtx = { role, stageIdx, mission, timeLeft: MISSION_TIME_LIMIT, timerInterval: null, hintUsed: false };

  document.getElementById('modal-role-tag').textContent = `AGENT ${role} — ${ROLE_META[role].name}`;
  document.getElementById('modal-stage-tag').textContent = `STAGE ${stageIdx + 1} / 3`;
  document.getElementById('modal-mission-title').textContent = mission.title;
  document.getElementById('modal-feedback').textContent = '';
  document.getElementById('modal-feedback').className = 'modal-feedback';
  renderMissionBody(mission);

  document.getElementById('mission-modal').classList.add('show');
  startMissionTimer();
}

function renderMissionBody(mission) {
  const body = document.getElementById('modal-mission-body');
  let html = `<p>${mission.body}</p>`;
  if (mission.code) html += `<pre>${escapeHtml(mission.code)}</pre>`;

  if (mission.type === 'choice') {
    html += '<div class="choice-list">';
    mission.options.forEach((opt) => {
      html += `<button class="opt-btn" data-val="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`;
    });
    html += '</div>';
  } else {
    html += `<input type="text" id="mission-answer-input" placeholder="Type your answer...">`;
    html += `<div class="submit-row"><button class="btn-primary" id="btn-submit-answer">SUBMIT ▸</button></div>`;
  }
  body.innerHTML = html;

  if (mission.type === 'choice') {
    body.querySelectorAll('.opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => submitAnswer(btn.dataset.val, btn));
    });
  } else {
    document.getElementById('btn-submit-answer').addEventListener('click', () => {
      const val = document.getElementById('mission-answer-input').value;
      submitAnswer(val, null);
    });
    document.getElementById('mission-answer-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        submitAnswer(document.getElementById('mission-answer-input').value, null);
      }
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function normalize(str) {
  return String(str).trim().toUpperCase().replace(/\s+/g, ' ');
}

function startMissionTimer() {
  const timerEl = document.getElementById('modal-timer');
  clearInterval(activeMissionCtx.timerInterval);
  timerEl.classList.remove('danger');
  timerEl.textContent = formatTime(activeMissionCtx.timeLeft);
  activeMissionCtx.timerInterval = setInterval(() => {
    activeMissionCtx.timeLeft--;
    timerEl.textContent = formatTime(activeMissionCtx.timeLeft);
    if (activeMissionCtx.timeLeft <= 60) timerEl.classList.add('danger');
    if (activeMissionCtx.timeLeft <= 0) {
      clearInterval(activeMissionCtx.timerInterval);
      handleMissionTimeout();
    }
  }, 1000);
}

function pointsForElapsed(elapsedSec) {
  const m = elapsedSec / 60;
  if (m <= 2) return 100;
  if (m <= 4) return 80;
  if (m <= 6) return 60;
  if (m <= 8) return 40;
  return 20;
}

async function submitAnswer(value, btnEl) {
  if (!activeMissionCtx) return;
  const mission = activeMissionCtx.mission;
  const correct = normalize(value) === normalize(mission.answer);
  const feedback = document.getElementById('modal-feedback');

  if (correct) {
    if (btnEl) btnEl.classList.add('correct');
    feedback.textContent = '✓ ACCESS GRANTED — fragment secured.';
    feedback.className = 'modal-feedback ok';
    playSuccessChime();
    await finishMissionStage(true);
  } else {
    if (btnEl) {
      btnEl.classList.add('wrong');
      setTimeout(() => btnEl.classList.remove('wrong'), 600);
    }
    feedback.textContent = '✗ ACCESS DENIED — try again, agent.';
    feedback.className = 'modal-feedback bad';
    playErrorBuzz();
    shakeScreen();
  }
}

async function handleMissionTimeout() {
  const feedback = document.getElementById('modal-feedback');
  feedback.textContent = `⏱ TIME EXPIRED. Solution revealed: "${activeMissionCtx.mission.answer}"`;
  feedback.className = 'modal-feedback bad';
  playErrorBuzz();
  await finishMissionStage(false, true);
}

async function useHint() {
  if (!activeMissionCtx || activeMissionCtx.hintUsed) return;
  activeMissionCtx.hintUsed = true;
  await sb.rpc('use_hint', { p_team_id: state.teamId, p_role: activeMissionCtx.role, p_stage: activeMissionCtx.stageIdx + 1 });
  const feedback = document.getElementById('modal-feedback');
  feedback.textContent = `💡 HINT: ${activeMissionCtx.mission.hint}`;
  feedback.className = 'modal-feedback';
}

async function finishMissionStage(solvedNormally, timedOut = false) {
  clearInterval(activeMissionCtx.timerInterval);
  const elapsed = MISSION_TIME_LIMIT - activeMissionCtx.timeLeft;
  const pts = timedOut ? 20 : pointsForElapsed(elapsed);

  await sb.rpc('solve_mission', {
    p_team_id: state.teamId,
    p_role: activeMissionCtx.role,
    p_stage: activeMissionCtx.stageIdx + 1,
    p_points: pts,
  });
  const { data: row } = await sb.from('team_state').select('*').eq('team_id', state.teamId).single();
  state.row = row;
  renderVaults();
  updateScoreDisplay();

  setTimeout(() => closeMissionModal(), timedOut ? 2200 : 900);
}

function closeMissionModal() {
  if (activeMissionCtx) clearInterval(activeMissionCtx.timerInterval);
  activeMissionCtx = null;
  document.getElementById('mission-modal').classList.remove('show');
}

/* ---------------------------------------------------------------
   12. FUSION + BOMB DEFUSAL
----------------------------------------------------------------*/
function enterFusionScreen() {
  showScreen('screen-fusion');
  document.getElementById('frag-A').textContent = '??';
  document.getElementById('frag-B').textContent = '??';
  document.getElementById('frag-C').textContent = '??';
  document.getElementById('bomb-console').hidden = true;
  document.getElementById('disarm-input').value = '';
  document.getElementById('disarm-feedback').textContent = '';
}

async function fuseCodes() {
  const fragA = fragmentForRole(state.teamName, 'A');
  const fragB = fragmentForRole(state.teamName, 'B');
  const fragC = fragmentForRole(state.teamName, 'C');
  document.getElementById('frag-A').textContent = fragA;
  document.getElementById('frag-B').textContent = fragB;
  document.getElementById('frag-C').textContent = fragC;
  playSuccessChime();

  await sb.rpc('fuse_team', { p_team_id: state.teamId });

  const ledRow = document.getElementById('bomb-led-row');
  ledRow.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const led = document.createElement('div');
    led.className = 'bomb-led';
    led.textContent = '_';
    ledRow.appendChild(led);
  }
  document.getElementById('bomb-console').hidden = false;
}

async function attemptDisarm() {
  const input = document.getElementById('disarm-input');
  const expected = fragmentForRole(state.teamName, 'A') + fragmentForRole(state.teamName, 'B') + fragmentForRole(state.teamName, 'C');
  const feedback = document.getElementById('disarm-feedback');
  const leds = document.querySelectorAll('.bomb-led');
  const val = input.value.trim();

  val.padEnd(6, '_').split('').slice(0, 6).forEach((ch, i) => {
    if (leds[i]) leds[i].textContent = ch === '_' ? '_' : ch;
  });

  if (val === expected) {
    feedback.textContent = '✓ CODE ACCEPTED — DISARMING...';
    feedback.className = 'disarm-feedback ok';
    playVictoryFanfare();
    const timeLeft = computeTimeLeft();
    const bonus = timeLeft > 300 ? 100 : 0;
    await sb.rpc('finish_team', { p_team_id: state.teamId, p_outcome: 'success', p_points: 300 + bonus });
  } else {
    feedback.textContent = '✗ INCORRECT CODE — SYSTEM REJECTS INPUT.';
    feedback.className = 'disarm-feedback bad';
    playErrorBuzz();
    shakeScreen();
    triggerGlitchFlash();
  }
}

/* ---------------------------------------------------------------
   13. END SCREEN + LEADERBOARD (live, cross-device, cross-team)
----------------------------------------------------------------*/
async function showFinalOutcome() {
  clearInterval(state.timerInterval);
  clearInterval(state.alertInterval);

  const { data: row } = await sb.from('team_state').select('*').eq('team_id', state.teamId).single();
  state.row = row;

  showScreen('screen-end');
  const headline = document.getElementById('end-headline');
  if (row.final_outcome === 'success') {
    headline.textContent = 'BOMB DEFUSED — MISSION SUCCESS';
    headline.classList.remove('fail');
    launchConfetti();
  } else {
    headline.textContent = 'LABORATORY LOCKDOWN — MISSION PAUSED';
    headline.classList.add('fail');
  }
  document.getElementById('end-team-name').textContent = `${state.teamName} — AGENT ${state.role}`;
  document.getElementById('end-score').textContent = row.score;
  document.getElementById('end-time').textContent = formatTime(computeTimeLeft());
  document.getElementById('end-hints').textContent = row.hints_used;

  await renderLeaderboard();
}

async function renderLeaderboard() {
  const board = document.getElementById('leaderboard');
  board.innerHTML = '<p class="section-sub">Loading leaderboard...</p>';
  const { data, error } = await sb.from('team_state').select('team_id,team_name,score').order('score', { ascending: false });
  board.innerHTML = '';
  (data || []).forEach((r, i) => {
    const row = document.createElement('div');
    row.className = 'lb-row' + (i === 0 ? ' top' : '');
    row.innerHTML = `<span><span class="lb-rank">#${i + 1}</span>${r.team_name}</span><span>${r.score} pts</span>`;
    board.appendChild(row);
  });
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const colors = ['#00f5ff', '#ff2d95', '#39ff14', '#ffb800'];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    r: 4 + Math.random() * 5,
    c: colors[Math.floor(Math.random() * colors.length)],
    vy: 2 + Math.random() * 3,
    vx: -1.5 + Math.random() * 3,
    rot: Math.random() * 360,
  }));
  let frames = 0;
  function frame() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.y += p.vy; p.x += p.vx; p.rot += 6;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
      ctx.restore();
    });
    if (frames < 240) requestAnimationFrame(frame);
    else { canvas.style.display = 'none'; }
  }
  frame();
}

/* ---------------------------------------------------------------
   14. EVENT WIRING
----------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  startIntro();

  document.getElementById('btn-start-mission').addEventListener('click', () => {
    renderTeamGrid();
    showScreen('screen-teams');
  });

  document.getElementById('btn-reset-all').addEventListener('click', async () => {
    if (!confirm('Erase ALL saved team results and unlock every team? This cannot be undone.')) return;
    await sb.from('team_state').delete().neq('team_id', -1);
    renderTeamGrid();
  });

  document.querySelectorAll('.role-pick').forEach((card) => {
    card.addEventListener('click', () => pickRole(card.dataset.role));
  });

  document.getElementById('btn-deploy').addEventListener('click', enterDashboard);

  document.querySelectorAll('.btn-vault').forEach((btn) => {
    btn.addEventListener('click', () => openVault(btn.dataset.open));
  });

  document.getElementById('btn-close-modal').addEventListener('click', closeMissionModal);
  document.getElementById('btn-hint').addEventListener('click', useHint);

  document.getElementById('btn-goto-fusion').addEventListener('click', enterFusionScreen);
  document.getElementById('btn-fuse').addEventListener('click', fuseCodes);
  document.getElementById('btn-disarm').addEventListener('click', attemptDisarm);
  document.getElementById('disarm-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptDisarm();
  });

  document.getElementById('btn-restart').addEventListener('click', () => {
    if (state && state.channel) sb.removeChannel(state.channel);
    state = null;
    renderTeamGrid();
    showScreen('screen-teams');
  });
});
