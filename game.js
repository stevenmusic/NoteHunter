/* =========================
   SVG ICONS（原樣保留）
========================= */

const TREBLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="150" viewBox="0 0 36 150" style="position:absolute;left:6px;top:16px;overflow:visible;"><path fill="#1a1a1a" d="M 18,4 C 20,4 24,8 24,14 C 24,22 20,30 16,38 C 22,34 28,36 30,42 C 33,50 30,60 24,64 C 20,67 15,68 12,66 C 8,64 6,60 6,55 C 6,48 10,43 16,42 C 20,41 24,43 26,47 C 28,51 27,57 24,60 C 21,63 17,63 15,61 C 13,59 13,56 15,54 C 17,52 20,53 20,55 C 20,57 18,58 17,57 C 16,56 17,54 18,55 L 18,55 C 16,53 14,54 14,57 C 14,60 16,63 19,64 C 23,65 27,62 28,58 C 29,54 27,49 24,47 C 21,45 16,45 13,47 C 9,50 8,55 9,61 C 10,67 14,71 19,72 C 25,73 30,69 32,64 C 35,57 33,48 29,42 C 26,37 21,34 16,35 C 20,26 23,16 22,8 C 21,5 19,3 18,4 Z M 18,74 C 18,74 18,110 18,125 C 16,130 12,133 10,138 C 8,142 9,146 12,147 C 16,148 20,145 22,141 C 24,137 23,132 20,129 C 19,127 18,126 18,125 "/></svg>`;

const BASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60" style="position:absolute;left:8px;top:58px;overflow:visible;"><path fill="#1a1a1a" d="M 6,12 C 6,12 8,2 16,2 C 24,2 30,10 30,22 C 30,36 22,46 10,50 C 8,51 6,51 6,50 C 6,49 8,49 10,48 C 20,44 26,35 26,22 C 26,12 21,6 16,6 C 11,6 9,10 9,14 C 9,18 11,20 14,20 C 17,20 19,18 19,15 C 19,13 17,11 15,12 C 14,12 13,13 14,14 C 15,15 16,14 16,13 C 15,12 14,13 14,14 Z "/><circle fill="#1a1a1a" cx="38" cy="9"  r="4"/><circle fill="#1a1a1a" cx="38" cy="21" r="4"/></svg>`;

const WHOLE_NOTE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="22" viewBox="-15 -11 30 22"><ellipse cx="0" cy="0" rx="12" ry="7.5" fill="none" stroke="#1a1a1a" stroke-width="3.5"/></svg>`;

const ICON_WEAPON_SVG = `<svg width="40" height="40" viewBox="0 0 64 64"><path fill="#e6c229" d="M52 12L44 4L20 28L24 32Z"/></svg>`;

const ICON_ARMOR_SVG = `<svg width="40" height="40" viewBox="0 0 64 64"><path fill="#4a526d" d="M12 8C24 4 40 4 52 8L56 24C56 44 44 56 32 60C20 56 8 44 8 24Z"/></svg>`;

const ICON_SHIELD_SVG = `<svg width="40" height="40" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#3a2d45"/></svg>`;

/* =========================
   PLAYER DATA（完整保留）
========================= */

let player = {
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  gold: 1200,
  hp: 100,
  atk: 10,
  def: 5,
  critChance: 0.12,
  critMultiplier: 1.5,

  weapon: { name: "雷神之怒・碎空", atkBonus: 120, rarity: "legendary" },
  armor: { name: "殘破布質外衣", hpBonus: 10, rarity: "common" },
  shield: { name: "阿瓦隆・永恆結界盾", defBonus: 320, rarity: "mythic" }
};

let currentNote = null;
let currentMode = "treble";
let score = 0;
let combo = 0;

/* =========================
   NOTE POSITIONS（保留）
========================= */

const notePositions = {
  treble: [
    { name:"C4", note:"C", top:150, ledgerLines:[150] },
    { name:"D4", note:"D", top:140, ledgerLines:[] },
    { name:"E4", note:"E", top:130, ledgerLines:[] },
    { name:"F4", note:"F", top:120, ledgerLines:[] },
    { name:"G4", note:"G", top:110, ledgerLines:[] },
    { name:"A4", note:"A", top:100, ledgerLines:[] },
    { name:"B4", note:"B", top:90, ledgerLines:[] }
  ],
  bass: [
    { name:"C3", note:"C", top:100, ledgerLines:[] },
    { name:"D3", note:"D", top:90, ledgerLines:[] },
    { name:"E3", note:"E", top:80, ledgerLines:[] },
    { name:"F3", note:"F", top:70, ledgerLines:[] },
    { name:"G3", note:"G", top:60, ledgerLines:[] }
  ]
};

/* =========================
   INIT（修正刷新問題）
========================= */

