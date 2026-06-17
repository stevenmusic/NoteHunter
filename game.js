/* ============================================================
   ⚔️ 核心狀態管理 (與英雄進度自動存檔)
   ============================================================ */
let player = {
  lv: 1,
  gold: 0,
  exp: 0,
  nextLvExp: 100,
  weaponLv: 1,
  shieldLv: 1,
  critMultiplier: 1.5
};

let monster = {
  name: "不老不死木人樁",
  hp: 200,
  maxHp: 200,
  color: "#2a6f97"
};

let combo = 0;
let score = 0;
let currentMode = 'treble';     // 當前考卷模式：'treble' 或 'bass'
let currentQuestion = null;     // 當前抽出的整筆題目物件

// 遊戲初始化
window.onload = function() {
  loadGameData();
  switchTab('menu'); // 預設打開大廳選單
  updateUI();
  updateExpUI();
};

/* ============================================================
   💾 存檔系統
   ============================================================ */
function saveGameData() {
  localStorage.setItem('music_rpg_player', JSON.stringify(player));
}

function loadGameData() {
  const saved = localStorage.getItem('music_rpg_player');
  if (saved) {
    try {
      player = JSON.parse(saved);
    } catch(e) {
      console.error("讀取存檔失敗，重設資料", e);
    }
  }
}

/* ============================================================
   🛠️ 戰鬥、升級數值計算邏輯
   ============================================================ */
function getWeaponAtk() { return player.weaponLv * 12; }
function getTotalCritChance() { return 0.10 + (player.shieldLv * 0.02); } // 盾牌加會心機率
function getWeaponUpgradeCost() { return player.weaponLv * 150; }
function getShieldUpgradeCost() { return player.shieldLv * 130; }

// 裝備升級
function upgradeWeapon() {
  let cost = getWeaponUpgradeCost();
  if (player.gold >= cost) {
    player.gold -= cost;
    player.weaponLv++;
    saveGameData();
    updateUI();
  } else {
    alert("金幣不足！快去答題擊敗怪物賺錢吧！");
  }
}

function upgradeShield() {
  let cost = getShieldUpgradeCost();
  if (player.gold >= cost) {
    player.gold -= cost;
    player.shieldLv++;
    saveGameData();
    updateUI();
  } else {
    alert("金幣不足！");
  }
}

/* ============================================================
   🎵 答題系統與出題核心 (完美融合外部題庫)
   ============================================================ */

// 進入「高音譜號」挑戰模式
function startTrebleMode() {
  currentMode = 'treble';
  document.querySelector('.game-window').classList.add('playing-mode');
  document.getElementById('gamePlayLayer').classList.add('active-play');
  
  combo = 0;
  document.getElementById('comboText').innerText = "連擊: 0";
  nextNote(); // 🌟 啟動出題！
}

// 進入「低音譜號」挑戰模式
function startBassMode() {
  currentMode = 'bass';
  document.querySelector('.game-window').classList.add('playing-mode');
  document.getElementById('gamePlayLayer').classList.add('active-play');
  
  combo = 0;
  document.getElementById('comboText').innerText = "連擊: 0";
  nextNote(); // 🌟 啟動出題！
}

// 退出挑戰返回主畫面
function backToMain() {
  document.querySelector('.game-window').classList.remove('playing-mode');
  document.getElementById('gamePlayLayer').classList.remove('active-play');
  updateUI();
}

// 核心出題程序
function nextNote() {
  // 1. 根據當前模式（高音/低音），從外部變數 NOTE_QUESTIONS 取得對應的題庫池
  const pool = NOTE_QUESTIONS[currentMode];
  
  if (!pool || pool.length === 0) {
    // 防呆：如果低音譜號還沒填入資料，給予安全提示
    document.getElementById("noteNote").innerHTML = `<div style="color:#5a5245; font-weight:bold; padding:20px;">低音譜號題庫建置中...</div>`;
    return;
  }
  
  // 2. 隨機抽題
  currentQuestion = pool[Math.floor(Math.random() * pool.length)];

  // 3. 將圖片插入至畫面指定的 ID 節點
  const noteEl = document.getElementById("noteNote");
  if (noteEl) {
    noteEl.innerHTML = `<img src="${currentQuestion.img}" alt="音符 ${currentQuestion.name}" class="staff-note-img">`;
  }

  // 4. 更新上方模式標題文字
  const modeTitle = currentMode === "treble" ? "高音挑戰 (C4 - C6)" : "低音挑戰 (C2 - C4)";
  document.getElementById("gameModeTitle").innerText = modeTitle;
}

