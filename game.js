/* ============================================================
   🎨 裝備與五線譜 SVG 資源
   ============================================================ */
const ICON_WEAPON = `<svg viewBox="0 0 64 64" width="38" height="38"><defs><linearGradient id="w" x1="0" x2="1"><stop offset="0%" stop-color="#bc002d"/><stop offset="100%" stop-color="#3a0007"/></linearGradient></defs><path d="M10 50 L50 10 L54 14 L14 54 Z" fill="url(#w)" stroke="#d4af37" stroke-width="2"/><path d="M8 56 L16 48" stroke="#d4af37" stroke-width="4" stroke-linecap="round"/><circle cx="8" cy="56" r="3" fill="#fff"/></svg>`;
const ICON_SHIELD = `<svg viewBox="0 0 64 64" width="38" height="38"><defs><linearGradient id="s" x1="0" x2="1"><stop offset="0%" stop-color="#e6c280"/><stop offset="100%" stop-color="#aa851c"/></linearGradient></defs><path d="M32 6 C45 6 54 14 54 34 C54 50 32 60 32 60 C32 60 10 50 10 34 C10 14 19 6 32 6 Z" fill="url(#s)" stroke="#1c1b1a" stroke-width="2.5"/><circle cx="32" cy="32" r="10" fill="none" stroke="#bc002d" stroke-width="3"/></svg>`;

const TREBLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="130" viewBox="0 0 36 150" style="position:absolute;left:6px;top:10px;"><path fill="#1a1a1a" d="M18,4 C20,4 24,8 24,14 C24,22 20,30 16,38 C22,34 28,36 30,42 C33,50 30,60 24,64 C20,67 15,68 12,66 C8,64 6,60 6,55 C6,48 10,43 16,42 C20,41 24,43 26,47 C28,51 27,57 24,60 C21,63 17,63 15,61 C13,59 13,56 15,54 C17,52 20,53 20,55 C20,57 18,58 17,57 C16,56 17,54 18,55 Z M18,74 C18,74 18,110 18,125 C16,130 12,133 10,138 C8,142 9,146 12,147 C16,148 20,145 22,141 C24,137 23,132 20,129 C19,127 18,126 18,125 "/></svg>`;
const BASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60" style="position:absolute;left:8px;top:44px;"><path fill="#1a1a1a" d="M6,12 C6,12 8,2 16,2 C24,2 30,10 30,22 C30,36 22,46 10,50 C8,51 6,51 6,50 C6,49 8,49 10,48 C20,44 26,35 26,22 C26,12 21,6 16,6 C11,6 9,10 9,14 C9,18 11,20 14,20 C17,20 19,18 19,15 C19,13 17,11 15,12 C14,12 13,13 14,14 Z"/><circle cx="38" cy="9" r="4"/><circle cx="38" cy="21" r="4"/></svg>`;
const WHOLE_NOTE_SVG = `<svg width="30" height="22" viewBox="-15 -11 30 22"><ellipse cx="0" cy="0" rx="12" ry="7.5" fill="none" stroke="#1a1a1a" stroke-width="3.5"/></svg>`;

/* ============================================================
   👤 核心狀態資料
   ============================================================ */
let player = {
  name: "雷恩", level: 1, exp: 0, expToNextLevel: 100, gold: 0,
  hp: 100, atk: 10, def: 5, critChance: 0.12, critMultiplier: 1.5,
  weapon: { name:"武者打刀", atkBonus:2, level: 1 }, 
  shield: { name:"御神木盾", defBonus:1, critBonus: 0, level: 1 }
};

let monster = { level: 1, maxHp: 50, currentHp: 50, typeIndex: 0 };
let currentNote = ""; let currentMode = "treble";
let score = 0; let combo = 0; let lastClickTime = 0; let lastHeartbeat = Date.now();
let activeDrawerType = null; // 紀錄目前展開的抽屜：null(無), 'stage'(關卡), 'equip'(裝備)

