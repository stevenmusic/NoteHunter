/* game.js */

let currentNote = "";
let currentMode = "treble"; 
let score = 0;
let combo = 0;

// 五線譜基準點：第三線（高音譜 B4 / 低音譜 D3）定在 70px。
// 每一度音程距離為 10px。
// ledgerLines 代表該音符在哪些絕對高度（top）需要畫一條 40px 寬的短加線。
const notePositions = {
  treble: [
    { name: "C4", note: "C", top: 130, ledgerLines: [110] }, // 下加一線 (距離第一線 110px 處需要加線)
    { name: "D4", note: "D", top: 120, ledgerLines: [] }, 
    { name: "E4", note: "E", top: 110, ledgerLines: [] }, // 第一線
    { name: "F4", note: "F", top: 100, ledgerLines: [] }, 
    { name: "G4", note: "G", top: 90,  ledgerLines: [] }, // 第二線
    { name: "A4", note: "A", top: 80,  ledgerLines: [] }, 
    { name: "B4", note: "B", top: 70,  ledgerLines: [] }, // 第三線
    { name: "C5", note: "C", top: 60,  ledgerLines: [] }, 
    { name: "D5", note: "D", top: 50,  ledgerLines: [] }, // 第四線
    { name: "E5", note: "E", top: 40,  ledgerLines: [] }, 
    { name: "F5", note: "F", top: 30,  ledgerLines: [] }, // 第五線
    { name: "G5", note: "G", top: 20,  ledgerLines: [] }, 
    { name: "A5", note: "A", top: 10,  ledgerLines: [10] },  // 上加一線
    { name: "B5", note: "B", top: 0,   ledgerLines: [10] },  // 在上加一線的空间，但本身不穿線
    { name: "C6", note: "C", top: -10, ledgerLines: [10, -10] } // 上加二線 (穿過 10px 與 -10px 兩條線)
  ],
  bass: [
    { name: "C2", note: "C", top: 150, ledgerLines: [130, 150] }, // 下加二線
    { name: "D2", note: "D", top: 140, ledgerLines: [130] }, 
    { name: "E2", note: "E", top: 130, ledgerLines: [130] }, // 下加一線
    { name: "F2", note: "F", top: 120, ledgerLines: [] }, 
    { name: "G2", note: "G", top: 110, ledgerLines: [] }, // 第一線
    { name: "A2", note: "A", top: 100, ledgerLines: [] }, 
    { name: "B2", note: "B", top: 90,  ledgerLines: [] }, // 第二線
    { name: "C3", note: "C", top: 80,  ledgerLines: [] }, 
    { name: "D3", note: "D", top: 70,  ledgerLines: [] }, // 第三線
    { name: "E3", note: "E", top: 60,  ledgerLines: [] }, 
    { name: "F3", note: "F", top: 50,  ledgerLines: [] }, // 第四線
    { name: "G3", note: "G", top: 40,  ledgerLines: [] }, 
    { name: "A3", note: "A", top: 30,  ledgerLines: [] }, // 第五線
    { name: "B3", note: "B", top: 20,  ledgerLines: [] }, 
    { name: "C4", note: "C", top: 10,  ledgerLines: [10] }   // 上加一線 (中央C)
  ]
};

function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  if (pageId === "characterPage") updateCharacter();
}

function startGame(mode) {
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
}

