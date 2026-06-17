/* game.js — Bravura SMuFL 精確校正版 */

/* ============================================================
   五線譜佈局參考（note-container height: 190px）
   ─────────────────────────────────────────────────────────
   第五線 (最高)  top: 50px
   第四線         top: 70px
   第三線 (中)    top: 90px
   第二線         top: 110px
   第一線 (最低)  top: 130px
   線間距: 20px，每個音度 = 10px

   ▌高音譜號定位邏輯
     Bravura 高音譜號原點 = 第二線 (G4, top 110px)
     字體大小 130px 時，整體高度 ≈ 130px
     透過 `top` 讓原點貼齊 110px：
       → top = 110 - (Bravura 內部原點高度比例 × fontSize)
       Bravura 高音譜號原點距頂 ≈ 60%
       → top = 110 - (0.60 × 130) ≈ 32px → 微調為 28px（讓底部捲曲略低於第一線）

   ▌低音譜號定位邏輯
     Bravura 低音譜號原點 = 第四線 (F3, top 70px)
     字體大小 46px
     Bravura 低音譜號原點距頂 ≈ 15%
     → top = 70 - (0.15 × 46) ≈ 63px → 微調為 60px
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
  weapon: { name: "新手木劍", atkBonus: 2 },
  armor:  { name: "布質外衣", hpBonus: 10 },
  shield: { name: "破舊木盾", defBonus: 1 }
};

function getPlayerTotalAtk() {
  if (!player.weapon || typeof player.weapon.atkBonus === 'undefined') return player.atk;
  return player.atk + player.weapon.atkBonus;
}

function getPlayerTotalDef() {
  if (!player.shield || typeof player.shield.defBonus === 'undefined') return player.def;
  return player.def + player.shield.defBonus;
}

let currentNote = "";
let currentMode = "treble";
let score = 0;
let combo = 0;

/* ============================================================
   音符位置表
   top 值 = 音符中心距容器頂部的像素
   每條線間距 20px，每度音高 10px
   五線: 50 / 70 / 90 / 110 / 130 px (top)
   ============================================================ */
const notePositions = {
  treble: [
    // 下加線區域
    { name: "C4", note: "C", top: 150, ledgerLines: [150] },  // 下加一線 (中央C)
    { name: "D4", note: "D", top: 140, ledgerLines: [] },
    // 五線譜範圍內
    { name: "E4", note: "E", top: 130, ledgerLines: [] },     // 第一線
    { name: "F4", note: "F", top: 120, ledgerLines: [] },
    { name: "G4", note: "G", top: 110, ledgerLines: [] },     // 第二線
    { name: "A4", note: "A", top: 100, ledgerLines: [] },
    { name: "B4", note: "B", top:  90, ledgerLines: [] },     // 第三線
    { name: "C5", note: "C", top:  80, ledgerLines: [] },
    { name: "D5", note: "D", top:  70, ledgerLines: [] },     // 第四線
    { name: "E5", note: "E", top:  60, ledgerLines: [] },
    { name: "F5", note: "F", top:  50, ledgerLines: [] },     // 第五線
    // 上加線區域
    { name: "G5", note: "G", top:  40, ledgerLines: [] },
    { name: "A5", note: "A", top:  30, ledgerLines: [30] },   // 上加一線
    { name: "B5", note: "B", top:  20, ledgerLines: [30] },
    { name: "C6", note: "C", top:  12, ledgerLines: [30, 12] } // 上加二線
  ],
  bass: [
    // 下加線區域
    { name: "C2", note: "C", top: 168, ledgerLines: [148, 168] }, // 下加二線
    { name: "D2", note: "D", top: 158, ledgerLines: [148] },
    { name: "E2", note: "E", top: 148, ledgerLines: [148] },      // 下加一線
    { name: "F2", note: "F", top: 138, ledgerLines: [] },
    // 五線譜範圍內
    { name: "G2", note: "G", top: 130, ledgerLines: [] },         // 第一線
    { name: "A2", note: "A", top: 120, ledgerLines: [] },
    { name: "B2", note: "B", top: 110, ledgerLines: [] },         // 第二線
    { name: "C3", note: "C", top: 100, ledgerLines: [] },
    { name: "D3", note: "D", top:  90, ledgerLines: [] },         // 第三線
    { name: "E3", note: "E", top:  80, ledgerLines: [] },
    { name: "F3", note: "F", top:  70, ledgerLines: [] },         // 第四線
    { name: "G3", note: "G", top:  60, ledgerLines: [] },
    { name: "A3", note: "A", top:  50, ledgerLines: [] },         // 第五線
    // 上加線區域
    { name: "B3", note: "B", top:  40, ledgerLines: [] },
    { name: "C4", note: "C", top:  30, ledgerLines: [30] }        // 上加一線
  ]
};

/* ============================================================
   存檔 / 讀檔
   ============================================================ */
function saveGameData() {
  const saveData = { score: score, player: player };
  localStorage.setItem("noteHunter_save", JSON.stringify(saveData));
}