const YOKAI_DATABASE = [
  { name: "糰子暮泥", icon: "💧", bg: "radial-gradient(circle at 35% 35%, #9ae5f3, #4eaec5)" }, 
  { name: "古剎提燈", icon: "🏮", bg: "radial-gradient(circle at 35% 35%, #ffb366, #d96600)" },
  { name: "唐傘小僧", icon: "🌂", bg: "radial-gradient(circle at 35% 35%, #ff99aa, #cc3355)" },
  { name: "川流河童", icon: "🥒", bg: "radial-gradient(circle at 35% 35%, #b3ff66, #559900)" },
  { name: "隱世化狸", icon: "🍃", bg: "radial-gradient(circle at 35% 35%, #d9b38c, #80552b)" },
  { name: "裂風鐮鼬", icon: "🌪️", bg: "radial-gradient(circle at 35% 35%, #e6ccff, #8033cc)" },
  { name: "迷霧雪女", icon: "❄️", bg: "radial-gradient(circle at 35% 35%, #ffffff, #99ccff)" },
  { name: "鞍馬鴉天狗", icon: "👺", bg: "radial-gradient(circle at 35% 35%, #ff6666, #990000)" },
  { name: "大江山赤鬼", icon: "👹", bg: "radial-gradient(circle at 35% 35%, #ff3333, #660000)" },
  { name: "遠古八岐大蛇", icon: "🐉", bg: "radial-gradient(circle at 35% 35%, #ffd700, #b8860b)" }
];

const notePositions = {
  treble: [
    { note:"C", top:130 }, { note:"D", top:122 }, { note:"E", top:114 }, { note:"F", top:106 },
    { note:"G", top:98 },  { note:"A", top:90 },  { note:"B", top:82 },  { note:"C", top:74 },
    { note:"D", top:66 },  { note:"E", top:58 },  { note:"F", top:50 },  { note:"G", top:42 },
    { note:"A", top:34 },  { note:"B", top:26 },  { note:"C", top:18 }
  ],
  bass: [
    { note:"C", top:142 }, { note:"D", top:134 }, { note:"E", top:126 }, { note:"F", top:118 },
    { note:"G", top:110 }, { note:"A", top:102 }, { note:"B", top:94 },  { note:"C", top:86 },
    { note:"D", top:78 },  { note:"E", top:70 },  { note:"F", top:62 },  { note:"G", top:54 },
    { note:"A", top:46 },  { note:"B", top:38 },  { note:"C", top:30 }
  ]
};

function getWeaponAtk() { return player.atk + (player.weapon.atkBonus || 0); }
function getTotalCritChance() { return player.critChance + (player.shield.critBonus || 0); }

/* ============================================================
   📂 核心：抽屜開合控管邏輯
   ============================================================ */
function toggleDrawer(type) {
  const defaultTip = document.getElementById("defaultTip");
  const stageMenu = document.getElementById("stageMenu");
  const equipMenu = document.getElementById("equipMenu");
  const navHomeBtn = document.getElementById("navHomeBtn");
  const navCharBtn = document.getElementById("navCharBtn");

  // 如果點擊已打開的同個按鈕 -> 關閉並返回預設提示面板
  if (activeDrawerType === type) {
    activeDrawerType = null;
  } else {
    activeDrawerType = type;
  }

  // 隱藏所有抽屜子內容
  defaultTip.classList.remove("active-content");
  stageMenu.classList.remove("active-content");
  equipMenu.classList.remove("active-content");
  navHomeBtn.classList.remove("active");
  navCharBtn.classList.remove("active");

  // 根據當前狀態分流顯示
  if (activeDrawerType === 'stage') {
    stageMenu.classList.add("active-content");
    navHomeBtn.classList.add("active");
  } else if (activeDrawerType === 'equip') {
    equipMenu.classList.add("active-content");
    navCharBtn.classList.add("active");
    updateCharacter();
  } else {
    defaultTip.classList.add("active-content");
  }
}

