/* =========================
   SVG（完整恢復你原本版本）
========================= */

const TREBLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="150" viewBox="0 0 36 150"><path fill="#1a1a1a" d="M18,4C20,4,24,8,24,14C24,22,20,30,16,38C22,34,28,36,30,42C33,50,30,60,24,64C20,67,15,68,12,66C8,64,6,60,6,55C6,48,10,43,16,42Z"/></svg>`;

const BASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60"><path fill="#1a1a1a" d="M6,12C6,12,8,2,16,2C24,2,30,10,30,22C30,36,22,46,10,50Z"/></svg>`;

const WHOLE_NOTE_SVG = `<svg width="30" height="22" viewBox="-15 -11 30 22"><ellipse cx="0" cy="0" rx="12" ry="7.5" fill="none" stroke="#1a1a1a" stroke-width="3.5"/></svg>`;

/* 🔥 裝備 ICON（恢復視覺重點） */
const ICON_WEAPON_SVG = `<svg width="40" height="40" viewBox="0 0 64 64">
<path fill="#e6c229" d="M52 12L44 4L20 28L24 32Z"/>
<circle cx="50" cy="10" r="4" fill="#00e5ff"/></svg>`;

const ICON_ARMOR_SVG = `<svg width="40" height="40" viewBox="0 0 64 64">
<path fill="#4a526d" d="M12 8C24 4 40 4 52 8L56 24C56 44 44 56 32 60C20 56 8 44 8 24Z"/>
<path fill="#ffcc00" d="M32 20L38 30L28 30Z"/></svg>`;

const ICON_SHIELD_SVG = `<svg width="40" height="40" viewBox="0 0 64 64">
<circle cx="32" cy="32" r="28" fill="#3a2d45"/>
<path fill="#ff0055" d="M32 10L38 28L56 28L40 38L46 56L32 44L18 56L24 38L8 28L26 28Z"/></svg>`;

/* =========================
   PLAYER（保留不動）
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
   NOTE DATA（保留）
========================= */

const notePositions = {
  treble: [
    { note:"C", top:150 }, { note:"D", top:140 },
    { note:"E", top:130 }, { note:"F", top:120 },
    { note:"G", top:110 }, { note:"A", top:100 },
    { note:"B", top:90 }
  ],
  bass: [
    { note:"C", top:100 }, { note:"D", top:90 },
    { note:"E", top:80 }, { note:"F", top:70 },
    { note:"G", top:60 }
  ]
};

/* =========================
   INIT FIX
========================= */

document.addEventListener("DOMContentLoaded", () => {
  switchPage("homePage");
  updateUI();
  updateExpUI();
});

/* =========================
   PAGE SWITCH（安全）
========================= */

function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");

  if (id === "characterPage") updateCharacter();
  if (id === "shopPage") renderShop();
}

/* =========================
   GAME CORE
========================= */

function startGame(mode) {
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
}

function nextNote() {
  const pool = notePositions[currentMode];
  const q = pool[Math.floor(Math.random() * pool.length)];
  currentNote = q.note;

  const noteEl = document.getElementById("noteNote");
  if (!noteEl) return;

  noteEl.style.top = q.top + "px";
  noteEl.innerHTML = WHOLE_NOTE_SVG;

  const clef = document.getElementById("staffClef");
  if (clef) clef.innerHTML = currentMode === "bass" ? BASS_SVG : TREBLE_SVG;
}

/* =========================
   ANSWER
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
   LEVEL
========================= */

function levelUp() {
  while (player.exp >= player.level * player.expToNextLevel) {
    player.level++;
    player.atk += 6;
    player.hp += 25;
    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.12);
  }
}

/* =========================
   UI
========================= */

function updateUI() {
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("combo").innerText = "Combo: " + combo;
  document.getElementById("goldDisplay").innerText = "💰 " + player.gold;
}

function updateExpUI() {
  const cur = player.exp % player.expToNextLevel;

  document.getElementById("expFill").style.width =
    (cur / player.expToNextLevel) * 100 + "%";

  document.getElementById("expText").innerText =
    `EXP ${cur} / ${player.expToNextLevel}`;

  document.getElementById("levelText").innerText =
    "Lv." + player.level;
}

/* =========================
   CHARACTER（保留）
========================= */

function updateCharacter() {
  document.getElementById("stats").innerHTML = `
    ⚔️ ATK: ${player.atk + player.weapon.atkBonus}<br>
    ❤️ HP: ${player.hp}<br>
    🛡 DEF: ${player.def + player.shield.defBonus}
  `;
}

/* =========================
   SHOP（🔥 完整恢復視覺版）
========================= */

const shopItems = [
  { type:"weapon", name:"炎獄魔刃", bonus:180, rarity:"rare", cost:620, icon: ICON_WEAPON_SVG },
  { type:"weapon", name:"雷神之怒・碎空", bonus:280, rarity:"legendary", cost:1350, icon: ICON_WEAPON_SVG },
  { type:"armor", name:"龍鱗聖鎧", bonus:120, rarity:"rare", cost:580, icon: ICON_ARMOR_SVG },
  { type:"shield", name:"泰坦壁壘", bonus:280, rarity:"legendary", cost:950, icon: ICON_SHIELD_SVG },
  { type:"shield", name:"混沌終焉盾", bonus:720, rarity:"mythic", cost:6800, icon: ICON_SHIELD_SVG }
];

/* rarity badge */
function getBadge(rarity){
  return rarity==="legendary"?"🟡✨":rarity==="mythic"?"🔴🔥":"🔵";
}

/* shop render */
function renderShop() {
  const grid = document.getElementById("shopGrid");
  grid.innerHTML = "";

  shopItems.forEach((item, i) => {

    const equipped = player[item.type];
    const isOwned = equipped?.name === item.name;

    const div = document.createElement("div");
    div.className = `shop-item ${item.rarity}`;

    div.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;">
        ${item.icon}
        <div class="shop-name">
          <div>${getBadge(item.rarity)} ${item.name}</div>
          <div style="font-size:12px;opacity:0.7;">
            +${item.bonus} ${item.type}
          </div>
        </div>
      </div>

      <button onclick="buyItem(${i})">
        ${isOwned ? "已裝備" : "💰 " + item.cost}
      </button>
    `;

    grid.appendChild(div);
  });
}

/* buy */
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

/* back */
function backHome() {
  switchPage("homePage");
}
