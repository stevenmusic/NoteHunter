/* ============================================================
   🎨 裝備 SVG ICONS（日式和風）
   ============================================================ */
const ICON_WEAPON = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="w" x1="0" x2="1"><stop offset="0%" stop-color="#bc002d"/><stop offset="100%" stop-color="#3a0007"/></linearGradient></defs><path d="M10 50 L50 10 L54 14 L14 54 Z" fill="url(#w)" stroke="#d4af37" stroke-width="2"/><path d="M8 56 L16 48" stroke="#d4af37" stroke-width="4" stroke-linecap="round"/><circle cx="8" cy="56" r="3" fill="#fff"/></svg>`;
const ICON_SHIELD = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="s" x1="0" x2="1"><stop offset="0%" stop-color="#e6c280"/><stop offset="100%" stop-color="#aa851c"/></linearGradient></defs><path d="M32 6 C45 6 54 14 54 34 C54 50 32 60 32 60 C32 60 10 50 10 34 C10 14 19 6 32 6 Z" fill="url(#s)" stroke="#1c1b1a" stroke-width="2.5"/><circle cx="32" cy="32" r="10" fill="none" stroke="#bc002d" stroke-width="3"/></svg>`;

/* ============================================================
   🎼 五線譜 SVG 結構
   ============================================================ */
const TREBLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="150" viewBox="0 0 36 150" style="position:absolute;left:6px;top:16px;"><path fill="#1a1a1a" d="M18,4 C20,4 24,8 24,14 C24,22 20,30 16,38 C22,34 28,36 30,42 C33,50 30,60 24,64 C20,67 15,68 12,66 C8,64 6,60 6,55 C6,48 10,43 16,42 C20,41 24,43 26,47 C28,51 27,57 24,60 C21,63 17,63 15,61 C13,59 13,56 15,54 C17,52 20,53 20,55 C20,57 18,58 17,57 C16,56 17,54 18,55 Z M18,74 C18,74 18,110 18,125 C16,130 12,133 10,138 C8,142 9,146 12,147 C16,148 20,145 22,141 C24,137 23,132 20,129 C19,127 18,126 18,125 "/></svg>`;
const BASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60" style="position:absolute;left:8px;top:58px;"><path fill="#1a1a1a" d="M6,12 C6,12 8,2 16,2 C24,2 30,10 30,22 C30,36 22,46 10,50 C8,51 6,51 6,50 C6,49 8,49 10,48 C20,44 26,35 26,22 C26,12 21,6 16,6 C11,6 9,10 9,14 C9,18 11,20 14,20 C17,20 19,18 19,15 C19,13 17,11 15,12 C14,12 13,13 14,14 Z"/><circle cx="38" cy="9" r="4"/><circle cx="38" cy="21" r="4"/></svg>`;
const WHOLE_NOTE_SVG = `<svg width="30" height="22" viewBox="-15 -11 30 22"><ellipse cx="0" cy="0" rx="12" ry="7.5" fill="none" stroke="#1a1a1a" stroke-width="3.5"/></svg>`;

/* ============================================================
   👤 TT2風格核心資料結構
   ============================================================ */
let player = {
  name: "雷恩", level: 1, exp: 0, expToNextLevel: 100, gold: 0,
  hp: 100, atk: 10, def: 5, critChance: 0.12, critMultiplier: 1.8,
  weapon: { name:"武者打刀", atkBonus:2, level: 1 }, 
  shield: { name:"御神木盾", defBonus:1, critBonus: 0, level: 1 }
};

let monster = { stage: 1, maxHp: 60, currentHp: 60, typeIndex: 0 };

/* 🏮 設計十種精緻日式妖怪資料庫 */
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

let currentNote = ""; 
let currentMode = "treble";
let score = 0; 
let combo = 0; 
let lastClickTime = 0; 
let lastHeartbeat = Date.now();
let totalGoldEarned = 0;

