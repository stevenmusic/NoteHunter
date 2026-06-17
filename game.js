/* game.js — SVG 純向量版 + 五大裝備稀有度特化系統 (含裝備 SVG 圖標) */

/*
  ┌─────────────────────────────────────────────────────┐
  │  五線譜佈局 (note-container height: 190px)           │
  │  第五線  top: 50px                                   │
  │  第四線  top: 70px                                   │
  │  第三線  top: 90px                                   │
  │  第二線  top: 110px  ← 高音譜號 G 線                 │
  │  第一線  top: 130px                                   │
  │  線間距: 20px，每音度: 10px                           │
  └─────────────────────────────────────────────────────┘
*/

/* ============================================================
   SVG 譜號字串
   ============================================================ */

// 高音譜號 SVG
const TREBLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="150" viewBox="0 0 36 150" style="position:absolute;left:6px;top:16px;overflow:visible;"><path fill="#1a1a1a" d="M 18,4 C 20,4 24,8 24,14 C 24,22 20,30 16,38 C 22,34 28,36 30,42 C 33,50 30,60 24,64 C 20,67 15,68 12,66 C 8,64 6,60 6,55 C 6,48 10,43 16,42 C 20,41 24,43 26,47 C 28,51 27,57 24,60 C 21,63 17,63 15,61 C 13,59 13,56 15,54 C 17,52 20,53 20,55 C 20,57 18,58 17,57 C 16,56 17,54 18,55 L 18,55 C 16,53 14,54 14,57 C 14,60 16,63 19,64 C 23,65 27,62 28,58 C 29,54 27,49 24,47 C 21,45 16,45 13,47 C 9,50 8,55 9,61 C 10,67 14,71 19,72 C 25,73 30,69 32,64 C 35,57 33,48 29,42 C 26,37 21,34 16,35 C 20,26 23,16 22,8 C 21,5 19,3 18,4 Z M 18,74 C 18,74 18,110 18,125 C 16,130 12,133 10,138 C 8,142 9,146 12,147 C 16,148 20,145 22,141 C 24,137 23,132 20,129 C 19,127 18,126 18,125 "/></svg>`;

// 低音譜號 SVG
const BASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60" style="position:absolute;left:8px;top:58px;overflow:visible;"><path fill="#1a1a1a" d="M 6,12 C 6,12 8,2 16,2 C 24,2 30,10 30,22 C 30,36 22,46 10,50 C 8,51 6,51 6,50 C 6,49 8,49 10,48 C 20,44 26,35 26,22 C 26,12 21,6 16,6 C 11,6 9,10 9,14 C 9,18 11,20 14,20 C 17,20 19,18 19,15 C 19,13 17,11 15,12 C 14,12 13,13 14,14 C 15,15 16,14 16,13 C 15,12 14,13 14,14 Z "/><circle fill="#1a1a1a" cx="38" cy="9"  r="4"/><circle fill="#1a1a1a" cx="38" cy="21" r="4"/></svg>`;

