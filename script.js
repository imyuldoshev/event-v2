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
  'OGOHLANTIRISH: 4-sektorda virus tarqalishi aniqlandi.',
  'Agent, sizda 15 daqiqa qoldi.',
  'Markaziy tizimda ruxsatsiz harakat aniqlandi.',
  'Laboratoriya xavfsizlik tizimi buzilgan.',
  'Favqulodda protokol faollashtirildi.',
  'NULLPOINT signaturasi aniqlandi — diqqat bo\'ling.',
  'Seyf tarmog\'ida quvvat tebranishi. Davom eting.',
  'Zaxira generatorlari faol. Tizimlar barqaror.',
  '2-shifrlash qatlami zaiflashmoqda. Tezroq harakat qiling.',
  'ECHO-9: Men hali siz bilan birgaman, agentlar.',
];

/* ---- AGENT A: ME'MOR — HTML / CSS / Git ko'nikmalari (10 ta savol, 3 tasi murakkabroq) ---- */
const POOL_A = [
  {
    id: 'a1', title: 'BUZILGAN MARKUP',
    body: `Labning xush kelibsiz banneri buzilgan. Sahifa to'g'ri ko'rinishi uchun HTML tegini tuzating.`,
    code: `<h1>WELCOME<h1>`,
    type: 'text', answer: '<h1>WELCOME</h1>',
    hint: 'Yopilish tegida "/" belgisi bo\'lishi kerak: </h1>',
  },
  {
    id: 'a2', title: 'HTML NIMANI BILDIRADI?',
    body: `HTML so'zining to'g'ri ma'nosini aniqlang.`,
    type: 'choice',
    options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup List', 'Hyperlink Text Manager'],
    answer: 'HyperText Markup Language',
    hint: 'Bu veb-sahifalar yaratish uchun standart MARKUP (belgilash) tili.',
  },
  {
    id: 'a3', title: 'CSS NIMANI BILDIRADI?',
    body: `CSS so'zining to'g'ri ma'nosini aniqlang.`,
    type: 'choice',
    options: ['Cascading Style Sheets', 'Computer Styling System', 'Creative Software Solution', 'Code Style Standard'],
    answer: 'Cascading Style Sheets',
    hint: 'U stillarni HTML elementlari bo\'ylab "kaskad" qilib o\'tkazadi.',
  },
  {
    id: 'a4', title: 'MATN RANGINI O\'ZGARTIRISH',
    body: `Matn RANGINI o'zgartiruvchi CSS xususiyati qaysi?`,
    type: 'choice',
    options: ['color', 'text-color', 'font-color', 'background'],
    answer: 'color',
    hint: 'Bu eng oddiy va to\'g\'ridan-to\'g\'ri nom — shunchaki "color".',
  },
  {
    id: 'a5', title: 'BUZILGAN HAVOLA PROTOKOLI',
    body: `Bu havola (anchor) tegi xavfsizlik kanalini ochmayapti. Atribut nomini tuzating.`,
    code: `<a herf="feed.html">Kanalni ochish</a>`,
    type: 'text', answer: '<a href="feed.html">Kanalni ochish</a>',
    hint: 'Atribut "href" deb yoziladi, "herf" emas.',
  },
  {
    id: 'a6', title: 'FLEXBOX FAOLLASHTIRISH',
    body: `Konteynerni Flexbox layoutga aylantiruvchi CSS qoidasi qaysi?`,
    type: 'choice',
    options: ['display: flex;', 'position: flex;', 'flex: display;', 'layout: flexbox;'],
    answer: 'display: flex;',
    hint: '"display" xususiyatiga "flex" qiymatini berasiz.',
  },
  {
    id: 'a7', title: 'GIT SNAPSHOT',
    body: `Stage qilingan o'zgarishlarning lokal snapshotini saqlaydigan Git buyrug'i qaysi?`,
    type: 'choice',
    options: ['git commit', 'git push', 'git pull', 'git clone'],
    answer: 'git commit',
    hint: '"push" GitHub\'ga yuboradi — ammo LOKAL snapshot buyrug\'i undan oldin keladi.',
  },
  {
    id: 'a8', title: 'YOPILMAGAN RO\'YXAT (MURAKKAB)',
    body: `Seyf inventar ro'yxatida to'g'ri yopilish tegi yo'q. Tuzating.`,
    code: `<ul>\n  <li>Kalit-karta</li>\n  <li>Nishon</li>\n</li>`,
    type: 'text', answer: '<ul>\n  <li>Kalit-karta</li>\n  <li>Nishon</li>\n</ul>',
    hint: '<ul> bilan ochilgan ro\'yxat </ul> bilan yopilishi kerak, </li> bilan emas.',
  },
  {
    id: 'a9', title: 'ID VA KLASS FARQI (MURAKKAB)',
    body: `CSS'da bir sahifada bir necha marta, ko'plab elementlarga qo'llash mumkin bo'lgan selektor turi qaysi: "id" yoki "class"?`,
    type: 'choice', options: ['class', 'id'],
    answer: 'class',
    hint: '"id" faqat BITTA elementga beriladi, "class" esa KO\'PLAB elementlarga qo\'llanadi.',
  },
  {
    id: 'a10', title: 'GIT NASHR TARTIBI (MURAKKAB)',
    body: `Yangi faylni birinchi marta GitHub'ga nashr qilish uchun bu uch buyruqning TO'G'RI tartibi qaysi?`,
    type: 'choice',
    options: ['git add → git commit → git push', 'git push → git commit → git add', 'git commit → git add → git push', 'git push → git add → git commit'],
    answer: 'git add → git commit → git push',
    hint: 'Avval TAYYORLAYSIZ (add), keyin SAQLAYSIZ (commit), keyin YUBORASIZ (push).',
  },
];

