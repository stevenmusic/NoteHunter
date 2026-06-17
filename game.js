/* game.js — SVG 純向量版 + 五大裝備稀有度特化系統 (結構修正版) */

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
const TREBLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg"
  width="36" height="150"
  viewBox="0 0 36 150"
  style="position:absolute;left:6px;top:16px;overflow:visible;">
  <path fill="#1a1a1a" stroke="none" d="
    M 18,4
    C 20,4 24,8 24,14
    C 24,22 20,30 16,38
    C 22,34 28,36 30,42
    C 33,50 30,60 24,64
    C 20,67 15,68 12,66
    C 8,64 6,60 6,55
    C 6,48 10,43 16,42
    C 20,41 24,43 26,47
    C 28,51 27,57 24,60
    C 21,63 17,63 15,61
    C 13,59 13,56 15,54
    C 17,52 20,53 20,55
    C 20,57 18,58 17,57
    C 16,56 17,54 18,55
    L 18,55
    C 16,53 14,54 14,57
    C 14,60 16,63 19,64
    C 23,65 27,62 28,58
    C 29,54 27,49 24,47
    C 21,45 16,45 13,47
    C 9,50 8,55 9,61
    C 10,67 14,71 19,72
    C 25,73 30,69 32,64
    C 35,57 33,48 29,42
    C 26,37 21,34 16,35
    C 20,26 23,16 22,8
    C 21,5 19,3 18,4
    Z
    M 18,74
    C 18,74 18,110 18,125
    C 16,130 12,133 10,138
    C 8,142 9,146 12,147
    C 16,148 20,145 22,141
    C 24,137 23,132 20,129
    C 19,127 18,126 18,125
  "/>
</svg>`;

// 低音譜號 SVG
const BASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg"
  width="48" height="60"
  viewBox="0 0 48 60"
  style="position:absolute;left:8px;top:58px;overflow:visible;">
  <path fill="#1a1a1a" stroke="none" d="
    M 6,12
    C 6,12 8,2 16,2
    C 24,2 30,10 30,22
    C 30,36 22,46 10,50
    C 8,51 6,51 6,50
    C 6,49 8,49 10,48
    C 20,44 26,35 26,22
    C 26,12 21,6 16,6
    C 11,6 9,10 9,14
    C 9,18 11,20 14,20
    C 17,20 19,18 19,15
    C 19,13 17,11 15,12
    C 14,12 13,13 14,14
    C 15,15 16,14 16,13
    C 15,12 14,13 14,14
    Z
  "/>
  <circle fill="#1a1a1a" cx="38" cy="9"  r="4"/>
  <circle fill="#1a1a1a" cx="38" cy="21" r="4"/>
</svg>`;

// 全音符 SVG（空心橢圓）
const WHOLE_NOTE_SVG = `<svg xmlns="http://www.w3.org/2000/svg"
  width="30" height="22"
  viewBox="-15 -11 30 22"
  style="overflow:visible;">
  <ellipse cx="0" cy="0" rx="12" ry="7.5"
    fill="none" stroke="#1a1a1a" stroke-width="3.5"/>
</svg>`;

/* ============================================================
   Player 冒險者資料庫 (在這裡自由調整測試三種裝備的稀有度！)
   ============================================================ */
let player = {
  level: 1, exp: 0, expToNextLevel: 100,
  gold: 0, hp: 100, atk: 10, def: 5,
  critChance: 0.12, critMultiplier: 1.5,
  
  // 可設定稀有度: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic'
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

  // 更新譜號 SVG
  const clefEl = document.getElementById("staffClef");
  if (clefEl) clefEl.innerHTML = activeMode === "treble" ? TREBLE_SVG : BASS_SVG;

  // 抽題
  const pool = notePositions[activeMode];
  const q    = pool[Math.floor(Math.random() * pool.length)];
  currentNote = q.note;

  // 更新音符
  const noteEl = document.getElementById("noteNote");
  if (noteEl) {
    noteEl.style.top = q.top + "px";
    noteEl.innerHTML = WHOLE_NOTE_SVG;
    noteEl.style.animation = "none";
    void noteEl.offsetWidth;
    noteEl.style.animation = "pop 0.15s ease-out";
  }

  // 清除舊加線，新增本次加線
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
   角色頁裝備與稀有度渲染 (已修正 Class 覆蓋臭蟲)
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

  // 2. 渲染武器欄位 (精確重組 item-card 和稀有度樣式類別)
  if (wp && player.weapon) {
    const rClass = player.weapon.rarity || "common";
    wp.className = `item-card ${rClass}`; // 確保 item-card 被保留
    wp.innerHTML = `
      <div style="font-weight:bold;color:#fff;">${player.weapon.name}</div>
      <div style="font-size:13px;color:#aaa;">加成：攻擊力 +${player.weapon.atkBonus}</div>`;
  }

  // 3. 渲染戰甲欄位
  if (ar && player.armor) {
    const rClass = player.armor.rarity || "common";
    ar.className = `item-card ${rClass}`; // 確保 item-card 被保留
    ar.innerHTML = `
      <div style="font-weight:bold;color:#fff;">${player.armor.name}</div>
      <div style="font-size:13px;color:#aaa;">加成：生命值 +${player.armor.hpBonus}</div>`;
  }

  // 4. 渲染神盾欄位
  if (sh && player.shield) {
    const rClass = player.shield.rarity || "common";
    sh.className = `item-card ${rClass}`; // 確保 item-card 被保留
    sh.innerHTML = `
      <div style="font-weight:bold;color:#fff;">${player.shield.name}</div>
      <div style="font-size:13px;color:#aaa;">加成：防禦力 +${player.shield.defBonus}</div>`;
  }
}

function backHome() { switchPage("homePage"); }

loadGameData();