const notePositions = {
  treble: [
    { note:"C", top:150 }, { note:"D", top:140 }, { note:"E", top:130 }, { note:"F", top:120 },
    { note:"G", top:110 }, { note:"A", top:100 }, { note:"B", top:90 },  { note:"C", top:80 },
    { note:"D", top:70 },  { note:"E", top:60 },  { note:"F", top:50 },  { note:"G", top:40 },
    { note:"A", top:30 },  { note:"B", top:20 },  { note:"C", top:12 }
  ],
  bass: [
    { note:"C", top:168 }, { note:"D", top:158 }, { note:"E", top:148 }, { note:"F", top:138 },
    { note:"G", top:130 }, { note:"A", top:120 }, { note:"B", top:110 }, { note:"C", top:100 },
    { note:"D", top:90 },  { note:"E", top:80 },  { note:"F", top:70 },  { note:"G", top:60 },
    { note:"A", top:50 },  { note:"B", top:40 },  { note:"C", top:30 }
  ]
};

function getWeaponAtk() { return player.atk + (player.weapon.atkBonus || 0); }
function getTotalCritChance() { return player.critChance + (player.shield.critBonus || 0); }

function getUpgradeCost(level) {
  return Math.floor(25 * Math.pow(1.65, (level || 1) - 1));
}

function calculateDamage(isTap = false) {
  let base = getWeaponAtk();
  const isCrit = Math.random() < getTotalCritChance();
  let dmg = isCrit ? Math.floor(base * player.critMultiplier) : base;
  if (isTap) dmg = Math.floor(dmg * (1 + Math.min(combo * 0.15, 4))); // Combo 上限
  return dmg;
}

function damageMonster(amount, skipVisuals = false) {
  monster.currentHp -= amount;
  if (!skipVisuals) triggerMonsterHit();
  
  while (monster.currentHp <= 0) {
    const isBoss = monster.stage % 10 === 0;
    let goldReward = Math.floor(12 * Math.pow(1.45, monster.stage - 1));
    if (isBoss) goldReward = Math.floor(goldReward * 4.5);
    goldReward = Math.floor(goldReward * (1 + combo * 0.08));
    
    player.gold += goldReward;
    totalGoldEarned += goldReward;
    player.exp += 18 + Math.floor(monster.stage * 1.3);
    
    monster.stage++;
    monster.maxHp = Math.floor(60 * Math.pow(1.38, monster.stage - 1));
    monster.currentHp += monster.maxHp; 
    monster.typeIndex = (monster.stage - 1) % YOKAI_DATABASE.length;
    
    levelUp();
    applyYokaiVisuals(); 
  }
  
  updateUI();
  updateExpUI();
  saveGameData();
}

function executeSpawnNextMonster() {
  // 已整合到 damageMonster 中
}

function applyYokaiVisuals() {
  const currentYokai = YOKAI_DATABASE[monster.typeIndex] || YOKAI_DATABASE[0];
  if(document.getElementById('homeMonster')) document.getElementById('homeMonster').style.background = currentYokai.bg;
  if(document.getElementById('gameMonster')) document.getElementById('gameMonster').style.background = currentYokai.bg;
  if(document.getElementById('homeMonsterIcon')) document.getElementById('homeMonsterIcon').innerText = currentYokai.icon;
  if(document.getElementById('gameMonsterIcon')) document.getElementById('gameMonsterIcon').innerText = currentYokai.icon;
}

/* ============================================================
   💾 存檔與離線模擬
   ============================================================ */
function saveGameData(){
  localStorage.setItem("noteHunter", JSON.stringify({ 
    player, score, monster, totalGoldEarned, lastSavedTime: Date.now() 
  }));
}

function loadGameData(){
  const data = JSON.parse(localStorage.getItem("noteHunter") || "{}");
  let offlineSeconds = 0;
  if(data){
    player = data.player || player; 
    score = data.score || 0; 
    if(data.monster) monster = data.monster;
    totalGoldEarned = data.totalGoldEarned || 0;
    if (data.lastSavedTime) offlineSeconds = Math.floor((Date.now() - data.lastSavedTime) / 1000);
  }
  if(monster.currentHp === undefined || monster.currentHp <= 0) monster.currentHp = monster.maxHp;
  if(!player.name) player.name = "雷恩";
  if(!player.weapon.level) player.weapon.level = 1; 
  if(!player.shield.level) player.shield.level = 1;
  if(player.shield.critBonus === undefined) player.shield.critBonus = 0;

  buildStaticEquipmentCards();
  updateUI();
  updateExpUI();
  applyYokaiVisuals(); 
  if (offlineSeconds > 3) simulateOfflineProgress(offlineSeconds);
}

