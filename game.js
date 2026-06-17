/* game.js */

let currentNote = "";
let currentMode = "treble"; 
let score = 0;
let combo = 0;

// 定義高低音的音名範圍，直接用文字出題，安全度 100%
const noteData = {
  treble: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6"],
  bass: ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"]
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

function nextNote() {
  let pool = [];
  const clefEl = document.getElementById("staffClef");

  // 根據模式選擇題庫，並改變顯示的譜號圖示
  if (currentMode === "treble") {
    pool = noteData.treble;
    clefEl.innerText = "𝄞"; // 高音譜記號
  } else if (currentMode === "bass") {
    pool = noteData.bass;
    clefEl.innerText = "𝄢"; // 低音譜記號
  } else {
    pool = [...noteData.treble, ...noteData.bass];
    clefEl.innerText = "🎼"; // 混合譜記號
  }

  // 隨機抽一題 (例如 "C4")
  const randomQuiz = pool[Math.floor(Math.random() * pool.length)];
  
  // 標準答案是字串的第一個字 (例如 "C4" 的答案是 "C")
  currentNote = randomQuiz.charAt(0); 

  // 更新畫面的題目文字 (C4, D2...)
  const displayEl = document.getElementById("noteDisplay");
  displayEl.innerText = randomQuiz;

  // 觸發 TT2 彈出動畫
  displayEl.style.animation = "none";
  void displayEl.offsetWidth; 
  displayEl.style.animation = "pop 0.2s ease-out";
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