/* ============================================================
   ⚡ 特效調度中心
   ============================================================ */
function triggerVisualEffect(fxType) {
  const mainSlime = document.getElementById('mainSlime');
  const slashFx = document.getElementById('slashFx');
  const autoFx = document.getElementById('autoFx');
  
  // 讓妖怪產生受擊搖晃動畫
  if(mainSlime) {
    mainSlime.classList.add('damaged');
    setTimeout(() => mainSlime.classList.remove('damaged'), 200);
  }

  if (fxType === 'manual') {
    if (slashFx) {
      slashFx.classList.remove('animate');
      void slashFx.offsetWidth; // 觸發 DOM 重繪以重新啟動 CSS 動畫
      slashFx.classList.add('animate');
    }
  } else if (fxType === 'auto') {
    if (autoFx) {
      autoFx.classList.remove('animate');
      void autoFx.offsetWidth; 
      autoFx.classList.add('animate');
    }
  }
}

/* ============================================================
   🕹️ 點擊怪獸處理（強制發動手動凌厲雙倍傷害）
   ============================================================ */
function handleMonsterClick(e) {
  e.stopPropagation(); 
  const now = Date.now();
  if (now - lastClickTime < 150) return; // 稍微放寬安全防連點時間
  lastClickTime = now;
  
  const isCrit = Math.random() < getTotalCritChance();
  // ⚡ 點擊強制發動基礎數值或爆擊數值的「真實雙倍傷害」
  const clickDmg = isCrit ? Math.floor(getWeaponAtk() * player.critMultiplier * 2) : (getWeaponAtk() * 2);
  
  damageMonster(clickDmg, false, 'manual');
}
document.getElementById("monsterClickZone")?.addEventListener("click", handleMonsterClick);

/* ============================================================
   ⚔️ 戰鬥傷害計算法核心
   ============================================================ */
function damageMonster(amount, skipVisuals = false, fxType = 'auto') {
  monster.currentHp -= amount;
  if (!skipVisuals) triggerVisualEffect(fxType);
  
  while (monster.currentHp <= 0) {
    executeSpawnNextMonster();
  }
  
  updateUI();
  updateExpUI();
  saveGameData();
}

function executeSpawnNextMonster() {
  monster.level++;
  monster.maxHp = Math.floor(50 * Math.pow(1.25, monster.level - 1));
  monster.currentHp += monster.maxHp; 
  monster.typeIndex = (monster.level - 1) % YOKAI_DATABASE.length;
  player.gold += 10; 
  player.exp += 15;
  levelUp();
  applyYokaiVisuals(); 
}

function applyYokaiVisuals() {
  const currentYokai = YOKAI_DATABASE[monster.typeIndex] || YOKAI_DATABASE[0];
  const mainSlime = document.getElementById('mainSlime');
  const mainIcon = document.getElementById('mainMonsterIcon');
  if(mainSlime) mainSlime.style.background = currentYokai.bg;
  if(mainIcon) mainIcon.innerText = currentYokai.icon;
}

/* ============================================================
   🎵 進入/結束答題模式
   ============================================================ */
function startGame(mode){
  currentMode = mode;
  // 隱藏主舞台與動態抽屜，顯示五線譜
  document.getElementById("mainArena").style.display = "none";
  document.getElementById("actionDrawer").style.display = "none";
  document.getElementById("gamePlayLayer").classList.add("active-play");
  nextNote();
}

function backToLobby() {
  // 還原主大廳與抽屜顯示
  document.getElementById("mainArena").style.display = "flex";
  document.getElementById("actionDrawer").style.display = "flex";
  document.getElementById("gamePlayLayer").classList.remove("active-play");
  applyYokaiVisuals();
}