/* ---- AGENT B: ARVOH — Terminal / DevTools / HTTP / Domen (10 ta savol, 3 tasi murakkabroq) ---- */
const POOL_B = [
  {
    id: 'b1', title: 'TERMINAL: FAYLLARNI KO\'RISH',
    body: `Joriy papkadagi fayllarni ko'rsatadigan terminal buyrug'i qaysi?`,
    type: 'choice', options: ['ls', 'cd', 'rm', 'mkdir'],
    answer: 'ls',
    hint: '"LiSt" haqida o\'ylab ko\'ring — eng qisqa va keng tarqalgan ro\'yxat buyrug\'i.',
  },
  {
    id: 'b2', title: 'TERMINAL: YANGI PAPKA',
    body: `Yangi papka yaratadigan terminal buyrug'i qaysi?`,
    type: 'choice', options: ['mkdir', 'ls', 'cd', 'touch'],
    answer: 'mkdir',
    hint: '"mkdir" = "MaKe DIRectory" (papka yaratish).',
  },
  {
    id: 'b3', title: 'GOOGLE WORKSPACE: VIDEO QO\'NG\'IROQLAR',
    body: `Video qo'ng'iroqlar uchun ishlatiladigan Google Workspace vositasi qaysi?`,
    type: 'choice', options: ['Meet', 'Drive', 'Calendar', 'Gmail'],
    answer: 'Meet',
    hint: 'Google "Meet" — nomida aynan shu yozilgan.',
  },
  {
    id: 'b4', title: 'DEVTOOLS: TARMOQ KUZATUVI',
    body: `Sahifa yuboradigan va qabul qiladigan barcha so'rovlarni ko'rsatadigan Chrome DevTools bo'limi qaysi?`,
    type: 'choice', options: ['Network', 'Elements', 'Console', 'Sources'],
    answer: 'Network',
    hint: 'U sahifaning TARMOQ (network) trafigini kuzatadi.',
  },
  {
    id: 'b5', title: 'URL NIMA?',
    body: `"URL" nimani bildiradi?`,
    type: 'choice',
    options: ['Uniform Resource Locator', 'Universal Reading Link', 'User Request Line', 'Unified Route List'],
    answer: 'Uniform Resource Locator',
    hint: 'U internetdagi resursni BIR XIL TARTIBDA aniqlaydi (LOCATES).',
  },
  {
    id: 'b6', title: 'TERMINAL: PAPKA ICHIGA KIRISH',
    body: `Boshqa papka ichiga kirish (joriy papkani almashtirish) uchun terminal buyrug'i qaysi?`,
    type: 'choice', options: ['cd', 'ls', 'mkdir', 'pwd'],
    answer: 'cd',
    hint: '"cd" = "Change Directory" (papkani almashtirish).',
  },
  {
    id: 'b7', title: 'GOOGLE WORKSPACE: BULUTLI SAQLASH',
    body: `Fayllaringizni bulutda saqlovchi Google Workspace vositasi qaysi?`,
    type: 'choice', options: ['Drive', 'Meet', 'Calendar', 'Docs'],
    answer: 'Drive',
    hint: 'U fayllaringizni bulutli saqlash tomon "drive" qiladi (boshqaradi).',
  },
  {
    id: 'b8', title: 'CLIENT VS SERVER (MURAKKAB)',
    body: `Client-Server modelida sahifa yuklanishini boshlash uchun so'rov YUBORADIGAN tomon qaysi?`,
    type: 'choice', options: ['Client (brauzer)', 'Server', 'DNS', 'Domen'],
    answer: 'Client (brauzer)',
    hint: 'SIZ havolani bosasiz yoki URL kiritasiz — sizning brauzeringiz Client hisoblanadi.',
  },
  {
    id: 'b9', title: 'DOMEN SOTIB OLISH (MURAKKAB)',
    body: `Domen nomini sotib olish va DNS sozlash uchun mashhur platforma qaysi?`,
    type: 'choice', options: ['Namecheap', 'Instagram', 'Notion', 'Spotify'],
    answer: 'Namecheap',
    hint: 'Bu domen va DNS sozlash uchun ko\'p ishlatiladigan platforma.',
  },
  {
    id: 'b10', title: 'HTTP HOLAT KODI (MURAKKAB)',
    body: `"Sahifa topilmadi" degan ma'noni bildiruvchi HTTP holat kodi qaysi?`,
    type: 'text', answer: '404',
    hint: 'Bu butun internetdagi eng mashhur xato kodi.',
  },
];

