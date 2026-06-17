"use strict";

/* =========================
   SVG ASSETS
========================= */
const TREBLE_SVG = `...`; // 保持你原本（略，未改）
const BASS_SVG = `...`;
const WHOLE_NOTE_SVG = `...`;

const ICON_WEAPON_SVG = `...`;
const ICON_ARMOR_SVG = `...`;
const ICON_SHIELD_SVG = `...`;

/* =========================
   GAME STATE (核心統一管理)
========================= */
const gameState = {
  mode: "treble",
  currentNote: null,
  currentAnswer: null,

  score: 0,
  combo: 0,

  isPlaying: false
};

/* =========================
   PLAYER DATA
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
  armor:  { name: "殘破布質外衣", hpBonus: 10, rarity: "common" },
  shield: { name: "阿瓦隆・永恆結界盾", defBonus: 320, rarity: "mythic" }
};

/* =========================
   NOTE DATA
========================= */
const notePositions = {
  treble: [
    { name:"C4", note:"C", top:150 },
    { name:"D4", note:"D", top:140 },
    { name:"E4", note:"E", top:130 },
    { name:"F4", note:"F", top:120 },
    { name:"G4", note:"G", top:110 },
    { name:"A4", note:"A", top:100 },
    { name:"B4", note:"B", top:90 },
    { name:"C5", note:"C", top:80 },
    { name:"D5", note:"D", top:70 },
    { name:"E5", note:"E", top:60 },
    { name:"F5", note:"F", top:50 },
    { name:"G5", note:"G", top:40 },
    { name:"A5", note:"A", top:30 },
    { name:"B5", note:"B", top:20 },
    { name:"C6", note:"C", top:12 }
  ],
  bass: [
    { name:"C2", note:"C", top:168 },
    { name:"D2", note:"D", top:158 },
    { name:"E2", note:"E", top:148 },
    { name:"F2", note:"F", top:138 },
    { name:"G2", note:"G", top:130 },
    { name:"A2", note:"A", top:120 },
    { name:"B2", note:"B", top:110 },
    { name:"C3", note:"C", top:100 },
    { name:"D3", note:"D", top:90 },
    { name:"E3", note:"E", top:80 },
    { name:"F3", note:"F", top:70 },
    { name:"G3", note:"G", top:60 },
    { name:"A3", note:"A", top:50 },
    { name:"B3", note:"B", top:40 },
    { name:"C4", note:"C", top:30 }
  ]
};

/* =========================
   INIT
========================= */
loadGameData();
updateUI();
updateExpUI();

/* =========================
   PAGE SYSTEM
========================= */
function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if (pageId === "characterPage") updateCharacter();
  if (pageId === "shopPage") renderShop();
}

function backHome() {
  switchPage("homePage");
}

/* =========================
   GAME FLOW
========================= */
function startGame(mode) {
  gameState.mode = mode;
  gameState.isPlaying = true;

  switchPage("gamePage");
  nextNote();
}

function nextNote() {
  const mode = gameState.mode;

  const activeMode =
    mode === "mix"
      ? (Math.random() < 0.5 ? "treble" : "bass")
      : mode;

  const pool = notePositions[activeMode];
  const q = pool[Math.floor(Math.random() * pool.length)];

  gameState.currentNote = q.note;
  gameState.currentAnswer = q;

  /* clef */
  document.getElementById("staffClef").innerHTML =
    activeMode === "treble" ? TREBLE_SVG : BASS_SVG;

  /* note */
  const el = document.getElementById("noteNote");
  el.style.top = q.top + "px";
  el.innerHTML = WHOLE_NOTE_SVG;

  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "pop 0.15s ease-out";

  /* cleanup ledger */
  const container = document.querySelector(".note-container");
  container.querySelectorAll(".dynamic-ledger").forEach(e => e.remove());

  if (q.ledgerLines) {
    q.ledgerLines.forEach(t => {
      const line = document.createElement("div");
      line.className = "dynamic-ledger";
      line.style.top = t + "px";
      container.appendChild(line);
    });
  }
}

/* =========================
   ANSWER SYSTEM (核心升級)
========================= */
function answer(n) {
  if (!gameState.isPlaying) return;

  const correct = gameState.currentNote === n;

  if (correct) {
    onCorrect();
  } else {
    onMiss();
  }

  nextNote();
}

/* =========================
   CORRECT / MISS LOGIC
========================= */
function onCorrect() {
  const isCrit = Math.random() < player.critChance;

  let dmg = player.atk + (player.weapon?.atkBonus || 0);
  if (isCrit) dmg = Math.floor(dmg * player.critMultiplier);

  gameState.score += dmg;
  gameState.combo++;

  player.exp += 15;
  player.gold += Math.floor(Math.random() * 8) + 3;

  levelUp();

  triggerFeedback("correct");
}

function onMiss() {
  gameState.combo = 0;
  triggerFeedback("miss");
}

/* =========================
   FEEDBACK SYSTEM (未來可接動畫)
========================= */
function triggerFeedback(type) {
  const gamePage = document.getElementById("gamePage");

  gamePage.classList.remove("flash-correct", "flash-miss");

  void gamePage.offsetWidth;

  if (type === "correct") {
    gamePage.classList.add("flash-correct");
  } else {
    gamePage.classList.add("flash-miss");
  }
}

/* =========================
   LEVEL SYSTEM (修正版)
========================= */
function levelUp() {
  while (player.exp >= player.expToNextLevel) {
    player.exp -= player.expToNextLevel;
    player.level++;

    player.hp += 25;
    player.atk += 6;

    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.12);
  }
}

/* =========================
   UI
========================= */
function updateUI() {
  document.getElementById("score").innerText = "Score: " + gameState.score;
  document.getElementById("combo").innerText = "Combo: " + gameState.combo;
  document.getElementById("goldDisplay").innerText = "💰 " + player.gold;
}

function updateExpUI() {
  const cur = player.exp;
  const percent = (cur / player.expToNextLevel) * 100;

  document.getElementById("expFill").style.width = percent + "%";
  document.getElementById("expText").innerText =
    `EXP ${cur} / ${player.expToNextLevel}`;

  document.getElementById("levelText").innerText =
    "Lv." + player.level;
}

/* =========================
   SAVE / LOAD
========================= */
function saveGameData() {
  localStorage.setItem(
    "noteHunter_save",
    JSON.stringify({ player, score: gameState.score })
  );
}

function loadGameData() {
  const data = localStorage.getItem("noteHunter_save");

  if (!data) return;

  try {
    const d = JSON.parse(data);
    if (d.player) player = d.player;
    if (d.score) gameState.score = d.score;
  } catch (e) {}
}

/* =========================
   CHARACTER
========================= */
function updateCharacter() {
  const atk = player.atk + (player.weapon?.atkBonus || 0);
  const hp = player.hp + (player.armor?.hpBonus || 0);
  const def = player.def + (player.shield?.defBonus || 0);

  document.getElementById("stats").innerHTML = `
    <div style="line-height:1.6;">
      ⚔️ ATK ${atk}<br>
      ❤️ HP ${hp}<br>
      🛡 DEF ${def}<br>
      💥 CRIT ${(player.critChance * 100).toFixed(0)}%
    </div>
  `;
}

/* =========================
   SHOP
========================= */
function renderShop() {
  document.getElementById("shopGrid").innerHTML = "";
}

/* =========================
   GLOBAL EXPORT (重要)
========================= */
window.switchPage = switchPage;
window.startGame = startGame;
window.answer = answer;
window.backHome = backHome;
