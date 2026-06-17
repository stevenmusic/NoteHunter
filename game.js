/* ============================================================
   SVG 裝備圖（新增）
   ============================================================ */

const WOOD_SWORD_SVG = `
<svg viewBox="0 0 80 80" width="60" height="60">
  <rect x="36" y="10" width="8" height="38" fill="#8b5a2b"/>
  <rect x="28" y="44" width="24" height="6" fill="#d4af37"/>
  <rect x="34" y="50" width="12" height="18" fill="#654321"/>
</svg>`;

const IRON_SWORD_SVG = `
<svg viewBox="0 0 80 80" width="60" height="60">
  <rect x="37" y="8" width="6" height="42" fill="#b0b0b0"/>
  <polygon points="40,5 45,15 35,15" fill="#e6e6e6"/>
  <rect x="30" y="45" width="20" height="6" fill="#444"/>
  <rect x="35" y="52" width="10" height="16" fill="#222"/>
</svg>`;

const ARMOR_SVG = `
<svg viewBox="0 0 80 80" width="60" height="60">
  <path fill="#5d7ea8"
  d="M25 15 L40 8 L55 15 L60 30 L52 60 L28 60 L20 30 Z"/>
</svg>`;

const SHIELD_SVG = `
<svg viewBox="0 0 80 80" width="60" height="60">
  <path fill="#c0c0c0"
  d="M40 8 L60 16 L60 38 C60 54 50 65 40 72 C30 65 20 54 20 38 L20 16 Z"/>
</svg>`;

/* ============================================================
   Player（原封保留 + 小補強）
   ============================================================ */

let player = {
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  gold: 0,
  hp: 100,
  atk: 10,
  def: 5,
  critChance: 0.12,
  critMultiplier: 1.5,

  weapon: { name: "新手木劍", atkBonus: 2, rarity: "common" },
  armor:  { name: "布質外衣", hpBonus: 10, rarity: "common" },
  shield: { name: "破舊木盾", defBonus: 1, rarity: "common" }
};

/* ============================================================
   總能力
   ============================================================ */

function getPlayerTotalAtk() {
  return player.atk + (player.weapon?.atkBonus || 0);
}
function getPlayerTotalDef() {
  return player.def + (player.shield?.defBonus || 0);
}

/* ============================================================
   狀態
   ============================================================ */

let currentNote = "";
let currentMode = "treble";
let score = 0;
let combo = 0;

/* ============================================================
   存檔
   ============================================================ */

function saveGameData() {
  localStorage.setItem("noteHunter_save", JSON.stringify({ score, player }));
}

function loadGameData() {
  try {
    const s = localStorage.getItem("noteHunter_save");
    if (s) {
      const d = JSON.parse(s);
      score = d.score || 0;
      if (d.player) player = d.player;
    }
  } catch (e) {}

  updateUI();
  updateExpUI();
}

/* ============================================================
   UI
   ============================================================ */

function updateUI() {
  const s = document.getElementById("score");
  const c = document.getElementById("combo");
  const g = document.getElementById("goldDisplay");

  if (s) s.innerText = "Score: " + score;
  if (c) c.innerText = "Combo: " + combo;
  if (g) g.innerText = "💰 " + player.gold;
}

function updateExpUI() {
  const cur = player.exp % player.expToNextLevel;
  const percent = (cur / player.expToNextLevel) * 100;

  const fill = document.getElementById("expFill");
  const text = document.getElementById("expText");
  const lv = document.getElementById("levelText");

  if (fill) fill.style.width = percent + "%";
  if (text) text.innerText = `EXP ${cur} / ${player.expToNextLevel}`;
  if (lv) lv.innerText = "Lv." + player.level;
}

/* ============================================================
   升級
   ============================================================ */

function levelUpCheck() {
  while (player.exp >= player.level * player.expToNextLevel) {
    player.level++;
    player.hp += 25;
    player.atk += 6;
    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.1);
  }
}

/* ============================================================
   頁面
   ============================================================ */

function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "characterPage") updateCharacter();
}

/* ============================================================
   遊戲
   ============================================================ */

function startGame(mode) {
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
}

/* ============================================================
   出題（保留原本）
   ============================================================ */

function nextNote() {
  const modes = {
    treble: ["C","D","E","F","G","A","B"],
    bass: ["C","D","E","F","G","A","B"]
  };

  currentNote = modes[currentMode][Math.floor(Math.random()*7)];
  document.getElementById("noteNote").innerHTML = currentNote;
}

/* ============================================================
   答題
   ============================================================ */

function answer(n) {
  if (n === currentNote) {
    let dmg = getPlayerTotalAtk();
    if (Math.random() < player.critChance) dmg *= 2;

    score += dmg;
    combo++;
    player.exp += 15;
    player.gold += 3;

    levelUpCheck();
  } else {
    combo = 0;
  }

  updateUI();
  updateExpUI();
  saveGameData();
  nextNote();
}

/* ============================================================
   人物頁（🔥重點修復 + SVG裝備）
   ============================================================ */

function updateCharacter() {

  const atk = getPlayerTotalAtk();
  const hp = player.hp + (player.armor?.hpBonus || 0);
  const def = getPlayerTotalDef();

  document.getElementById("stats").innerHTML = `
    <div>
      ⚔️ 攻擊：${atk}<br>
      ❤️ 生命：${hp}<br>
      🛡 防禦：${def}<br>
      💥 爆擊：${Math.floor(player.critChance*100)}%
    </div>
  `;

  document.getElementById("weapon").innerHTML = `
    <div style="display:flex;gap:10px;align-items:center">
      ${WOOD_SWORD_SVG}
      <div>
        <b>${player.weapon.name}</b><br>
        +${player.weapon.atkBonus} ATK
      </div>
    </div>
  `;

  document.getElementById("armor").innerHTML = `
    <div style="display:flex;gap:10px;align-items:center">
      ${ARMOR_SVG}
      <div>
        <b>${player.armor.name}</b><br>
        +${player.armor.hpBonus} HP
      </div>
    </div>
  `;

  document.getElementById("shield").innerHTML = `
    <div style="display:flex;gap:10px;align-items:center">
      ${SHIELD_SVG}
      <div>
        <b>${player.shield.name}</b><br>
        +${player.shield.defBonus} DEF
      </div>
    </div>
  `;
}

/* ============================================================
   初始化
   ============================================================ */

loadGameData();
