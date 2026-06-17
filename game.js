/* game.js */

let currentNote = "";
let score = 0;
let combo = 0;

/* --- 頁面切換 --- */
function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if (pageId === "characterPage") updateCharacter();
}

/* --- 遊戲啟動 --- */
function startGame() {
  switchPage("gamePage");
  nextNote();
}

/* --- 核心邏輯 --- */
const notes = ["C", "D", "E", "F", "G", "A", "B"];

function nextNote() {
  currentNote = notes[Math.floor(Math.random() * notes.length)];
  const noteEl = document.getElementById("note");
  noteEl.innerText = currentNote;
  
  // 加上彈出動畫效果
  noteEl.style.animation = "none";
  void noteEl.offsetWidth; // 強制觸發重繪
  noteEl.style.animation = "pop 0.3s ease-out";
}

/* --- 回答邏輯 (戰鬥計算) --- */
function answer(n) {
  if (n === currentNote) {
    // 判定是否爆擊
    const isCrit = Math.random() < player.critChance;
    let damage = getPlayerTotalAtk() + (isCrit ? (getPlayerTotalAtk() * player.critMultiplier) : 0);
    
    score += Math.floor(damage);
    combo++;
    player.exp += 10;
    player.gold += Math.floor(Math.random() * 5) + 1; // 隨機金幣

    // 觸發等級檢查
    levelUpCheck();
    
    // 視覺回饋
    if (isCrit) console.log("爆擊！");
  } else {
    combo = 0; // 斷連擊
  }

  updateUI();
  updateExpUI();
  nextNote();
}

/* --- UI 更新 --- */
function updateUI() {
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("combo").innerText = "Combo: " + combo;
  document.getElementById("goldDisplay").innerText = "💰 " + player.gold;
}

function updateExpUI() {
  const percent = (player.exp % player.expToNextLevel) / player.expToNextLevel * 100;
  document.getElementById("expFill").style.width = percent + "%";
  document.getElementById("expText").innerText = 
    `EXP ${player.exp % player.expToNextLevel} / ${player.expToNextLevel}`;
  document.getElementById("levelText").innerText = "Lv." + player.level;
}

/* --- 等級系統 --- */
function levelUpCheck() {
  if (player.exp >= player.level * 100) {
    player.level++;
    player.exp = 0;
    player.hp += 20;
    player.atk += 5;
    alert(`恭喜升級！現在是 Lv.${player.level}`);
  }
}

/* --- 人物頁面顯示 --- */
function updateCharacter() {
  document.getElementById("stats").innerHTML = `
    <div style="font-size: 1.2em; color: #00d4ff;">
      ATK: ${getPlayerTotalAtk()} | HP: ${player.hp + player.armor.hpBonus} | DEF: ${getPlayerTotalDef()}
    </div>
  `;

  document.getElementById("weapon").innerText = 
    `${player.weapon.name} (Attack +${player.weapon.atkBonus})`;

  document.getElementById("armor").innerText = 
    `${player.armor.name} (HP +${player.armor.hpBonus})`;

  document.getElementById("shield").innerText = 
    `${player.shield.name} (DEF +${player.shield.defBonus})`;
}

/* --- 返回 --- */
function backHome() {
  switchPage("homePage");
}