function nextNote(){
  const lookupMode = currentMode;
  const pool = notePositions[lookupMode] || notePositions['treble'];
  const q = pool[Math.floor(Math.random()*pool.length)];
  currentNote = q.note;

  const noteEl = document.getElementById("noteNote");
  if(noteEl) {
    noteEl.innerHTML = WHOLE_NOTE_SVG;
    noteEl.style.top = q.top + "px";
  }
  const clef = document.getElementById("staffClef");
  if(clef) clef.innerHTML = lookupMode==="treble" ? TREBLE_SVG : BASS_SVG;
}

function answer(n){
  if(n === currentNote){
    const isCrit = Math.random() < getTotalCritChance();
    const baseAtk = getWeaponAtk();
    const finalDmg = isCrit ? Math.floor(baseAtk * player.critMultiplier) : baseAtk;
    score += finalDmg;
    combo++;
    player.gold += 20; 
    // 答題成功時在背景持續攻擊怪獸，不顯示跳躍特效以免報錯
    damageMonster(finalDmg, true); 
  } else {
    combo = 0;
  }
  updateUI(); updateExpUI(); saveGameData(); nextNote();
}

/* ============================================================
   🛠️ 裝備強化骨架生成與狀態更新
   ============================================================ */
function buildStaticEquipmentCards() {
  const wpContainer = document.getElementById("weapon");
  const sdContainer = document.getElementById("shield");
  if(wpContainer) {
    wpContainer.innerHTML = `
      <div class="item-card">
        <div>${ICON_WEAPON}</div>
        <div style="flex:1">
          <div class="card-title">${player.weapon.name} <span id="wpLvlText" class="card-lv"></span></div>
          <div id="wpPropsText" class="card-props"></div>
        </div>
        <button onclick="upgradeWeapon()" class="up-btn up-btn-weapon">
          <span>強化</span><span id="wpCostText" style="font-size:10px; opacity:0.9;"></span>
        </button>
      </div>`;
  }
  if(sdContainer) {
    sdContainer.innerHTML = `
      <div class="item-card">
        <div>${ICON_SHIELD}</div>
        <div style="flex:1">
          <div class="card-title">${player.shield.name} <span id="sdLvlText" class="card-lv"></span></div>
          <div id="sdPropsText" class="card-props"></div>
        </div>
        <button onclick="upgradeShield()" class="up-btn up-btn-shield">
          <span>鍛造</span><span id="sdCostText" style="font-size:10px; opacity:0.9;"></span>
        </button>
      </div>`;
  }
  updateCharacter();
}

function upgradeWeapon() {
  let cost = (player.weapon.level || 1) * 20;
  if (player.gold >= cost) {
    player.gold -= cost; player.weapon.level++;        
    player.weapon.atkBonus = (player.weapon.atkBonus || 0) + 4;  
    updateCharacter(); updateUI(); saveGameData();
  }
}

function upgradeShield() {
  let cost = (player.shield.level || 1) * 20;
  if (player.gold >= cost) {
    player.gold -= cost; player.shield.level++;
    player.shield.critBonus = (player.shield.critBonus || 0) + 0.03;
    updateCharacter(); updateUI(); saveGameData();
  }
}

