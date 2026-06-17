/* game.js - 傳統樂譜字體物理校正版 */

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
  armor: { name: "布質外衣", hpBonus: 10 },
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

// 🎯 依據 Bravura Text 音符中心重構的精確 Y 軸像素表（每度音高相差 10px）
const notePositions = {
  treble: [
    { name: "C4", note: "C", top: 150, ledgerLines: [150] }, // 下加一線 (中央C)
    { name: "D4", note: "D", top: 140, ledgerLines: [] }, 
    { name: "E4", note: "E", top: 130, ledgerLines: [] }, // 第一線
    { name: "F4", note: "F", top: 120, ledgerLines: [] }, 
    { name: "G4", note: "G", top: 110, ledgerLines: [] }, // 第二線
    { name: "A4", note: "A", top: 100, ledgerLines: [] }, 
    { name: "B4", note: "B", top: 90,  ledgerLines: [] }, // 第三線
    { name: "C5", note: "C", top: 80,  ledgerLines: [] }, 
    { name: "D5", note: "D", top: 70,  ledgerLines: [] }, // 第四線
    { name: "E5", note: "E", top: 60,  ledgerLines: [] }, 
    { name: "F5", note: "F", top: 50,  ledgerLines: [] }, // 第五線
    { name: "G5", note: "G", top: 40,  ledgerLines: [] }, 
    { name: "A5", note: "A", top: 30,  ledgerLines: [30] },  // 上加一線
    { name: "B5", note: "B", top: 20,  ledgerLines: [30] },  
    { name: "C6", note: "C", top: 10,  ledgerLines: [30, 10] } // 上加二線 (安全留在容器內 10px 處，絕不溢出)
  ],
  bass: [
    { name: "C2", note: "C", top: 170, ledgerLines: [150, 170] }, // 下加二線 (安全留在 170px 處)
    { name: "D2", note: "D", top: 160, ledgerLines: [150] }, 
    { name: "E2", note: "E", top: 150, ledgerLines: [150] }, // 下加一線
    { name: "F2", note: "F", top: 140, ledgerLines: [] }, 
    { name: "G2", note: "G", top: 130, ledgerLines: [] }, // 第一線
    { name: "A2", note: "A", top: 120, ledgerLines: [] }, 
    { name: "B2", note: "B", top: 110, ledgerLines: [] }, // 第二線
    { name: "C3", note: "C", top: 100, ledgerLines: [] }, 
    { name: "D3", note: "D", top: 90,  ledgerLines: [] }, // 第三線
    { name: "E3", note: "E", top: 80,  ledgerLines: [] }, 
    { name: "F3", note: "F", top: 70,  ledgerLines: [] }, // 第四線
    { name: "G3", note: "G", top: 60,  ledgerLines: [] }, 
    { name: "A3", note: "A", top: 50,  ledgerLines: [] }, // 第五線
    { name: "B3", note: "B", top: 40,  ledgerLines: [] }, 
    { name: "C4", note: "C", top: 30,  ledgerLines: [30] }   // 上加一線
  ]
};

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
      console.log("🎮 正常模式存檔成功載入！");
    } catch (e) {
      console.error(e);
    }
  }
  updateUI();
  updateExpUI();
}

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

  // 🎯 依據你提供的圖片比例鎖定：讓譜號高大、優雅，具有交響樂譜出版質感
  if (activeMode === "treble") {
    pool = notePositions.treble;
    clefEl.innerText = "𝄞"; 
    clefEl.style.fontSize = "115px"; // 放大高音譜號，使其完美高出五線譜
    clefEl.style.top = "12px";  
  } else {
    pool = notePositions.bass;
    clefEl.innerText = "𝄢"; 
    clefEl.style.fontSize = "72px";  // 放大低音譜號
    clefEl.style.top = "46px";  
  }

  const randomQuiz = pool[Math.floor(Math.random() * pool.length)];
  currentNote = randomQuiz.note; 

  const noteEl = document.getElementById("noteNote");
  if (noteEl) {
    noteEl.style.top = randomQuiz.top + "px";
  }

  document.querySelectorAll(".dynamic-ledger").forEach(line => line.remove());
  const containerEl = document.querySelector(".note-container");
  randomQuiz.ledgerLines.forEach(lineTop => {
    const line = document.createElement("div");
    line.className = "dynamic-ledger";
    line.style.top = lineTop + "px"; 
    containerEl.appendChild(line);
  });

  if (noteEl) {
    noteEl.style.animation = "none";
    void noteEl.offsetWidth; 
    noteEl.style.animation = "pop 0.15s ease-out";
  }
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
  saveGameData(); 
  nextNote();
}

function updateUI() {
  const scoreEl = document.getElementById("score");
  const comboEl = document.getElementById("combo");
  const goldEl = document.getElementById("goldDisplay");

  if (scoreEl) scoreEl.innerText = "Score: " + score;
  if (comboEl) comboEl.innerText = "Combo: " + combo;
  if (goldEl) goldEl.innerText = "💰 " + player.gold;
}

function updateExpUI() {
  const currentLevelExp = player.exp % player.expToNextLevel;
  const percent = (currentLevelExp / player.expToNextLevel) * 100;
  
  const fillEl = document.getElementById("expFill");
  const textEl = document.getElementById("expText");
  const lvEl = document.getElementById("levelText");

  if (fillEl) fillEl.style.width = percent + "%";
  if (textEl) textEl.innerText = `EXP ${currentLevelExp} / ${player.expToNextLevel}`;
  if (lvEl) lvEl.innerText = "Lv." + player.level;
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
  const totalHp = player.hp + (player.armor ? player.armor.hpBonus : 0);
  const totalDef = getPlayerTotalDef();

  const statsEl = document.getElementById("stats");
  const weaponEl = document.getElementById("weapon");
  const armorEl = document.getElementById("armor");
  const shieldEl = document.getElementById("shield");

  if (statsEl) {
    statsEl.innerHTML = `
      <div style="line-height: 1.6;">
        <strong style="color: #ffcc00;">⚔️ 總攻擊力:</strong> ${totalAtk} <br>
        <strong style="color: #ff4444;">❤️ 總生命值:</strong> ${totalHp} <br>
        <strong style="color: #00e5ff;">🛡️ 總防禦力:</strong> ${totalDef} <br>
        <strong style="color: #00ff88;">💥 爆擊機率:</strong> ${(player.critChance * 100).toFixed(0)}%
      </div>
    `;
  }

  if (weaponEl && player.weapon) {
    weaponEl.innerHTML = `
      <div style="font-weight: bold; color: #fff;">${player.weapon.name}</div>
      <div style="font-size: 13px; color: #aaa;">加成：攻擊力 +${player.weapon.atkBonus}</div>
    `;
  }
  if (armorEl && player.armor) {
    armorEl.innerHTML = `
      <div style="font-weight: bold; color: #fff;">${player.armor.name}</div>
      <div style="font-size: 13px; color: #aaa;">加成：生命值 +${player.armor.hpBonus}</div>
    `;
  }
  if (shieldEl && player.shield) {
    shieldEl.innerHTML = `
      <div style="font-weight: bold; color: #fff;">${player.shield.name}</div>
      <div style="font-size: 13px; color: #aaa;">加成：防禦力 +${player.shield.defBonus}</div>
    `;
  }
}

function backHome() {
  switchPage("homePage");
}

loadGameData();
