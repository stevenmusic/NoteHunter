/* game.js */

let currentNote = "";
let currentMode = "treble"; 
let score = 0;
let combo = 0;

// 五線譜第三線高度固定在 70px。
const notePositions = {
  treble: [
    { name: "C4", note: "C", top: 130, ledgerLines: [110] }, 
    { name: "D4", note: "D", top: 120, ledgerLines: [] }, 
    { name: "E4", note: "E", top: 110, ledgerLines: [] }, 
    { name: "F4", note: "F", top: 100, ledgerLines: [] }, 
    { name: "G4", note: "G", top: 90,  ledgerLines: [] }, 
    { name: "A4", note: "A", top: 80,  ledgerLines: [] }, 
    { name: "B4", note: "B", top: 70,  ledgerLines: [] }, 
    { name: "C5", note: "C", top: 60,  ledgerLines: [] }, 
    { name: "D5", note: "D", top: 50,  ledgerLines: [] }, 
    { name: "E5", note: "E", top: 40,  ledgerLines: [] }, 
    { name: "F5", note: "F", top: 30,  ledgerLines: [] }, 
    { name: "G5", note: "G", top: 20,  ledgerLines: [] }, 
    { name: "A5", note: "A", top: 10,  ledgerLines: [10] },  
    { name: "B5", note: "B", top: 0,   ledgerLines: [10] },  
    { name: "C6", note: "C", top: -10, ledgerLines: [10, -10] } 
  ],
  bass: [
    { name: "C2", note: "C", top: 150, ledgerLines: [130, 150] }, 
    { name: "D2", note: "D", top: 140, ledgerLines: [130] }, 
    { name: "E2", note: "E", top: 130, ledgerLines: [130] }, 
    { name: "F2", note: "F", top: 120, ledgerLines: [] }, 
    { name: "G2", note: "G", top: 110, ledgerLines: [] }, 
    { name: "A2", note: "A", top: 100, ledgerLines: [] }, 
    { name: "B2", note: "B", top: 90,  ledgerLines: [] }, 
    { name: "C3", note: "C", top: 80,  ledgerLines: [] }, 
    { name: "D3", note: "D", top: 70,  ledgerLines: [] }, 
    { name: "E3", note: "E", top: 60,  ledgerLines: [] }, 
    { name: "F3", note: "F", top: 50,  ledgerLines: [] }, 
    { name: "G3", note: "G", top: 40,  ledgerLines: [] }, 
    { name: "A3", note: "A", top: 30,  ledgerLines: [] }, 
    { name: "B3", note: "B", top: 20,  ledgerLines: [] }, 
    { name: "C4", note: "C", top: 10,  ledgerLines: [10] }   
  ]
};

/* ==========================================
   💾 核心新功能：存檔與讀檔機制
   ========================================== */

// 1. 自動存檔功能
function saveGameData() {
  const saveData = {
    score: score,
    player: player // 會把 data.js 裡面的等級、經驗、裝備一起包進來保存
  };
  // 將物件轉換成字串，存入瀏覽器本地硬碟中
  localStorage.setItem("noteHunter_save", JSON.stringify(saveData));
}

// 2. 自動讀檔功能
function loadGameData() {
  const savedString = localStorage.getItem("noteHunter_save");
  
  if (savedString) {
    try {
      const savedData = JSON.parse(savedString);
      
      // 回填分數
      score = savedData.score || 0;
      
      // 回填玩家角色狀態（等級、金幣、裝備）
      if (savedData.player) {
        player = savedData.player;
      }
      
      console.log("🎮 成功載入歷史存檔紀錄！");
    } catch (e) {
      console.error("讀取存檔時發生錯誤，改用全新冒險初始化", e);
    }
  } else {
    console.log("🆕 沒有找到任何歷史紀錄，開啟全新冒險！");
  }
  
  // 讀取完畢後，立刻重整一次 UI 畫面顯示正確數值
  updateUI();
  updateExpUI();
}

/* ==========================================
   🎮 遊戲核心邏輯
   ========================================== */

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

  let activeMode = currentMode;
  if (currentMode === "mix") {
    activeMode = Math.random() < 0.5 ? "treble" : "bass";
  }

  if (activeMode === "treble") {
    pool = notePositions.treble;
    clefEl.innerText = "𝄞"; 
    clefEl.style.fontSize = "80px";
    clefEl.style.top = "10px";  
  } else {
    pool = notePositions.bass;
    clefEl.innerText = "𝄢"; 
    clefEl.style.fontSize = "52px";
    clefEl.style.top = "33px";  
  }

  const randomQuiz = pool[Math.floor(Math.random() * pool.length)];
  currentNote = randomQuiz.note; 

  const noteEl = document.getElementById("noteNote");
  noteEl.style.top = randomQuiz.top + "px";

  document.querySelectorAll(".dynamic-ledger").forEach(line => line.remove());
  const containerEl = document.querySelector(".note-container");
  randomQuiz.ledgerLines.forEach(lineTop => {
    const line = document.createElement("div");
    line.className = "dynamic-ledger";
    line.style.top = lineTop + "px"; 
    containerEl.appendChild(line);
  });

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
  
  // 🌟 核心修正：只要數值一變動（答題後），就自動在背景默默存檔！
  saveGameData();
  
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

// 🌟 核心修正：當這個 game.js 檔案被網頁載入時，第一時間自動執行「讀檔」！
loadGameData();
