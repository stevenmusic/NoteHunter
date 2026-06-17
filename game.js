/* game.js */

let currentNote = "";
let currentMode = "treble"; // treble: 高音, bass: 低音, mix: 混合
let score = 0;
let combo = 0;

// 音符定義與維基百科標準五線譜圖片對應表
const noteData = {
  // 高音譜號範圍 C4 ~ C6
  treble: [
    { note: "C", name: "C4", img: "https://upload.wikimedia.org/wikipedia/commons/e/e1/C4_treble_clef.png" },
    { note: "D", name: "D4", img: "https://upload.wikimedia.org/wikipedia/commons/b/be/D4_treble_clef.png" },
    { note: "E", name: "E4", img: "https://upload.wikimedia.org/wikipedia/commons/a/ae/E4_treble_clef.png" },
    { note: "F", name: "F4", img: "https://upload.wikimedia.org/wikipedia/commons/3/3d/F4_treble_clef.png" },
    { note: "G", name: "G4", img: "https://upload.wikimedia.org/wikipedia/commons/f/f9/G4_treble_clef.png" },
    { note: "A", name: "A4", img: "https://upload.wikimedia.org/wikipedia/commons/c/c1/A4_treble_clef.png" },
    { note: "B", name: "B4", img: "https://upload.wikimedia.org/wikipedia/commons/4/4e/B4_treble_clef.png" },
    { note: "C", name: "C5", img: "https://upload.wikimedia.org/wikipedia/commons/7/7f/C5_treble_clef.png" },
    { note: "D", name: "D5", img: "https://upload.wikimedia.org/wikipedia/commons/d/df/D5_treble_clef.png" },
    { note: "E", name: "E5", img: "https://upload.wikimedia.org/wikipedia/commons/5/53/E5_treble_clef.png" },
    { note: "F", name: "F5", img: "https://upload.wikimedia.org/wikipedia/commons/3/30/F5_treble_clef.png" },
    { note: "G", name: "G5", img: "https://upload.wikimedia.org/wikipedia/commons/8/81/G5_treble_clef.png" },
    { note: "A", name: "A5", img: "https://upload.wikimedia.org/wikipedia/commons/6/63/A5_treble_clef.png" },
    { note: "B", name: "B5", img: "https://upload.wikimedia.org/wikipedia/commons/4/46/B5_treble_clef.png" },
    { note: "C", name: "C6", img: "https://upload.wikimedia.org/wikipedia/commons/c/cc/C6_treble_clef.png" }
  ],
  // 低音譜號範圍 C2 ~ C4
  bass: [
    { note: "C", name: "C2", img: "https://upload.wikimedia.org/wikipedia/commons/4/4d/C2_bass_clef.png" },
    { note: "D", name: "D2", img: "https://upload.wikimedia.org/wikipedia/commons/9/90/D2_bass_clef.png" },
    { note: "E", name: "E2", img: "https://upload.wikimedia.org/wikipedia/commons/8/8b/E2_bass_clef.png" },
    { note: "F", name: "F2", img: "https://upload.wikimedia.org/wikipedia/commons/3/32/F2_bass_clef.png" },
    { note: "G", name: "G2", img: "https://upload.wikimedia.org/wikipedia/commons/0/05/G2_bass_clef.png" },
    { note: "A", name: "A2", img: "https://upload.wikimedia.org/wikipedia/commons/0/0e/A2_bass_clef.png" },
    { note: "B", name: "B2", img: "https://upload.wikimedia.org/wikipedia/commons/7/7b/B2_bass_clef.png" },
    { note: "C", name: "C3", img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/C3_bass_clef.png" },
    { note: "D", name: "D3", img: "https://upload.wikimedia.org/wikipedia/commons/9/91/D3_bass_clef.png" },
    { note: "E", name: "E3", img: "https://upload.wikimedia.org/wikipedia/commons/6/68/E3_bass_clef.png" },
    { note: "F", name: "F3", img: "https://upload.wikimedia.org/wikipedia/commons/e/e6/F3_bass_clef.png" },
    { note: "G", name: "G3", img: "https://upload.wikimedia.org/wikipedia/commons/a/af/G3_bass_clef.png" },
    { note: "A", name: "A3", img: "https://upload.wikimedia.org/wikipedia/commons/e/ea/A3_bass_clef.png" },
    { note: "B", name: "B3", img: "https://upload.wikimedia.org/wikipedia/commons/0/01/B3_bass_clef.png" },
    { note: "C", name: "C4", img: "https://upload.wikimedia.org/wikipedia/commons/e/e4/C4_bass_clef.png" }
  ]
};

/* ==========================================
   1. 頁面切換控制
   ========================================== */
function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if (pageId === "characterPage") updateCharacter();
}