/* ---- AGENT C: BASHORATCHI — Startap tafakkuri / AI / Self-study (10 ta savol, 3 tasi murakkabroq) ---- */
const POOL_C = [
  {
    id: 'c1', title: 'MVP NIMA?',
    body: `Startap tilida "MVP" nimani bildiradi?`,
    type: 'choice',
    options: ['Minimum Viable Product', 'Most Valuable Player', 'Maximum Value Plan', 'Main Vision Project'],
    answer: 'Minimum Viable Product',
    hint: 'Bu mahsulotning ishlaydigan va sinab ko\'rish mumkin bo\'lgan eng kichik versiyasi.',
  },
  {
    id: 'c2', title: 'SHAXSIY DASHBOARD VOSITASI',
    body: `Shaxsiy eslatmalar va dashboardlarni tashkillashtirish uchun ko'p ishlatiladigan vosita qaysi?`,
    type: 'choice', options: ['Notion', 'Trello', 'Gmail', 'Calendar'],
    answer: 'Notion',
    hint: 'Bu vosita eslatmalar, hujjatlar va dashboardlarni bitta ish maydonida birlashtiradi.',
  },
  {
    id: 'c3', title: 'HAFTALIK REJA TUZISH',
    body: `Har hafta boshida o'z vazifalaringizni oldindan rejalashtirish nimaga eng ko'p yordam beradi?`,
    type: 'choice',
    options: [
      'Vaqtni samarali boshqarish va muhim ishlarni unutmaslik',
      'Faqat chiroyli jadval chizish',
      'O\'qishni butunlay to\'xtatish',
      'Faqat o\'yin o\'ynashga vaqt topish',
    ],
    answer: 'Vaqtni samarali boshqarish va muhim ishlarni unutmaslik',
    hint: 'Reja — bu vaqtingizni ongli boshqarish vositasi.',
  },
  {
    id: 'c4', title: 'STARTAPNING BIRINCHI QADAMI',
    body: `Har qanday startap mahsulotini yaratishdan oldin BIRINCHI qadam nima?`,
    type: 'choice',
    options: ['Haqiqiy muammoni aniqlash', 'Logotip dizayn qilish', 'Katta jamoa yollash', 'Domen nomi sotib olish'],
    answer: 'Haqiqiy muammoni aniqlash',
    hint: 'Har bir yaxshi startap hal qilishga arzigulik MUAMMOni topishdan boshlanadi.',
  },
  {
    id: 'c5', title: 'PROMPT NIMA?',
    body: `ChatGPT yoki Claude kabi AI bilan gaplashganda, kiritadigan ko'rsatmangizni nima deb ataymiz?`,
    type: 'choice', options: ['Prompt', 'Query string', 'Command line', 'Script'],
    answer: 'Prompt',
    hint: 'Bu AIni javob berishga "undaydigan" (prompts) matn.',
  },
  {
    id: 'c6', title: 'DEBUGGING TAFAKKURI',
    body: `To'g'ri yoki noto'g'ri: Xato xabarlarini diqqat bilan o'qish xatolarni tezroq tuzatishga yordam beradi.`,
    type: 'choice', options: ['To\'g\'ri', 'Noto\'g\'ri'],
    answer: 'To\'g\'ri',
    hint: 'Xato xabarlari odatda nima va qayerda xato ketganini aniq aytadi.',
  },
  {
    id: 'c7', title: 'DOCUMENTATION O\'QISH',
    body: `Yangi vosita yoki dasturdan foydalanishni o'rganishning ENG ishonchli yo'li qaysi?`,
    type: 'choice',
    options: [
      'Rasmiy documentation (hujjat)ni o\'qish',
      'Hech narsa o\'qimasdan tasodifiy sinab ko\'rish',
      'Faqat do\'stdan so\'rab, o\'zi tekshirmaslik',
      'Hech kimga aytmaslik',
    ],
    answer: 'Rasmiy documentation (hujjat)ni o\'qish',
    hint: 'Rasmiy hujjat har doim eng aniq va to\'g\'ri ma\'lumot manbai hisoblanadi.',
  },
  {
    id: 'c8', title: 'SELF-STUDY NIMA UCHUN MUHIM (MURAKKAB)',
    body: `Self-study (mustaqil o'qish) IT mutaxassisi uchun zarur ko'nikma bo'lishining ENG YAXSHI sababi qaysi?`,
    type: 'choice',
    options: [
      'Texnologiya tez o\'zgaradi — kurs tugagandan keyin ham o\'qishni davom ettirishingiz kerak',
      'Bu sizga endi ustoz kerak emasligini bildiradi',
      'Bu hujjatlarni o\'qish zaruriyatini yo\'q qiladi',
      'Bu faqat universitet talabalari uchun muhim',
    ],
    answer: 'Texnologiya tez o\'zgaradi — kurs tugagandan keyin ham o\'qishni davom ettirishingiz kerak',
    hint: 'Hech qaysi kurs HAMMA narsani o\'rgata olmaydi — texnologiya rivojlanishda davom etadi, shuning uchun o\'qish to\'xtamaydi.',
  },
  {
    id: 'c9', title: 'QURISH VS SINASH (MURAKKAB)',
    body: `MVP yaratishda, odatda nima BIRINCHI bo'lishi kerak: barcha mumkin bo'lgan funksiyalarni qurish, yoki oddiy versiyani haqiqiy foydalanuvchilar bilan sinash?`,
    type: 'choice',
    options: ['Oddiy versiyani haqiqiy foydalanuvchilar bilan sinash', 'Avval barcha mumkin bo\'lgan funksiyalarni qurish'],
    answer: 'Oddiy versiyani haqiqiy foydalanuvchilar bilan sinash',
    hint: 'MVP = MINIMUM ishlaydigan mahsulot — katta qurishdan oldin kichik sinaysiz.',
  },
  {
    id: 'c10', title: 'PROMPT YOZISHDAN OLDIN (MURAKKAB)',
    body: `AIga prompt yozishdan OLDIN o'zingizdan so'rashingiz kerak bo'lgan ENG YAXSHI savol qaysi?`,
    type: 'choice',
    options: [
      'Men aniq qanday natija xohlayman va AI qanday kontekstni bilishi kerak?',
      'Mening promptim necha belgi bo\'lishi mumkin?',
      'Qaysi AI kompaniyasi eng mashhur?',
      'Javob qaysi shriftda bo\'ladi?',
    ],
    answer: 'Men aniq qanday natija xohlayman va AI qanday kontekstni bilishi kerak?',
    hint: 'Aniq maqsad + yetarli kontekst = ancha yaxshi AI javobi.',
  },
];