// 玩家點擊英文字母按鍵答題
function answer(submittedAnswer) {
  if (!currentQuestion) return;

  // 比對英文字母是否完全一致
  if (submittedAnswer === currentQuestion.answer) {
    // 答對：觸發爆擊機率與傷害計算
    const isCrit = Math.random() < getTotalCritChance();
    const baseAtk = getWeaponAtk();
    const finalDmg = isCrit ? Math.floor(baseAtk * player.critMultiplier) : baseAtk;
    
    combo++;
    const rewardGold = 20 + Math.floor(combo / 3) * 5; // 連擊越高金幣加成
    player.gold += rewardGold; 
    
    // 獲得經驗值
    gainExp(15);
    
    // 背景痛擊史萊姆並產生華麗斬擊特效
    damageMonster(finalDmg, isCrit); 
  } else {
    // 答錯：中斷連擊
    combo = 0;
    triggerWrongFlash();
  }
  
  document.getElementById('comboText').innerText = `連擊: ${combo}`;
  updateUI(); 
  saveGameData(); 
  nextNote(); // 快速切換下一題
}

/* ============================================================
   💥 戰鬥打擊與經驗升級系統
   ============================================================ */
function damageMonster(dmg, isCrit) {
  monster.hp -= dmg;
  
  // 觸發前端史萊姆搖晃與斬擊線
  const slime = document.getElementById('monsterSlime');
  const slash = document.getElementById('slashLine');
  
  if(slime) {
    slime.classList.remove('damaged');
    void slime.offsetWidth; // 強制重繪觸發動畫
    slime.classList.add('damaged');
  }
  
  if(slash) {
    slash.classList.remove('animate');
    void slash.offsetWidth;
    slash.classList.add('animate');
  }

  if (monster.hp <= 0) {
    // 怪物擊殺，發放大量大獎勵並復活怪物
    player.gold += 100;
    gainExp(50);
    monster.hp = monster.maxHp;
    alert("🎉 成功討伐怪物！額外獲得 100 金幣！");
  }
  updateUI();
}

function gainExp(amount) {
  player.exp += amount;
  while (player.exp >= player.nextLvExp) {
    player.exp -= player.nextLvExp;
    player.lv++;
    player.nextLvExp = Math.floor(player.nextLvExp * 1.3); // 升級所需經驗遞增
    alert(`👑 恭喜升級！目前等級變更為 Lv.${player.lv}！`);
  }
  updateExpUI();
}

// 答錯畫面閃爍紅光防呆
function triggerWrongFlash() {
  const layer = document.getElementById('gamePlayLayer');
  layer.style.backgroundColor = '#3a1212';
  setTimeout(() => {
    layer.style.backgroundColor = '#161311';
  }, 150);
}

/* ============================================================
   🖥️ 介面 UI 數據同步更新
   ============================================================ */
function updateUI() {
  // 頂欄數據
  document.getElementById('playerGold').innerText = player.gold;
  document.getElementById('playerLv').innerText = `Lv.${player.lv}`;
  
  // 主首頁血條數據
  const hpPercent = Math.max(0, (monster.hp / monster.maxHp) * 100);
  document.getElementById('monsterHpFill').style.width = `${hpPercent}%`;
  document.getElementById('monsterHpText').innerText = `${monster.hp} / ${monster.maxHp}`;
  
  // 英雄裝備頁面數據同步
  document.getElementById('weaponLvText').innerText = `Lv.${player.weaponLv}`;
  document.getElementById('weaponAtkText').innerText = `攻擊力 +${getWeaponAtk()}`;
  document.getElementById('weaponCostText').innerText = `${getWeaponUpgradeCost()} G`;
  
  document.getElementById('shieldLvText').innerText = `Lv.${player.shieldLv}`;
  document.getElementById('shieldCritText').innerText = `會心率 +${(getTotalCritChance()*100).toFixed(0)}%`;
  document.getElementById('shieldCostText').innerText = `${getShieldUpgradeCost()} G`;
}

function updateExpUI() {
  const expPercent = (player.exp / player.nextLvExp) * 100;
  document.getElementById('expFill').style.width = `${expPercent}%`;
  document.getElementById('expText').innerText = `EXP: ${player.exp} / ${player.nextLvExp}`;
}

// 切換下方的控制抽屜頁籤 (大廳選單 / 英雄裝備)
function switchTab(tabId) {
  // 移除所有按鈕的 active 狀態
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  // 隱藏所有頁籤內容
  document.querySelectorAll('.drawer-content').forEach(content => content.classList.remove('active-content'));
  
  // 激活當前點選
  if(tabId === 'menu') {
    document.getElementById('navMenuBtn').classList.add('active');
    document.getElementById('menuContent').classList.add('active-content');
  } else if(tabId === 'hero') {
    document.getElementById('navHeroBtn').classList.add('active');
    document.getElementById('heroContent').classList.add('active-content');
  }
}

// 允許玩家直接手動點擊首頁史萊姆進行揮砍敲擊
function clickMonster() {
  const dmg = Math.floor(getWeaponAtk() * 0.4); // 手動敲擊給予 40% 傷害
  damageMonster(dmg, false);
}