/* ==========================================
   2. 遊戲啟動 (載入對應模式)
   ========================================== */
function startGame(mode) {
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
}

/* ==========================================
   3. 出題邏輯 (根據模式撈取對應圖片網址)
   ========================================== */
function nextNote() {
  let pool = [];
  
  if (currentMode === "treble") {
    pool = noteData.treble;
  } else if (currentMode === "bass") {
    pool = noteData.bass;
  } else {
    // 混合模式：利用展開運算子融合兩個陣列
    pool = [...noteData.treble, ...noteData.bass];
  }

  // 隨機抽一題
  const randomQuiz = pool[Math.floor(Math.random() * pool.length)];
  currentNote = randomQuiz.note; // 設定標準答案字母 (如 'C')

  // 渲染圖片
  const imgEl = document.getElementById("noteImage");
  imgEl.src = randomQuiz.img;

  // 觸發容器彈出動畫 (重置 DOM 動畫機制)
  const containerEl = document.querySelector(".note-container");
  containerEl.style.animation = "none";
  void containerEl.offsetWidth; 
  containerEl.style.animation = "pop 0.2s ease-out";
}

/* ==========================================
   4. 答題判定與數值膨脹計算 (TT2 核心)
   ========================================== */
function answer(n) {
  if (n === currentNote) {
    // 判定是否觸發爆擊
    const isCrit = Math.random() < player.critChance;
    
    // 計算傷害 (爆擊則乘上爆擊倍率)
    let damage = getPlayerTotalAtk();
    if (isCrit) {
      damage = damage * player.critMultiplier;
    }
    
    // 答對獎勵
    score += Math.floor(damage);
    combo++;
    player.exp += 15; // 提高經驗值獲得
    player.gold += Math.floor(Math.random() * 5) + 2; // 隨機獲得 2~6 金幣

    levelUpCheck();
  } else {
    // 答錯斷 Combo 處罰
    combo = 0;
  }

  updateUI();
  updateExpUI();
  nextNote();
}

/* ==========================================
   5. 全域 UI 數據刷新
   ========================================== */
function updateUI() {
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("combo").innerText = "Combo: " + combo;
  document.getElementById("goldDisplay").innerText = "💰 " + player.gold;
}

function updateExpUI() {
  // 計算當前等級內的經驗值百分比
  const currentLevelExp = player.exp % player.expToNextLevel;
  const percent = (currentLevelExp / player.expToNextLevel) * 100;
  
  document.getElementById("expFill").style.width = percent + "%";
  document.getElementById("expText").innerText = `EXP ${currentLevelExp} / ${player.expToNextLevel}`;
  document.getElementById("levelText").innerText = "Lv." + player.level;
}

/* ==========================================
   6. RPG 升級機制
   ========================================== */
function levelUpCheck() {
  // 如果累積經驗超過當前等級門檻
  if (player.exp >= player.level * player.expToNextLevel) {
    player.level++;
    // 數值增強
    player.hp += 25;
    player.atk += 6;
    
    // 稍微提高下一級所需的經驗門檻 (營造後期養成感)
    player.expToNextLevel = Math.floor(player.expToNextLevel * 1.1);
  }
}

/* ==========================================
   7. 人物狀態頁面數據整合
   ========================================== */
function updateCharacter() {
  // 計算總和屬性 (基礎值 + 裝備外掛值)
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

/* ==========================================
   8. 回退首頁
   ========================================== */
function backHome() {
  switchPage("homePage");
}