function loadGameData() {
  const savedString = localStorage.getItem("noteHunter_save");
  if (savedString) {
    try {
      const savedData = JSON.parse(savedString);
      score = savedData.score || 0;
      if (savedData.player) player = savedData.player;
      console.log("🎮 存檔載入成功");
    } catch (e) {
      console.error(e);
    }
  }
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
  const clefEl = document.getElementById("staffClef");
  let pool;

  let activeMode = currentMode;
  if (currentMode === "mix") {
    activeMode = Math.random() < 0.5 ? "treble" : "bass";
  }

  if (activeMode === "treble") {
    pool = notePositions.treble;

    /* ── 高音譜號 ──────────────────────────────────────────
       𝄞  U+1D11E
       Bravura 字型中，高音譜號的參考點(原點)定義在「第二線」(G線)。
       五線第二線 = top 110px。
       fontSize = 130px → 整體高度約 130px。
       Bravura 原點距字型頂部約 60%：0.60 × 130 = 78px。
       top = 110 - 78 = 32px，微調 -4px 使底部捲曲視覺上貼緊第一線下方。
    ─────────────────────────────────────────────────────── */
    clefEl.innerHTML = "&#x1D11E;";     // 使用 HTML entity 確保正確解碼
    clefEl.style.fontSize = "130px";
    clefEl.style.top      = "28px";
    clefEl.style.left     = "10px";

  } else {
    pool = notePositions.bass;

    /* ── 低音譜號 ──────────────────────────────────────────
       𝄢  U+1D122
       Bravura 低音譜號參考點在「第四線」(F線)。
       五線第四線 = top 70px。
       fontSize = 46px。
       Bravura 原點距字型頂部約 12%：0.12 × 46 ≈ 6px。
       top = 70 - 6 = 64px，微調為 62px。
    ─────────────────────────────────────────────────────── */
    clefEl.innerHTML = "&#x1D122;";
    clefEl.style.fontSize = "46px";
    clefEl.style.top      = "62px";
    clefEl.style.left     = "10px";
  }

  const randomQuiz = pool[Math.floor(Math.random() * pool.length)];
  currentNote = randomQuiz.note;

  // 更新音符位置
  const noteEl = document.getElementById("noteNote");
  if (noteEl) {
    noteEl.innerHTML      = "&#x1D157;";   // Bravura whole note (𝅗)
    noteEl.style.top      = randomQuiz.top + "px";
    noteEl.style.animation = "none";
    void noteEl.offsetWidth;               // reflow 觸發 animation 重播
    noteEl.style.animation = "pop 0.15s ease-out";
  }

  // 清除舊加線，新增本次加線
  document.querySelectorAll(".dynamic-ledger").forEach(l => l.remove());
  const containerEl = document.querySelector(".note-container");
  randomQuiz.ledgerLines.forEach(lineTop => {
    const line = document.createElement("div");
    line.className = "dynamic-ledger";
    line.style.top = lineTop + "px";
    containerEl.appendChild(line);
  });
}

/* ============================================================
   作答邏輯
   ============================================================ */
function answer(n) {
  if (n === currentNote) {
    const isCrit   = Math.random() < player.critChance;
    let   damage   = getPlayerTotalAtk();
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
  const scoreEl = document.getElementById("score");
  const comboEl = document.getElementById("combo");
  const goldEl  = document.getElementById("goldDisplay");

  if (scoreEl) scoreEl.innerText = "Score: " + score;
  if (comboEl) comboEl.innerText = "Combo: " + combo;
  if (goldEl)  goldEl.innerText  = "💰 " + player.gold;
}

function updateExpUI() {
  const currentLevelExp = player.exp % player.expToNextLevel;
  const percent = (currentLevelExp / player.expToNextLevel) * 100;

  const fillEl = document.getElementById("expFill");
  const textEl = document.getElementById("expText");
  const lvEl   = document.getElementById("levelText");

  if (fillEl) fillEl.style.width = percent + "%";
  if (textEl) textEl.innerText   = `EXP ${currentLevelExp} / ${player.expToNextLevel}`;
  if (lvEl)   lvEl.innerText     = "Lv." + player.level;
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
   角色頁
   ============================================================ */
function updateCharacter() {
  const totalAtk = getPlayerTotalAtk();
  const totalHp  = player.hp + (player.armor ? player.armor.hpBonus : 0);
  const totalDef = getPlayerTotalDef();

  const statsEl  = document.getElementById("stats");
  const weaponEl = document.getElementById("weapon");
  const armorEl  = document.getElementById("armor");
  const shieldEl = document.getElementById("shield");

  if (statsEl) {
    statsEl.innerHTML = `
      <div style="line-height: 1.6;">
        <strong style="color: #ffcc00;">⚔️ 總攻擊力:</strong> ${totalAtk}<br>
        <strong style="color: #ff4444;">❤️ 總生命值:</strong> ${totalHp}<br>
        <strong style="color: #00e5ff;">🛡️ 總防禦力:</strong> ${totalDef}<br>
        <strong style="color: #00ff88;">💥 爆擊機率:</strong> ${(player.critChance * 100).toFixed(0)}%
      </div>`;
  }
  if (weaponEl && player.weapon) {
    weaponEl.innerHTML = `
      <div style="font-weight:bold;color:#fff;">${player.weapon.name}</div>
      <div style="font-size:13px;color:#aaa;">加成：攻擊力 +${player.weapon.atkBonus}</div>`;
  }
  if (armorEl && player.armor) {
    armorEl.innerHTML = `
      <div style="font-weight:bold;color:#fff;">${player.armor.name}</div>
      <div style="font-size:13px;color:#aaa;">加成：生命值 +${player.armor.hpBonus}</div>`;
  }
  if (shieldEl && player.shield) {
    shieldEl.innerHTML = `
      <div style="font-weight:bold;color:#fff;">${player.shield.name}</div>
      <div style="font-size:13px;color:#aaa;">加成：防禦力 +${player.shield.defBonus}</div>`;
  }
}

function backHome() {
  switchPage("homePage");
}

/* ============================================================
   啟動
   ============================================================ */
loadGameData();
