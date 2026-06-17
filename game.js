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
  name: "Lv.1 糰子暮泥",
  hp: 50,
  maxHp: 50
};

let combo = 0;
let currentMode = 'treble';     // 當前考卷模式：'treble' 或 'bass'
let currentQuestion = null;     // 當前從 questions.js 抽出的整筆題目物件

// 遊戲初始化
window.onload = function() {
  loadGameData();
  toggleDrawer('stage'); // 預設打開大廳選單
  updateUI();
  updateExpUI();
  
  // 繫結手動點擊怪物的事件
  const clickZone = document.getElementById('monsterClickZone');
  if (clickZone) {
    clickZone.addEventListener('click', clickMonster);
  }
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
function getTotalCritChance() { return 0.10 + (player.shieldLv * 0.02); } // 🛡️ 盾牌加會心機率
function getWeaponUpgradeCost() { return player.weaponLv * 150; }
function getShieldUpgradeCost() { return player.shieldLv * 130; }

// 裝備升級：武器
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

// 裝備升級：盾牌
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
   🎵 答題系統與出題核心 (對接 questions.js)
   ============================================================ */

// 進入挑戰模式 (由 HTML 鈕觸發)
function startGame(mode) {
  currentMode = mode;
  document.querySelector('.game-window').classList.add('playing-mode');
  document.getElementById('gamePlayLayer').classList.add('active-play');
  
  combo = 0;
  document.getElementById('combo').innerText = "連擊: 0";
  nextNote(); // 🌟 啟動出題！
}

// 退出挑戰返回主畫面
function backToLobby() {
  document.querySelector('.game-window').classList.remove('playing-mode');
  document.getElementById('gamePlayLayer').classList.remove('active-play');
  updateUI();
}

// 核心出題程序 (直接抓取外部變數 NOTE_QUESTIONS)
function nextNote() {
  // 防呆：確認外部 questions.js 是否成功載入
  if (typeof NOTE_QUESTIONS === 'undefined') {
    alert("找不到題庫資料！請確認 questions.js 是否正確存在且放在 game.js 之前載入。");
    return;
  }

  const pool = NOTE_QUESTIONS[currentMode];
  const noteEl = document.getElementById("noteNote");
  const clefEl = document.getElementById("staffClef");
  const modeTitleEl = document.getElementById("gameModeTitle");
  
  if (!pool || pool.length === 0) {
    if (noteEl) {
      noteEl.innerHTML = `<div style="color:#5a5245; font-weight:bold; font-size:14px; width:200px; text-align:center;">題庫建置中...</div>`;
    }
    return;
  }
  
  // 隨機抽題
  currentQuestion = pool[Math.floor(Math.random() * pool.length)];

  // 1. 更換五線譜前端對應的譜號圖標
  if (clefEl) {
    clefEl.innerText = currentMode === "treble" ? "𝄞" : "𝄢";
  }

  // 2. 更新挑戰頂部的提示文字
  if (modeTitleEl) {
    modeTitleEl.innerText = currentMode === "treble" ? "高音譜 · 斬妖卷" : "低音譜 · 鎮魔卷";
  }

  // 3. 渲染音符：直接抓取 questions.js 裡定義的本地圖片路徑 (img)
  if (noteEl) {
    noteEl.innerHTML = `<img src="${currentQuestion.img}" alt="音符 ${currentQuestion.name}" class="staff-note-img">`;
  }
}

// 玩家點擊英文字母按鍵答題
function answer(submittedAnswer) {
  if (!currentQuestion) return;

  // 比對答題字母是否完全一致 (不分大小寫可用 .toUpperCase()，此處預設全大寫)
  if (submittedAnswer === currentQuestion.answer) {
    // 答對：觸發爆擊率與傷害計算
    const isCrit = Math.random() < getTotalCritChance();
    const baseAtk = getWeaponAtk();
    const finalDmg = isCrit ? Math.floor(baseAtk * player.critMultiplier) : baseAtk;
    
    combo++;
    // 連擊加成公式：基礎 20 金幣，每 3 連擊每題多加 5 金幣
    const rewardGold = 20 + Math.floor(combo / 3) * 5; 
    player.gold += rewardGold; 
    
    gainExp(15); // 每題答對基本經驗
    damageMonster(finalDmg, isCrit); 
  } else {
    // 答錯：中斷連擊並閃爍畫面紅光
    combo = 0;
    triggerWrongFlash();
  }
  
  document.getElementById('combo').innerText = `連擊: ${combo}`;
  updateUI(); 
  saveGameData(); 
  nextNote(); // 快速切換下一題
}

/* ============================================================
   💥 戰鬥打擊與經驗升級系統
   ============================================================ */
function damageMonster(dmg, isCrit) {
  monster.hp -= dmg;
  
  const slime = document.getElementById('mainSlime');
  const slash = document.getElementById('slashFx');
  
  // 觸發前端史萊姆搖晃
  if(slime) {
    slime.classList.remove('damaged');
    void slime.offsetWidth; // 重塑 DOM 強制重新觸發 CSS Animation
    slime.classList.add('damaged');
  }
  
  // 觸發手動斬擊特效線
  if(slash) {
    slash.classList.remove('animate');
    void slash.offsetWidth;
    slash.classList.add('animate');
    // 如果是爆擊，斬擊光芒轉為黃金和風色，普通攻擊則為血紅色
    slash.style.boxShadow = isCrit ? "0 0 8px #fff, 0 0 20px #d4af37" : "0 0 6px #fff, 0 0 14px #ff1a1a";
  }

  // 怪物擊殺判定
  if (monster.hp <= 0) {
    player.gold += 100;
    gainExp(50);
    monster.hp = monster.maxHp; // 怪物即時復活
    alert("🎉 成功討伐妖魔！額外斬獲 100 金幣！");
  }
  updateUI();
}

// 經驗值獲取與升段機制
function gainExp(amount) {
  player.exp += amount;
  while (player.exp >= player.nextLvExp) {
    player.exp -= player.nextLvExp;
    player.lv++;
    player.nextLvExp = Math.floor(player.nextLvExp * 1.3); // 下一級所需經驗增加 30%
    alert(`👑 恭喜武者突破！目前段位晉升為：段位.${player.lv}！`);
  }
  updateExpUI();
}

// 答錯時答題層短暫紅光防呆
function triggerWrongFlash() {
  const layer = document.getElementById('gamePlayLayer');
  if(layer) {
    layer.style.backgroundColor = '#3a1212';
    setTimeout(() => { layer.style.backgroundColor = '#161311'; }, 150);
  }
}

/* ============================================================
   🖥️ 介面 UI 數據同步與動態卡片渲染
   ============================================================ */
function updateUI() {
  // 頂欄數據更新
  document.getElementById('goldDisplay').innerText = `🪙 ${player.gold}`;
  document.getElementById('levelText').innerText = `段位.${player.lv}`;
  
  // 首頁主舞台血條更新
  const hpPercent = Math.max(0, (monster.hp / monster.maxHp) * 100);
  document.getElementById('monsterHpFill').style.width = `${hpPercent}%`;
  document.getElementById('monsterHpText').innerText = `體力: ${monster.hp} / ${monster.maxHp}`;
  
  // 動態注入總屬性數據面板 (對齊 HTML #stats 節點)
  const statsEl = document.getElementById('stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <span>⚔️ 總斬擊力: ${getWeaponAtk()}</span>
      <span>⚡ 總會心率: ${(getTotalCritChance() * 100).toFixed(0)}%</span>
    `;
  }

  // 動態注入武器升級卡片面版 (對齊 HTML #weapon 節點)
  const weaponEl = document.getElementById('weapon');
  if (weaponEl) {
    weaponEl.innerHTML = `
      <div class="item-card">
        <div class="card-info">
          <span class="card-title">⚔️ 百鬼斬妖刃</span>
          <span class="card-lv">Lv.${player.weaponLv}</span>
          <span class="card-props">攻擊力 +${getWeaponAtk()}</span>
        </div>
        <button class="up-btn up-btn-weapon" onclick="upgradeWeapon()">
          <span>強化</span>
          <span style="font-size:10px;">🪙 ${getWeaponUpgradeCost()}</span>
        </button>
      </div>
    `;
  }

  // 動態注入盾牌升級卡片面板 (對齊 HTML #shield 節點)
  const shieldEl = document.getElementById('shield');
  if (shieldEl) {
    shieldEl.innerHTML = `
      <div class="item-card">
        <div class="card-info">
          <span class="card-title">🛡️ 御魂和歌盾</span>
          <span class="card-lv">Lv.${player.shieldLv}</span>
          <span class="card-props">會心率 +${(getTotalCritChance() * 100).toFixed(0)}%</span>
        </div>
        <button class="up-btn up-btn-shield" onclick="upgradeShield()">
          <span>強化</span>
          <span style="font-size:10px;">🪙 ${getShieldUpgradeCost()}</span>
        </button>
      </div>
    `;
  }
}

// 經驗條專用更新
function updateExpUI() {
  const expPercent = (player.exp / player.nextLvExp) * 100;
  document.getElementById('expFill').style.width = `${expPercent}%`;
  document.getElementById('expText').innerText = `魂魄 ${player.exp} / ${player.nextLvExp}`;
}

/* ============================================================
   🗺️ 介面切換 (切換首頁關卡 / 英雄裝備抽屜)
   ============================================================ */
function toggleDrawer(tabId) {
  // 清除導覽列按鈕與抽屜內容的所有 active 狀態
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.drawer-content').forEach(content => content.classList.remove('active-content'));
  
  // 根據點擊目標激活對應的分頁
  if (tabId === 'stage') {
    document.getElementById('navHomeBtn').classList.add('active');
    document.getElementById('stageMenu').classList.add('active-content');
  } else if (tabId === 'equip') {
    document.getElementById('navCharBtn').classList.add('active');
    document.getElementById('equipMenu').classList.add('active-content');
  }
}

// 允許玩家直接手動點擊首頁史萊姆進行揮砍敲擊 (放置點擊回饋)
function clickMonster() {
  const dmg = Math.floor(getWeaponAtk() * 0.4); // 手動敲擊給予 40% 的基本攻擊力傷害
  damageMonster(dmg, false);
}