document.addEventListener("DOMContentLoaded", () => {
  switchPage("homePage");
  updateUI();
  updateExpUI();
});

/* =========================
   PAGE SWITCH（安全修正）
========================= */

function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");

  if (id === "characterPage") updateCharacter();
  if (id === "shopPage") renderShop();
}

/* =========================
   GAME CORE（保留 + 修正）
========================= */

function startGame(mode) {
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
}

function nextNote() {
  const pool = notePositions[currentMode] || notePositions.treble;

  const q = pool[Math.floor(Math.random() * pool.length)];
  currentNote = q.note;

  const noteEl = document.getElementById("noteNote");
  if (!noteEl) return;

  noteEl.style.top = q.top + "px";
  noteEl.innerHTML = WHOLE_NOTE_SVG;

  const clef = document.getElementById("staffClef");
  if (clef) clef.innerHTML = currentMode === "bass" ? BASS_SVG : TREBLE_SVG;

  document.querySelectorAll(".dynamic-ledger").forEach(l => l.remove());

  const container = document.querySelector(".note-container");
  if (container) {
    q.ledgerLines.forEach(top => {
      const line = document.createElement("div");
      line.className = "dynamic-ledger";
      line.style.top = top + "px";
      container.appendChild(line);
    });
  }
}

/* =========================
   ANSWER（防呆）
========================= */

function answer(n) {
  if (!currentNote) return;

  if (n === currentNote) {
    const crit = Math.random() < player.critChance;
    let dmg = player.atk + (player.weapon?.atkBonus || 0);
    if (crit) dmg *= player.critMultiplier;

    score += Math.floor(dmg);
    combo++;

    player.exp += 15;
    player.gold += 5;

    levelUp();
  } else {
    combo = 0;
  }

  updateUI();
  updateExpUI();
  nextNote();
}

/* =========================
   LEVEL SYSTEM（保留）
========================= */

function levelUp() {
  while (player.exp >= player.level * player.expToNextLevel) {
    player.level++;
    player.hp += 25;
    player.atk += 6;
    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.12);
  }
}

/* =========================
   UI UPDATE（防呆）
========================= */

function updateUI() {
  const s = document.getElementById("score");
  const c = document.getElementById("combo");
  const g = document.getElementById("goldDisplay");

  if (s) s.innerText = "Score: " + score;
  if (c) c.innerText = "Combo: " + combo;
  if (g) g.innerText = "💰 " + player.gold;
}

function updateExpUI() {
  const fill = document.getElementById("expFill");
  const text = document.getElementById("expText");
  const level = document.getElementById("levelText");

  const cur = player.exp % player.expToNextLevel;
  const percent = (cur / player.expToNextLevel) * 100;

  if (fill) fill.style.width = percent + "%";
  if (text) text.innerText = `EXP ${cur} / ${player.expToNextLevel}`;
  if (level) level.innerText = "Lv." + player.level;
}

/* =========================
   CHARACTER（保留）
========================= */

function updateCharacter() {
  const el = document.getElementById("stats");
  if (!el) return;

  el.innerHTML = `
    ⚔️ ATK: ${player.atk + (player.weapon?.atkBonus || 0)}<br>
    ❤️ HP: ${player.hp}<br>
    🛡 DEF: ${player.def + (player.shield?.defBonus || 0)}
  `;
}

/* =========================
   SHOP（完整保留）
========================= */

const shopItems = [
  { type:"weapon", name:"炎獄魔刃", bonus:180, rarity:"rare", cost:620 },
  { type:"weapon", name:"雷神之怒・碎空", bonus:280, rarity:"legendary", cost:1350 },
  { type:"armor", name:"龍鱗聖鎧", bonus:120, rarity:"rare", cost:580 },
  { type:"shield", name:"泰坦壁壘", bonus:280, rarity:"legendary", cost:950 }
];

function renderShop() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  grid.innerHTML = "";

  shopItems.forEach((item, i) => {
    const equipped = player[item.type];
    const isOwned = equipped?.name === item.name;

    const div = document.createElement("div");
    div.className = "shop-item";

    div.innerHTML = `
      <div>
        ${item.name}
      </div>

      <button onclick="buyItem(${i})">
        ${isOwned ? "已裝備" : "💰 " + item.cost}
      </button>
    `;

    grid.appendChild(div);
  });
}

function buyItem(i) {
  const item = shopItems[i];

  if (player.gold < item.cost) return;

  player.gold -= item.cost;

  player[item.type] = {
    name: item.name,
    [`${item.type}Bonus`]: item.bonus,
    rarity: item.rarity
  };

  updateUI();
  renderShop();
}

/* =========================
   BACK
========================= */

function backHome() {
  switchPage("homePage");
}