const POOLS = { A: POOL_A, B: POOL_B, C: POOL_C };
const ROLE_META = {
  A: { name: 'ME\'MOR', desc: 'HTML va Mantiq' },
  B: { name: 'ARVOH', desc: 'Shifr va Tekshiruv' },
  C: { name: 'BASHORATCHI', desc: 'AI va Topishmoqlar' },
};

const MISSION_TIME_LIMIT = 8 * 60; // seconds per mission stage
const GLOBAL_TIME_LIMIT = 30 * 60; // seconds total
const WRONG_ANSWER_PENALTY_1 = 10; // first wrong attempt
const WRONG_ANSWER_PENALTY_2 = 15; // second wrong attempt, then auto-skip
const MAX_ANSWER_ATTEMPTS = 2;

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

// Display-only label — the internal "TEAM N" string stays unchanged so existing
// fragment/mission seeds keep working; only the on-screen text is in Uzbek.
function teamDisplayName(teamName) {
  return teamName.replace('TEAM', 'JAMOA');
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
  '> LAB-09 MARKAZIY TIZIMI ISHGA TUSHIRILMOQDA...',
  '> XAVFSIZLIK TARMOG\'IGA ULANISH... OK',
  '> BUZIB KIRISHLAR SKANERLANMOQDA...',
  '> !! OGOHLANTIRISH: NOMA\'LUM OBYEKT ANIQLANDI — "NULLPOINT" !!',
  '> MARKAZIY TIZIMDA RAQAMLI BOMBA SIGNATURASI TOPILDI',
  '> TAXMINIY PORTLASH VAQTI: 30:00',
  '> MAYDON AGENTLARI SO\'RALMOQDA...',
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
        'LAB-09 buzib kirilgan. Markaziy tizim ichida raqamli bomba faol.',
        '9 ta jamoa faollashtirildi. Har bir jamoa UCHTA alohida qurilmadan foydalanadi — har agentga bittadan.',
        'Sizda 30 daqiqa bor. Uch agent. Uch seyf. Bitta o\'chirish kodi.',
        'Omad tilaymiz, agentlar. LAB-09 sizga umid bog\'lagan.',
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
  grid.innerHTML = '<p class="section-sub">Jamoalar holati yuklanmoqda...</p>';
  const { data, error } = await sb.from('team_state').select('team_id,finished');
  const finishedSet = new Set((data || []).filter((r) => r.finished).map((r) => r.team_id));

  grid.innerHTML = '';
  TEAMS.forEach((t) => {
    const done = finishedSet.has(t.id);
    const card = document.createElement('div');
    card.className = 'team-card' + (done ? ' done' : '');
    card.innerHTML = `<div class="tnum">${t.id}</div><div class="tlabel">JAMOA ${t.id}${done ? '<br>(YAKUNLANGAN)' : ''}</div>`;
    card.addEventListener('click', async () => {
      if (done) {
        const replay = confirm(`JAMOA ${t.id} uchun natija allaqachon saqlangan. Qayta o'ynashni xohlaysizmi? (oldingi ball hamma uchun o'chiriladi)`);
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
  document.getElementById('role-team-name').textContent = teamDisplayName(state.teamName);
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
  statusEl.textContent = 'LAB-09 markaziy tizimiga ulanish...';

  // Idempotent row creation: if the team row doesn't exist yet, create it. If it
  // already exists (another agent joined first), this does nothing and preserves state.
  await sb.from('team_state').upsert(
    { team_id: state.teamId, team_name: state.teamName },
    { onConflict: 'team_id', ignoreDuplicates: true }
  );

  const { data: row } = await sb.from('team_state').select('*').eq('team_id', state.teamId).single();
  state.row = row;

  subscribeRealtime();

  if (row && row.finished) {
    // This team already completed its mission before this device joined —
    // go straight to the result instead of replaying a "fresh" briefing.
    showFinalOutcome();
    return;
  }

  statusEl.textContent = 'Ulandi. Brifing keladi...';
  document.getElementById('briefing-team-name').textContent = `${teamDisplayName(state.teamName)} — AGENT ${role}`;
  showScreen('screen-briefing');
  document.getElementById('screen-briefing').style.display = 'flex';
  typeLines([
    `Xush kelibsiz, Agent ${role}. Bu ECHO-9 — labning so'nggi ishlaydigan AI yadrosi.`,
    'NULLPOINT markaziy tizim ichidagi uchta seyfni qulflagan. Har birida o\'chirish kodining bir bo\'lagi bor.',
    'Jamoadoshlaringiz hozir o\'z qurilmalaridan ulanmoqda. Missiya taymeri sizlardan BIRINGIZ joylashgan zahoti boshlanadi.',
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
  document.getElementById('dash-team-name').textContent = `${teamDisplayName(state.teamName)} — AGENT ${state.role}`;

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
    document.getElementById(`vault-status-${role}`).textContent = `${solvedCount} / 3 BOSQICH`;
    const card = document.getElementById(`vault-${role.toLowerCase()}`);
    card.classList.toggle('complete', solvedCount === 3);
    card.classList.toggle('locked-other', role !== state.role);
    const btn = card.querySelector('.btn-vault');
    if (solvedCount === 3) btn.textContent = 'SEYF OCHILDI ✓';
    else if (role !== state.role) btn.textContent = `FAQAT AGENT ${role} UCHUN`;
    else btn.textContent = 'SEYFGA KIRISH';
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
    alert(`Bu seyf Agent ${role}ga tegishli. Davom etish uchun shu agentning qurilmasiga o'ting.`);
    return;
  }
  const solved = solvedArrayFor(role);
  const stageIdx = solved.findIndex((s) => !s);
  if (stageIdx === -1) return;
  const mission = state.missions[stageIdx];
  activeMissionCtx = { role, stageIdx, mission, timeLeft: MISSION_TIME_LIMIT, timerInterval: null, hintUsed: false, wrongAttempts: 0 };

  document.getElementById('modal-role-tag').textContent = `AGENT ${role} — ${ROLE_META[role].name}`;
  document.getElementById('modal-stage-tag').textContent = `BOSQICH ${stageIdx + 1} / 3`;
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
    html += `<input type="text" id="mission-answer-input" placeholder="Javobingizni kiriting...">`;
    html += `<div class="submit-row"><button class="btn-primary" id="btn-submit-answer">YUBORISH ▸</button></div>`;
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
    feedback.textContent = '✓ KIRISH RUXSAT ETILDI — bo\'lak qo\'lga olindi.';
    feedback.className = 'modal-feedback ok';
    playSuccessChime();
    await finishMissionStage(true);
  } else {
    if (btnEl) {
      btnEl.classList.add('wrong');
      setTimeout(() => btnEl.classList.remove('wrong'), 600);
    }
    activeMissionCtx.wrongAttempts++;
    playErrorBuzz();
    shakeScreen();

    if (activeMissionCtx.wrongAttempts >= MAX_ANSWER_ATTEMPTS) {
      const penalty = WRONG_ANSWER_PENALTY_1 + WRONG_ANSWER_PENALTY_2;
      await sb.rpc('penalize_wrong', { p_team_id: state.teamId, p_points: penalty });
      feedback.textContent = `✗ IKKI MARTA XATO (-${penalty} ball) — seyf avtomatik keyingi bosqichga o'tmoqda...`;
      feedback.className = 'modal-feedback bad';
      await finishMissionStage(false, false, true);
    } else {
      await sb.rpc('penalize_wrong', { p_team_id: state.teamId, p_points: WRONG_ANSWER_PENALTY_1 });
      feedback.textContent = `✗ XATO JAVOB (-${WRONG_ANSWER_PENALTY_1} ball) — yana bir bor urinib ko'ring, agent.`;
      feedback.className = 'modal-feedback bad';
      const { data: row } = await sb.from('team_state').select('*').eq('team_id', state.teamId).single();
      state.row = row;
      updateScoreDisplay();
    }
  }
}

async function handleMissionTimeout() {
  const feedback = document.getElementById('modal-feedback');
  feedback.textContent = `⏱ VAQT TUGADI. Yechim ochildi: "${activeMissionCtx.mission.answer}"`;
  feedback.className = 'modal-feedback bad';
  playErrorBuzz();
  await finishMissionStage(false, true);
}

async function useHint() {
  if (!activeMissionCtx || activeMissionCtx.hintUsed) return;
  activeMissionCtx.hintUsed = true;
  await sb.rpc('use_hint', { p_team_id: state.teamId, p_role: activeMissionCtx.role, p_stage: activeMissionCtx.stageIdx + 1 });
  const feedback = document.getElementById('modal-feedback');
  feedback.textContent = `💡 MASLAHAT: ${activeMissionCtx.mission.hint}`;
  feedback.className = 'modal-feedback';
}

async function finishMissionStage(solvedNormally, timedOut = false, skipped = false) {
  clearInterval(activeMissionCtx.timerInterval);
  const elapsed = MISSION_TIME_LIMIT - activeMissionCtx.timeLeft;
  const pts = skipped ? 0 : timedOut ? 20 : pointsForElapsed(elapsed);

  const { error: rpcError } = await sb.rpc('solve_mission', {
    p_team_id: state.teamId,
    p_role: activeMissionCtx.role,
    p_stage: activeMissionCtx.stageIdx + 1,
    p_points: pts,
  });
  if (rpcError) {
    const feedback = document.getElementById('modal-feedback');
    feedback.textContent = '⚠ ULANISH UZILDI — progress saqlanmadi. Wi-Fi\'ni tekshirib, qayta yuboring.';
    feedback.className = 'modal-feedback bad';
    startMissionTimer(); // resume the stage timer instead of silently advancing
    return;
  }
  const { data: row } = await sb.from('team_state').select('*').eq('team_id', state.teamId).single();
  state.row = row;
  renderVaults();
  updateScoreDisplay();

  const role = activeMissionCtx.role;
  setTimeout(() => {
    const solved = solvedArrayFor(role);
    const nextStageIdx = solved.findIndex((s) => !s);
    if (nextStageIdx === -1) {
      closeMissionModal();
    } else {
      openVault(role); // auto-advance to the next stage without leaving the vault
    }
  }, (timedOut || skipped) ? 2200 : 900);
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

  const { error } = await sb.rpc('fuse_team', { p_team_id: state.teamId });
  if (error) {
    alert('⚠ Ulanish uzildi — birlashtirish bonusi saqlanmadi. Wi-Fi\'ni tekshirib, "KODLARNI BIRLASHTIRISH" tugmasini qayta bosing.');
    return;
  }

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
    feedback.textContent = '✓ KOD QABUL QILINDI — O\'CHIRILMOQDA...';
    feedback.className = 'disarm-feedback ok';
    playVictoryFanfare();
    const timeLeft = computeTimeLeft();
    const bonus = timeLeft > 300 ? 100 : 0;
    const { error } = await sb.rpc('finish_team', { p_team_id: state.teamId, p_outcome: 'success', p_points: 300 + bonus });
    if (error) {
      feedback.textContent = '⚠ ULANISH UZILDI — kod to\'g\'ri edi, ammo saqlanmadi. Wi-Fi\'ni tekshirib, qayta bosing.';
      feedback.className = 'disarm-feedback bad';
    }
  } else {
    feedback.textContent = '✗ XATO KOD — TIZIM QABUL QILMADI.';
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
  closeMissionModal();

  const { data: row } = await sb.from('team_state').select('*').eq('team_id', state.teamId).single();
  state.row = row;

  showScreen('screen-end');
  const headline = document.getElementById('end-headline');
  if (row.final_outcome === 'success') {
    headline.textContent = 'BOMBA O\'CHIRILDI — MISSIYA MUVAFFAQIYATLI';
    headline.classList.remove('fail');
    launchConfetti();
  } else {
    headline.textContent = 'LABORATORIYA QULFLANDI — MISSIYA TO\'XTATILDI';
    headline.classList.add('fail');
  }
  document.getElementById('end-team-name').textContent = `${teamDisplayName(state.teamName)} — AGENT ${state.role}`;
  document.getElementById('end-score').textContent = row.score;
  document.getElementById('end-time').textContent = formatTime(computeTimeLeft());
  document.getElementById('end-hints').textContent = row.hints_used;

  await renderLeaderboard();
}

async function renderLeaderboard() {
  const board = document.getElementById('leaderboard');
  board.innerHTML = '<p class="section-sub">Reyting jadvali yuklanmoqda...</p>';
  const { data, error } = await sb.from('team_state').select('team_id,team_name,score').order('score', { ascending: false });
  board.innerHTML = '';
  (data || []).forEach((r, i) => {
    const row = document.createElement('div');
    row.className = 'lb-row' + (i === 0 ? ' top' : '');
    row.innerHTML = `<span><span class="lb-rank">#${i + 1}</span>${teamDisplayName(r.team_name)}</span><span>${r.score} ball</span>`;
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
    if (!confirm('BARCHA jamoalarning natijalarini o\'chirib, hammasini qaytadan ochishni xohlaysizmi? Buni qaytarib bo\'lmaydi.')) return;
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