/* --- 動態渲染音符與專屬加線 --- */
function nextNote() {
  let pool = [];
  const clefEl = document.getElementById("staffClef");

  // 1. 決定題庫與譜號
  if (currentMode === "treble") {
    pool = notePositions.treble;
    clefEl.innerText = "𝄞"; 
  } else if (currentMode === "bass") {
    pool = notePositions.bass;
    clefEl.innerText = "𝄢"; 
  } else {
    if (Math.random() < 0.5) {
      pool = notePositions.treble;
      clefEl.innerText = "𝄞";
    } else {
      pool = notePositions.bass;
      clefEl.innerText = "𝄢";
    }
  }

  // 2. 隨機出題
  const randomQuiz = pool[Math.floor(Math.random() * pool.length)];
  currentNote = randomQuiz.note; 

  // 3. 設定音符圓圈的高度位置
  const noteEl = document.getElementById("noteNote");
  noteEl.style.top = randomQuiz.top + "px";

  // 4. 清除舊的動態加線，並根據目前音符重新繪製所需的加線
  // 先把上一次殘留的加線丟掉
  document.querySelectorAll(".dynamic-ledger").forEach(line => line.remove());

  // 取得容器，動態塞入當前音符專屬的短加線
  const containerEl = document.querySelector(".note-container");
  randomQuiz.ledgerLines.forEach(lineTop => {
    const line = document.createElement("div");
    line.className = "dynamic-ledger";
    line.style.top = lineTop + "px"; // 釘在樂譜對應的絕對高度上
    containerEl.appendChild(line);
  });

  // 5. 觸發彈出動畫
  noteEl.style.animation = "none";
  void noteEl.offsetWidth; 
  noteEl.style.animation = "pop 0.15s ease-out";
}

function answer(n) {
  if (n === currentNote) {
    const isCrit = Math.random() < player.critChance;
    let damage = getPlayerTotalAtk();
    if (isCrit) damage = damage * player.critMultiplier;
    
    score += Math.floor(damage);
    combo++;
    player.exp += 15;
    player.gold += Math.floor(Math.random() * 5) + 2;
    levelUpCheck();
  } else {
    combo = 0;
  }
  updateUI();
  updateExpUI();
  nextNote();
}

function updateUI() {
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("combo").innerText = "Combo: " + combo;
  document.getElementById("goldDisplay").innerText = "💰 " + player.gold;
}

function updateExpUI() {
  const currentLevelExp = player.exp % player.expToNextLevel;
  const percent = (currentLevelExp / player.expToNextLevel) * 100;
  document.getElementById("expFill").style.width = percent + "%";
  document.getElementById("expText").innerText = `EXP ${currentLevelExp} / ${player.expToNextLevel}`;
  document.getElementById("levelText").innerText = "Lv." + player.level;
}

function levelUpCheck() {
  if (player.exp >= player.level * player.expToNextLevel) {
    player.level++;
    player.hp += 25;
    player.atk += 6;
    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.1);
  }
}

function updateCharacter() {
  const totalAtk = getPlayerTotalAtk();
  const totalHp = player.hp + player.armor.hpBonus;
  const totalDef = getPlayerTotalDef();

  document.getElementById("stats").innerHTML = `
    <div style="line-height: 1.6;">
      <strong style="color: #ffcc00;">⚔️ 總攻擊力:</strong> ${totalAtk} <br>
      <strong style="color: #ff4444;">❤️ 總生命值:</strong> ${totalHp} <br>
      <strong style="color: #00e5ff;">🛡️ 總防禦力:</strong> ${totalDef} <br>
      <strong style="color: #00ff88;">💥 爆擊機率:</strong> ${(player.critChance * 100).toFixed(0)}%
    </div>
  `;

  document.getElementById("weapon").innerHTML = `
    <div style="font-weight: bold; color: #fff;">${player.weapon.name}</div>
    <div style="font-size: 13px; color: #aaa;">加成：攻擊力 +${player.weapon.atkBonus}</div>
  `;
  document.getElementById("armor").innerHTML = `
    <div style="font-weight: bold; color: #fff;">${player.armor.name}</div>
    <div style="font-size: 13px; color: #aaa;">加成：生命值 +${player.armor.hpBonus}</div>
  `;
  document.getElementById("shield").innerHTML = `
    <div style="font-weight: bold; color: #fff;">${player.shield.name}</div>
    <div style="font-size: 13px; color: #aaa;">加成：防禦力 +${player.shield.defBonus}</div>
  `;
}

function backHome() {
  switchPage("homePage");
}