// 全音符 SVG（空心橢圓）
const WHOLE_NOTE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="22" viewBox="-15 -11 30 22" style="overflow:visible;"><ellipse cx="0" cy="0" rx="12" ry="7.5" fill="none" stroke="#1a1a1a" stroke-width="3.5"/></svg>`;


/* ============================================================
   🌟 新增：純向量裝備圖標 SVG 資料庫 (自帶同風格高質感金屬色)
   ============================================================ */

// 武器：雷霆長劍圖標
const ICON_WEAPON_SVG = `<svg width="40" height="40" viewBox="0 0 64 64" style="flex-shrink:0; overflow:visible;"><path fill="#e6c229" stroke="#fff" stroke-width="1.5" d="M 52,12 L 44,4 L 20,28 L 24,32 Z"/><path fill="#1a1a1a" stroke="#fff" stroke-width="1.5" d="M 20,28 L 16,24 L 12,28 L 16,32 L 12,36 L 16,40 L 20,36 L 24,40 L 28,36 Z"/><path fill="#8a8a9e" stroke="#fff" stroke-width="1.5" d="M 14,38 L 4,48 L 2,62 L 16,50 L 6,40 Z"/><circle fill="#00e5ff" cx="50" cy="6" r="3"/></svg>`;

// 戰甲：重型護身胸甲圖標
const ICON_ARMOR_SVG = `<svg width="40" height="40" viewBox="0 0 64 64" style="flex-shrink:0; overflow:visible;"><path fill="#4a526d" stroke="#fff" stroke-width="2" d="M 12,8 C 24,4 40,4 52,8 L 56,24 C 56,44 44,56 32,60 C 20,56 8,44 8,24 Z"/><path fill="#2d3345" d="M 16,14 C 26,11 38,11 48,14 L 50,24 C 50,38 40,48 32,52 C 24,48 14,38 14,24 Z"/><path fill="#ffcc00" d="M 32,20 L 36,28 L 45,28 L 38,34 L 41,42 L 32,37 L 23,42 L 26,34 L 19,28 L 28,28 Z"/></svg>`;

// 神盾：符文圓盾圖標
const ICON_SHIELD_SVG = `<svg width="40" height="40" viewBox="0 0 64 64" style="flex-shrink:0; overflow:visible;"><circle fill="#3a2d45" stroke="#fff" stroke-width="2" cx="32" cy="32" r="28"/><circle fill="none" stroke="#ff0055" stroke-width="1.5" stroke-dasharray="4,2" cx="32" cy="32" r="20"/><path fill="#ff0055" d="M 32,8 L 35,20 L 47,20 L 38,26 L 41,38 L 32,32 L 23,38 L 26,26 L 17,20 L 29,20 Z"/><circle fill="#00e5ff" cx="32" cy="32" r="5"/></svg>`;


/* ============================================================
   Player 冒險者資料庫 (可隨意更換稀有度測試效果)
   ============================================================ */
let player = {
  level: 1, exp: 0, expToNextLevel: 100,
  gold: 0, hp: 100, atk: 10, def: 5,
  critChance: 0.12, critMultiplier: 1.5,
  
  // 稀有度設定支援: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic'
  weapon: { name: "雷神之怒・碎空", atkBonus: 120, rarity: "legendary" },
  armor:  { name: "殘破布質外衣",  hpBonus: 10,  rarity: "common" },
  shield: { name: "阿瓦隆・永恆結界盾", defBonus: 320, rarity: "mythic" }
};

function getPlayerTotalAtk() {
  return player.atk + (player.weapon?.atkBonus ?? 0);
}
function getPlayerTotalDef() {
  return player.def + (player.shield?.defBonus ?? 0);
}

let currentNote = "";
let currentMode = "treble";
let score = 0;
let combo = 0;

/* ============================================================
   音符位置表
   ============================================================ */
const notePositions = {
  treble: [
    { name:"C4", note:"C", top:150, ledgerLines:[150] },
    { name:"D4", note:"D", top:140, ledgerLines:[] },
    { name:"E4", note:"E", top:130, ledgerLines:[] },
    { name:"F4", note:"F", top:120, ledgerLines:[] },
    { name:"G4", note:"G", top:110, ledgerLines:[] },
    { name:"A4", note:"A", top:100, ledgerLines:[] },
    { name:"B4", note:"B", top: 90, ledgerLines:[] },
    { name:"C5", note:"C", top: 80, ledgerLines:[] },
    { name:"D5", note:"D", top: 70, ledgerLines:[] },
    { name:"E5", note:"E", top: 60, ledgerLines:[] },
    { name:"F5", note:"F", top: 50, ledgerLines:[] },
    { name:"G5", note:"G", top: 40, ledgerLines:[] },
    { name:"A5", note:"A", top: 30, ledgerLines:[30] },
    { name:"B5", note:"B", top: 20, ledgerLines:[30] },
    { name:"C6", note:"C", top: 12, ledgerLines:[30,12] }
  ],
  bass: [
    { name:"C2", note:"C", top:168, ledgerLines:[148,168] },
    { name:"D2", note:"D", top:158, ledgerLines:[148] },
    { name:"E2", note:"E", top:148, ledgerLines:[148] },
    { name:"F2", note:"F", top:138, ledgerLines:[] },
    { name:"G2", note:"G", top:130, ledgerLines:[] },
    { name:"A2", note:"A", top:120, ledgerLines:[] },
    { name:"B2", note:"B", top:110, ledgerLines:[] },
    { name:"C3", note:"C", top:100, ledgerLines:[] },
    { name:"D3", note:"D", top: 90, ledgerLines:[] },
    { name:"E3", note:"E", top: 80, ledgerLines:[] },
    { name:"F3", note:"F", top: 70, ledgerLines:[] },
    { name:"G3", note:"G", top: 60, ledgerLines:[] },
    { name:"A3", note:"A", top: 50, ledgerLines:[] },
    { name:"B3", note:"B", top: 40, ledgerLines:[] },
    { name:"C4", note:"C", top: 30, ledgerLines:[30] }
  ]
};

/* ============================================================
   存檔 / 讀檔
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
  } catch(e) { console.error(e); }
  updateUI();
  updateExpUI();
}

/* ============================================================
   頁面切換
   ============================================================ */
function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  if (pageId === "characterPage") updateCharacter();
}

/* ============================================================
   遊戲主流程
   ============================================================ */
function startGame(mode) {
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
}

function nextNote() {
  let activeMode = currentMode === "mix"
    ? (Math.random() < 0.5 ? "treble" : "bass")
    : currentMode;

  const clefEl = document.getElementById("staffClef");
  if (clefEl) clefEl.innerHTML = activeMode === "treble" ? TREBLE_SVG : BASS_SVG;

  const pool = notePositions[activeMode];
  const q    = pool[Math.floor(Math.random() * pool.length)];
  currentNote = q.note;

  const noteEl = document.getElementById("noteNote");
  if (noteEl) {
    noteEl.style.top = q.top + "px";
    noteEl.innerHTML = WHOLE_NOTE_SVG;
    noteEl.style.animation = "none";
    void noteEl.offsetWidth;
    noteEl.style.animation = "pop 0.15s ease-out";
  }

  document.querySelectorAll(".dynamic-ledger").forEach(l => l.remove());
  const container = document.querySelector(".note-container");
  if (container) {
    q.ledgerLines.forEach(lineTop => {
      const line = document.createElement("div");
      line.className = "dynamic-ledger";
      line.style.top = lineTop + "px";
      container.appendChild(line);
    });
  }
}

/* ============================================================
   作答
   ============================================================ */
function answer(n) {
  if (n === currentNote) {
    const isCrit = Math.random() < player.critChance;
    let damage = getPlayerTotalAtk();
    if (isCrit) damage = Math.floor(damage * player.critMultiplier);
    score      += damage;
    combo++;
    player.exp  += 15;
    player.gold += Math.floor(Math.random() * 5) + 2;
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
   UI 更新
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
  const cur     = player.exp % player.expToNextLevel;
  const percent = (cur / player.expToNextLevel) * 100;
  const fill = document.getElementById("expFill");
  const text = document.getElementById("expText");
  const lv   = document.getElementById("levelText");
  if (fill) fill.style.width = percent + "%";
  if (text) text.innerText   = `EXP ${cur} / ${player.expToNextLevel}`;
  if (lv)   lv.innerText     = "Lv." + player.level;
}

function levelUpCheck() {
  while (player.exp >= player.level * player.expToNextLevel) {
    player.level++;
    player.hp  += 25;
    player.atk += 6;
    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.1);
  }
}

/* ============================================================
   角色頁裝備與稀有度渲染 (包含 Flex 置中排版與動態 SVG 圖標)
   ============================================================ */
function updateCharacter() {
  const totalAtk = getPlayerTotalAtk();
  const totalHp  = player.hp + (player.armor?.hpBonus ?? 0);
  const totalDef = getPlayerTotalDef();

  const st = document.getElementById("stats");
  const wp = document.getElementById("weapon");
  const ar = document.getElementById("armor");
  const sh = document.getElementById("shield");

  // 1. 渲染角色基礎屬性
  if (st) st.innerHTML = `
    <div style="line-height:1.6;">
      <strong style="color:#ffcc00;">⚔️ 總攻擊力:</strong> ${totalAtk}<br>
      <strong style="color:#ff4444;">❤️ 總生命值:</strong> ${totalHp}<br>
      <strong style="color:#00e5ff;">🛡️ 總防禦力:</strong> ${totalDef}<br>
      <strong style="color:#00ff88;">💥 爆擊機率:</strong> ${(player.critChance*100).toFixed(0)}%
    </div>`;

  // 2. 渲染武器欄位 (注入 SVG 圖標並利用 flex 橫向排列)
  if (wp && player.weapon) {
    const rClass = player.weapon.rarity || "common";
    wp.className = `item-card ${rClass}`;
    wp.style.display = "flex";
    wp.style.alignItems = "center";
    wp.style.gap = "14px";
    wp.innerHTML = `
      ${ICON_WEAPON_SVG}
      <div>
        <div style="font-weight:bold;color:#fff;letter-spacing:0.5px;">${player.weapon.name}</div>
        <div style="font-size:13px;color:#aaa;margin-top:2px;">加成：攻擊力 +${player.weapon.atkBonus}</div>
      </div>`;
  }

  // 3. 渲染戰甲欄位
  if (ar && player.armor) {
    const rClass = player.armor.rarity || "common";
    ar.className = `item-card ${rClass}`;
    ar.style.display = "flex";
    ar.style.alignItems = "center";
    ar.style.gap = "14px";
    ar.innerHTML = `
      ${ICON_ARMOR_SVG}
      <div>
        <div style="font-weight:bold;color:#fff;letter-spacing:0.5px;">${player.armor.name}</div>
        <div style="font-size:13px;color:#aaa;margin-top:2px;">加成：生命值 +${player.armor.hpBonus}</div>
      </div>`;
  }

  // 4. 渲染神盾欄位
  if (sh && player.shield) {
    const rClass = player.shield.rarity || "common";
    sh.className = `item-card ${rClass}`;
    sh.style.display = "flex";
    sh.style.alignItems = "center";
    sh.style.gap = "14px";
    sh.innerHTML = `
      ${ICON_SHIELD_SVG}
      <div>
        <div style="font-weight:bold;color:#fff;letter-spacing:0.5px;">${player.shield.name}</div>
        <div style="font-size:13px;color:#aaa;margin-top:2px;">加成：防禦力 +${player.shield.defBonus}</div>
      </div>`;
  }
}

function backHome() { switchPage("homePage"); }

loadGameData();