function updateCharacter() {
  const currentTotalAtk = getWeaponAtk();
  const currentTotalCrit = Math.round(getTotalCritChance() * 100);
  const statsEl = document.getElementById("stats");
  if(statsEl) {
    statsEl.innerHTML = `
      <div style="background:#f5eedf; padding:6px; border-radius:4px; border:2px solid #d4af37; font-weight:bold; color:#1c1b1a; text-align:center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); margin-bottom:8px; font-size:12px;">
        ⚔️ 總攻擊力: <span style="color:#bc002d">${currentTotalAtk}</span> | ⚡ 會心率: <span style="color:#203b2e">${currentTotalCrit}%</span>
      </div>`;
  }
  if(document.getElementById("wpLvlText")) document.getElementById("wpLvlText").innerText = `+${player.weapon.level}`;
  if(document.getElementById("wpPropsText")) document.getElementById("wpPropsText").innerText = `攻擊附加 + ${player.weapon.atkBonus}`;
  if(document.getElementById("wpCostText")) document.getElementById("wpCostText").innerText = `🪙${player.weapon.level * 20}`;
  if(document.getElementById("sdLvlText")) document.getElementById("sdLvlText").innerText = `+${player.shield.level}`;
  if(document.getElementById("sdPropsText")) document.getElementById("sdPropsText").innerText = `🛡️ 格擋 +${player.shield.defBonus} | 會心 +${Math.round((player.shield.critBonus || 0)*100)}%`;
  if(document.getElementById("sdCostText")) document.getElementById("sdCostText").innerText = `🪙${player.shield.level * 20}`;
}

/* ============================================================
   💾 資料更新與輔助邏輯
   ============================================================ */
function levelUp(){
  if(player.exp >= player.level * player.expToNextLevel){
    player.exp -= (player.level * player.expToNextLevel);
    player.level++; player.atk += 2; player.hp += 10;
  }
}

function updateUI(){
  if(document.getElementById("score")) document.getElementById("score").innerText = "戰功: " + score;
  if(document.getElementById("combo")) document.getElementById("combo").innerText = "連擊: " + combo;
  if(document.getElementById("goldDisplay")) document.getElementById("goldDisplay").innerText = "🪙 " + player.gold;
  if(document.getElementById("playerName")) document.getElementById("playerName").innerText = "武者 · " + player.name;
  
  const mName = document.getElementById("monsterName");
  const mHpText = document.getElementById("monsterHpText");
  const mHpFill = document.getElementById("monsterHpFill");
  
  const currentYokai = YOKAI_DATABASE[monster.typeIndex] || YOKAI_DATABASE[0];
  if(mName) mName.innerText = `Lv.${monster.level} ${currentYokai.name}`;
  
  const displayHp = Math.max(0, Math.ceil(monster.currentHp));
  if(mHpText) mHpText.innerText = `體力: ${displayHp} / ${monster.maxHp}`;
  if(mHpFill) mHpFill.style.width = ((displayHp / monster.maxHp) * 100) + "%";
}

function updateExpUI(){
  const fill = document.getElementById("expFill");
  const lv = document.getElementById("levelText");
  const expText = document.getElementById("expText");
  let currentLevelMaxExp = player.level * player.expToNextLevel;
  if(fill) fill.style.width = (player.exp / currentLevelMaxExp) * 100 + "%";
  if(lv) lv.innerText = "段位." + player.level;
  if(expText) expText.innerText = `魂魄 ${player.exp} / ${currentLevelMaxExp}`;
}

function saveGameData(){ localStorage.setItem("noteHunter_v2", JSON.stringify({ player, score, monster })); }

function loadGameData(){
  const data = JSON.parse(localStorage.getItem("noteHunter_v2"));
  if(data){
    player = data.player || player; score = data.score || 0; if(data.monster) monster = data.monster;
  }
  buildStaticEquipmentCards(); updateUI(); updateExpUI(); applyYokaiVisuals();
}

/* 🕒 核心背景定時器：每秒進行自動攻擊，並渲染專屬的「爆炸火花特效」 */
setInterval(() => {
  const now = Date.now(); 
  let elapsedMs = now - lastHeartbeat;
  if (elapsedMs >= 1000) {
    lastHeartbeat = now;
    // 只有在非答題模式（主舞台可見）時，自動攻擊才會產生視覺特效
    const arenaVisible = document.getElementById("mainArena").style.display !== "none";
    let totalDmg = getWeaponAtk();
    
    damageMonster(totalDmg, !arenaVisible, 'auto');
  }
}, 1000);

window.addEventListener("DOMContentLoaded", loadGameData);