function simulateOfflineProgress(seconds) {
  if (seconds > 86400) seconds = 86400; 
  let dps = getWeaponAtk() * 1.5;
  let totalDmg = dps * seconds;
  
  monster.currentHp -= totalDmg;
  let slimesDefeated = 0;
  while (monster.currentHp <= 0) {
    slimesDefeated++;
    monster.stage++;
    monster.maxHp = Math.floor(60 * Math.pow(1.38, monster.stage - 1));
    monster.currentHp += monster.maxHp;
  }
  monster.typeIndex = (monster.stage - 1) % YOKAI_DATABASE.length;
  
  let goldEarned = Math.floor(slimesDefeated * 15 * Math.pow(1.3, monster.stage/10));
  player.gold += goldEarned;
  player.exp += slimesDefeated * 18;
  
  while (player.exp >= player.level * player.expToNextLevel) { levelUp(); }
  
  updateUI(); updateExpUI(); applyYokaiVisuals(); saveGameData();
  setTimeout(() => { alert(`💤 歸陣報告！修練期間自動祓除 ${slimesDefeated} 隻妖怪！獲得 🪙 ${goldEarned} 財貨！`); }, 600);
}

/* ============================================================
   📌 靜態裝備欄生成
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
          <span>強化</span><span id="wpCostText" style="font-size:11px; opacity:0.9;"></span>
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
          <span>鍛造</span><span id="sdCostText" style="font-size:11px; opacity:0.9;"></span>
        </button>
      </div>`;
  }
  updateCharacter();
}

function upgradeWeapon() {
  let cost = getUpgradeCost(player.weapon.level);
  if (player.gold >= cost) {
    player.gold -= cost;          
    player.weapon.level++;        
    player.weapon.atkBonus += 5;  
    updateCharacter();
    updateUI();
    saveGameData();
  } else {
    alert("🪙 金幣不足！");
  }
}

function upgradeShield() {
  let cost = getUpgradeCost(player.shield.level);
  if (player.gold >= cost) {
    player.gold -= cost;
    player.shield.level++;
    player.shield.critBonus = (player.shield.critBonus || 0) + 0.045;
    updateCharacter();
    updateUI();
    saveGameData();
  } else {
    alert("🪙 金幣不足！");
  }
}

function updateCharacter() {
  const currentTotalAtk = getWeaponAtk();
  const currentTotalCrit = Math.round(getTotalCritChance() * 100);
  
  const statsEl = document.getElementById("stats");
  if(statsEl) {
    statsEl.innerHTML = `
      <div style="background:#f5eedf; padding:10px; border-radius:4px; border:2px solid #d4af37; font-weight:bold; color:#1c1b1a; text-align:center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); margin-bottom:12px; font-size:13px;">
        ⚔️ 總攻擊力: <span style="color:#bc002d">${currentTotalAtk}</span> | ⚡ 會心率: <span style="color:#203b2e">${currentTotalCrit}%</span> | 💖 體力: ${player.hp} | 🌟 Stage: ${monster.stage}
      </div>`;
  }

  if(document.getElementById("wpLvlText")) document.getElementById("wpLvlText").innerText = `+${player.weapon.level}`;
  if(document.getElementById("wpPropsText")) document.getElementById("wpPropsText").innerText = `攻擊附加 + ${player.weapon.atkBonus}`;
  if(document.getElementById("wpCostText")) document.getElementById("wpCostText").innerText = `🪙${getUpgradeCost(player.weapon.level)}`;

  if(document.getElementById("sdLvlText")) document.getElementById("sdLvlText").innerText = `+${player.shield.level}`;
  if(document.getElementById("sdPropsText")) document.getElementById("sdPropsText").innerText = `🛡️ 格擋 + ${player.shield.defBonus} | ⚡ 會心潛能 + ${Math.round((player.shield.critBonus || 0)*100)}%`;
  if(document.getElementById("sdCostText")) document.getElementById("sdCostText").innerText = `🪙${getUpgradeCost(player.shield.level)}`;
}

/* ============================================================
   🎵 分頁控管與連動狀態
   ============================================================ */
function switchPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  
  const isHome = id === "homePage";
  document.getElementById("navHomeBtn").classList.toggle("active", isHome);
  document.getElementById("navCharBtn").classList.toggle("active", !isHome);
  document.getElementById("navHomeBtnChar").classList.toggle("active", isHome);
  document.getElementById("navCharBtnChar").classList.toggle("active", !isHome);

  if(id==="characterPage") updateCharacter();
  if(id==="homePage") applyYokaiVisuals(); 
}

function startGame(mode){
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
  setTimeout(applyYokaiVisuals, 50); 
}

function nextNote(){
  const lookupMode = currentMode.replace('_practice', '');
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
    combo++;
    const dmg = calculateDamage(true);
    score += dmg;
    player.gold += 18; 
    damageMonster(dmg); 
  } else {
    combo = Math.max(0, combo - 3);
  }
  updateUI(); updateExpUI(); saveGameData(); nextNote();
}

function levelUp(){
  while(player.exp >= player.level * player.expToNextLevel){
    player.exp -= (player.level * player.expToNextLevel);
    player.level++; 
    player.atk += 3; 
    player.hp += 12;
    player.critChance += 0.008;
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
  if(mName) mName.innerText = `Stage.${monster.stage} ${currentYokai.name}`;
  
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

function triggerMonsterHit() {
  const hMonster = document.getElementById('homeMonster');
  const gMonster = document.getElementById('gameMonster');
  const hHit = document.getElementById('homeHitEffect');
  const gHit = document.getElementById('gameHitEffect');
  
  const faceMood = Math.random() > 0.5 ? 'angry' : 'crying';

  if(hMonster) hMonster.classList.add('damaged', faceMood);
  if(gMonster) gMonster.classList.add('damaged', faceMood);
  if(hHit) hHit.classList.add('animate');
  if(gHit) gHit.classList.add('animate');

  setTimeout(() => {
    if(hMonster) hMonster.classList.remove('damaged', 'angry', 'crying');
    if(gMonster) gMonster.classList.remove('damaged', 'angry', 'crying');
    if(hHit) hHit.classList.remove('animate');
    if(gHit) gHit.classList.remove('animate');
  }, 250);
}

function backHome() { switchPage('homePage'); }

/* ============================================================
   🕹️ 點擊怪獸處理
   ============================================================ */
function handleMonsterClick(e) {
  e.stopPropagation(); 
  const now = Date.now();
  if (now - lastClickTime < 200) return; 
  lastClickTime = now;
  
  const dmg = calculateDamage(true);
  damageMonster(dmg);
}

document.getElementById("monsterBattleBox")?.addEventListener("click", handleMonsterClick);
document.getElementById("homeMonsterWrapper")?.addEventListener("click", handleMonsterClick);

/* 每秒鐘安全掛機計算 */
setInterval(() => {
  const now = Date.now(); 
  let elapsedMs = now - lastHeartbeat;
  if (elapsedMs >= 1000) {
    lastHeartbeat = now;
    const homePage = document.getElementById("homePage");
    if(homePage && homePage.classList.contains("active")) {
      let secondsPassed = Math.floor(elapsedMs / 1000);
      if(secondsPassed > 0) {
        let totalDmg = getWeaponAtk() * 1.6 * secondsPassed;
        damageMonster(totalDmg, secondsPassed > 3);
      }
    }
  }
}, 1000);

// 確保全部 DOM 載入完成後安全運行初始化
window.addEventListener("DOMContentLoaded", () => {
  loadGameData();
});
