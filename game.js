/* ============================================================
   🎨 裝備 SVG ICONS（Clash Royale風）
   ============================================================ */

const ICON_WEAPON = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="w" x1="0" x2="1"><stop offset="0%" stop-color="#ffd36b"/><stop offset="100%" stop-color="#ff7a00"/></linearGradient></defs><path d="M10 54 L54 10 L58 14 L14 58 Z" fill="url(#w)" stroke="#fff" stroke-width="2"/><circle cx="16" cy="48" r="6" fill="#222"/></svg>`;
const ICON_ARMOR = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="a" x1="0" x2="1"><stop offset="0%" stop-color="#66e0ff"/><stop offset="100%" stop-color="#0066ff"/></linearGradient></defs><path d="M32 6 L54 16 L50 52 L32 60 L14 52 L10 16 Z" fill="url(#a)" stroke="#fff" stroke-width="2"/></svg>`;
const ICON_SHIELD = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="s" x1="0" x2="1"><stop offset="0%" stop-color="#aaffaa"/><stop offset="100%" stop-color="#00cc66"/></linearGradient></defs><path d="M32 6 L54 14 L50 50 L32 60 L14 50 L10 14 Z" fill="url(#s)" stroke="#fff" stroke-width="2"/></svg>`;

/* ============================================================
   🎼 五線譜 SVG（原版完整保留）
   ============================================================ */
const TREBLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="150" viewBox="0 0 36 150" style="position:absolute;left:6px;top:16px;"><path fill="#1a1a1a" d="M18,4 C20,4 24,8 24,14 C24,22 20,30 16,38 C22,34 28,36 30,42 C33,50 30,60 24,64 C20,67 15,68 12,66 C8,64 6,60 6,55 C6,48 10,43 16,42 C20,41 24,43 26,47 C28,51 27,57 24,60 C21,63 17,63 15,61 C13,59 13,56 15,54 C17,52 20,53 20,55 C20,57 18,58 17,57 C16,56 17,54 18,55 Z M18,74 C18,74 18,110 18,125 C16,130 12,133 10,138 C8,142 9,146 12,147 C16,148 20,145 22,141 C24,137 23,132 20,129 C19,127 18,126 18,125 "/></svg>`;
const BASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60" style="position:absolute;left:8px;top:58px;"><path fill="#1a1a1a" d="M6,12 C6,12 8,2 16,2 C24,2 30,10 30,22 C30,36 22,46 10,50 C8,51 6,51 6,50 C6,49 8,49 10,48 C20,44 26,35 26,22 C26,12 21,6 16,6 C11,6 9,10 9,14 C9,18 11,20 14,20 C17,20 19,18 19,15 C19,13 17,11 15,12 C14,12 13,13 14,14 Z"/><circle cx="38" cy="9" r="4"/><circle cx="38" cy="21" r="4"/></svg>`;
const WHOLE_NOTE_SVG = `<svg width="30" height="22" viewBox="-15 -11 30 22"><ellipse cx="0" cy="0" rx="12" ry="7.5" fill="none" stroke="#1a1a1a" stroke-width="3.5"/></svg>`;

/* ============================================================
   👤 核心資料結構
   ============================================================ */
let player = {
  level: 1, exp: 0, expToNextLevel: 100, gold: 0,
  hp: 100, atk: 10, def: 5, critChance: 0.12, critMultiplier: 1.5,
  weapon: { name:"新手木劍", atkBonus:2, rarity:"common", level: 1 }, 
  armor:  { name:"布質外衣", hpBonus:10, rarity:"rare" },
  shield: { name:"破舊木盾", defBonus:1, critBonus: 0, rarity:"common", level: 1 }
};

let monster = { level: 1, maxHp: 50, currentHp: 50, colorIndex: 0 };

const SLIME_COLORS = [
  "radial-gradient(circle at 35% 35%, #7fbdff, #3a86ff)", 
  "radial-gradient(circle at 35% 35%, #a2f0b7, #06d6a0)", 
  "radial-gradient(circle at 35% 35%, #ff9ebb, #ff5a79)", 
  "radial-gradient(circle at 35% 35%, #ffd166, #ff9f1c)", 
  "radial-gradient(circle at 35% 35%, #cc99ff, #8338ec)", 
  "radial-gradient(circle at 35% 35%, #ffaa80, #e65c00)"
];

let currentNote = "";
let currentMode = "treble";
let score = 0; let combo = 0; let lastClickTime = 0; let lastHeartbeat = Date.now();

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
    { note:"D", top:90 },  { note:"E", top:80 },  { note:"F", top:70 },  { note:"G", stroke:60, top:60 },
    { note:"A", top:50 },  { note:"B", top:40 },  { note:"C", top:30 }
  ]
};

/* ============================================================
   ⚔️ 戰鬥、金幣與爆擊判定
   ============================================================ */
function getWeaponAtk() { return player.atk + (player.weapon.atkBonus || 0); }
function getTotalCritChance() { return player.critChance + (player.shield.critBonus || 0); }

function damageMonster(amount, skipVisuals = false) {
  monster.currentHp -= amount;
  if (!skipVisuals) triggerMonsterHit();
  if (monster.currentHp <= 0) spawnNextSlime();
  updateUI();
  updateExpUI();
  saveGameData();
}

function spawnNextSlime() {
  monster.level++;
  monster.maxHp = Math.floor(50 * Math.pow(1.25, monster.level - 1));
  monster.currentHp = monster.maxHp;
  monster.colorIndex = Math.floor(Math.random() * SLIME_COLORS.length);
  
  player.gold += 10; // ⚡ 擊殺獲得 10 金幣
  player.exp += 15;
  
  levelUp();
  applySlimeColor(); 
}

function applySlimeColor() {
  const color = SLIME_COLORS[monster.colorIndex] || SLIME_COLORS[0];
  if(document.getElementById('homeMonster')) document.getElementById('homeMonster').style.background = color;
  if(document.getElementById('gameMonster')) document.getElementById('gameMonster').style.background = color;
}

/* ============================================================
   💾 存檔與離線模擬
   ============================================================ */
function saveGameData(){
  localStorage.setItem("noteHunter", JSON.stringify({ player, score, monster, lastSavedTime: Date.now() }));
}

function loadGameData(){
  const data = JSON.parse(localStorage.getItem("noteHunter"));
  let offlineSeconds = 0;
  if(data){
    player = data.player || player; score = data.score || 0; if(data.monster) monster = data.monster;
    if (data.lastSavedTime) offlineSeconds = Math.floor((Date.now() - data.lastSavedTime) / 1000);
  }
  if(monster.currentHp === undefined || monster.currentHp <= 0) monster.currentHp = monster.maxHp;
  if(!player.weapon.level) player.weapon.level = 1; 
  if(!player.shield.level) player.shield.level = 1;
  if(player.shield.critBonus === undefined) player.shield.critBonus = 0;

  // 預先在頁面渲染裝備骨架卡片（僅執行一次）
  buildStaticEquipmentCards();
  
  updateUI();
  updateExpUI();
  applySlimeColor(); 
  if (offlineSeconds > 3) simulateOfflineProgress(offlineSeconds);
}

function simulateOfflineProgress(seconds) {
  if (seconds > 86400) seconds = 86400; 
  let dps = getWeaponAtk(); let slimesDefeated = 0; let goldEarned = 0;
  while (seconds > 0) {
    let hpLeft = monster.currentHp;
    let secondsToKill = Math.ceil(hpLeft / dps);
    if (seconds >= secondsToKill) {
      seconds -= secondsToKill; slimesDefeated++; monster.level++;
      goldEarned += 10; monster.maxHp = Math.floor(50 * Math.pow(1.25, monster.level - 1));
      monster.currentHp = monster.maxHp;
    } else {
      monster.currentHp -= (seconds * dps); seconds = 0;
    }
  }
  player.gold += goldEarned;
  while (player.exp >= player.level * player.expToNextLevel) { levelUp(); }
  updateUI(); updateExpUI(); applySlimeColor(); saveGameData();
  setTimeout(() => { alert(`💤 歡迎回來！自動擊殺了 ${slimesDefeated} 隻史萊姆！獲得 💰 ${goldEarned} 金幣！`); }, 600);
}

/* ============================================================
   📌 核心：防縮放、不重建 DOM 的無感升級機制
   ============================================================ */
function buildStaticEquipmentCards() {
  // 初始化渲染一次卡牌結構
  document.getElementById("weapon").innerHTML = `
    <div class="item-card">
      <div>${ICON_WEAPON}</div>
      <div style="flex:1">
        <div class="card-title">${player.weapon.name} <span id="wpLvlText" class="card-lv"></span></div>
        <div id="wpPropsText" class="card-props"></div>
      </div>
      <button onclick="upgradeWeapon()" class="up-btn up-btn-weapon">
        <span>升級</span><span id="wpCostText" style="font-size:11px; opacity:0.9;"></span>
      </button>
    </div>`;

  document.getElementById("armor").innerHTML = `
    <div class="item-card">
      <div>${ICON_ARMOR}</div>
      <div style="flex:1">
        <div class="card-title">${player.armor.name}</div>
        <div class="card-props">HP + ${player.armor.hpBonus}</div>
      </div>
      <div style="color:#ffcc00;font-weight:bold;padding-right:15px;">★★★</div>
    </div>`;

  document.getElementById("shield").innerHTML = `
    <div class="item-card">
      <div>${ICON_SHIELD}</div>
      <div style="flex:1">
        <div class="card-title">${player.shield.name} <span id="sdLvlText" class="card-lv"></span></div>
        <div id="sdPropsText" class="card-props"></div>
      </div>
      <button onclick="upgradeShield()" class="up-btn up-btn-shadow up-btn-shield">
        <span>升級</span><span id="sdCostText" style="font-size:11px; opacity:0.9;"></span>
      </button>
    </div>`;
}

function upgradeWeapon() {
  let cost = (player.weapon.level || 1) * 20;
  if (player.gold >= cost) {
    player.gold -= cost;          
    player.weapon.level++;        
    player.weapon.atkBonus = (player.weapon.atkBonus || 0) + 4;  
    
    // 💡 局部重新整理數值，不刷新按鈕 DOM，杜絕縮放與不響應問題
    updateCharacter();
    updateUI();
    saveGameData();
  }
}

function upgradeShield() {
  let cost = (player.shield.level || 1) * 20;
  if (player.gold >= cost) {
    player.gold -= cost;
    player.shield.level++;
    player.shield.critBonus = (player.shield.critBonus || 0) + 0.03;
    
    updateCharacter();
    updateUI();
    saveGameData();
  }
}

function updateCharacter() {
  const currentTotalAtk = getWeaponAtk();
  const currentTotalCrit = Math.round(getTotalCritChance() * 100);
  
  // 更新頂部總狀態面板
  const statsEl = document.getElementById("stats");
  if(statsEl) {
    statsEl.innerHTML = `
      <div style="background:rgba(255,255,255,0.9); padding:10px; border-radius:10px; border:2px solid #cbd7e3; font-weight:bold; color:#1e2530; text-align:center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom:10px; font-size:13px;">
        ⚔️ 總攻擊力: <span style="color:#ff2a6d">${currentTotalAtk}</span> | ⚡ 總爆擊率: <span style="color:#0066ff">${currentTotalCrit}%</span> | 💖 HP: ${player.hp}
      </div>`;
  }

  // 精準修改內部核心文字節點，絕不破壞點擊中的 Button 焦點
  if(document.getElementById("wpLvlText")) document.getElementById("wpLvlText").innerText = `Lv.${player.weapon.level}`;
  if(document.getElementById("wpPropsText")) document.getElementById("wpPropsText").innerText = `ATK + ${player.weapon.atkBonus}`;
  if(document.getElementById("wpCostText")) document.getElementById("wpCostText").innerText = `💰${player.weapon.level * 20}`;

  if(document.getElementById("sdLvlText")) document.getElementById("sdLvlText").innerText = `Lv.${player.shield.level}`;
  if(document.getElementById("sdPropsText")) document.getElementById("sdPropsText").innerText = `🛡️ DEF + ${player.shield.defBonus} | ⚡ 爆擊率 + ${Math.round((player.shield.critBonus || 0)*100)}%`;
  if(document.getElementById("sdCostText")) document.getElementById("sdCostText").innerText = `💰${player.shield.level * 20}`;
}

/* ============================================================
   🎵 核心玩流程與分頁控管
   ============================================================ */
function switchPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if(id==="characterPage") updateCharacter();
  if(id==="homePage") applySlimeColor(); 
}

function startGame(mode){
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
  setTimeout(applySlimeColor, 50); 
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
    const isCrit = Math.random() < getTotalCritChance();
    const baseAtk = getWeaponAtk();
    const finalDmg = isCrit ? Math.floor(baseAtk * player.critMultiplier) : baseAtk;

    score += finalDmg;
    combo++;
    player.gold += 20; // ⚡ 答題獲得 20 金幣
    
    if (!currentMode.includes('_practice')) {
      damageMonster(finalDmg); 
    } else {
      triggerMonsterHit(); 
    }
  } else {
    combo = 0;
  }
  updateUI(); updateExpUI(); saveGameData(); nextNote();
}

function levelUp(){
  if(player.exp >= player.level * player.expToNextLevel){
    player.exp -= (player.level * player.expToNextLevel);
    player.level++; player.atk += 2; player.hp += 10;
  }
}

function updateUI(){
  if(document.getElementById("score")) document.getElementById("score").innerText = "Score: " + score;
  if(document.getElementById("combo")) document.getElementById("combo").innerText = "Combo: " + combo;
  if(document.getElementById("goldDisplay")) document.getElementById("goldDisplay").innerText = "💰 " + player.gold;
  
  const mName = document.getElementById("monsterName");
  const mHpText = document.getElementById("monsterHpText");
  const mHpFill = document.getElementById("monsterHpFill");
  
  if(mName) mName.innerText = `Lv.${monster.level} 史萊姆`;
  const displayHp = Math.max(0, Math.ceil(monster.currentHp));
  if(mHpText) mHpText.innerText = `HP: ${displayHp} / ${monster.maxHp}`;
  if(mHpFill) mHpFill.style.width = ((displayHp / monster.maxHp) * 100) + "%";
}

function updateExpUI(){
  const fill = document.getElementById("expFill");
  const lv = document.getElementById("levelText");
  const expText = document.getElementById("expText");
  let currentLevelMaxExp = player.level * player.expToNextLevel;
  if(fill) fill.style.width = (player.exp / currentLevelMaxExp) * 100 + "%";
  if(lv) lv.innerText = "Lv." + player.level;
  if(expText) expText.innerText = `EXP ${player.exp} / ${currentLevelMaxExp}`;
}

/* ============================================================
   🎭 表情切換控制邏輯
   ============================================================ */
function triggerMonsterHit() {
  const hMonster = document.getElementById('homeMonster');
  const gMonster = document.getElementById('gameMonster');
  const hHit = document.getElementById('homeHitEffect');
  const gHit = document.getElementById('gameHitEffect');
  
  // 隨機抽選生氣(angry) 或 哭哭(crying) 面部樣式
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
  }, 280);
}

function backHome() { switchPage('homePage'); }

/* ============================================================
   🕹️ 監聽器與背景心跳
   ============================================================ */
document.getElementById("monsterBattleBox")?.addEventListener("click", (e) => {
  e.stopPropagation(); 
  const now = Date.now();
  if (now - lastClickTime < 200) return; 
  lastClickTime = now;
  const isCrit = Math.random() < getTotalCritChance();
  const clickDmg = isCrit ? Math.floor(getWeaponAtk() * player.critMultiplier * 2) : getWeaponAtk() * 2;
  damageMonster(clickDmg);
});

setInterval(() => {
  const now = Date.now(); let elapsedMs = now - lastHeartbeat;
  if (elapsedMs >= 1000) {
    lastHeartbeat = now;
    const homePage = document.getElementById("homePage");
    if(homePage && homePage.classList.contains("active")) {
      let secondsPassed = Math.floor(elapsedMs / 1000);
      for (let i = 0; i < secondsPassed; i++) { damageMonster(getWeaponAtk(), secondsPassed > 5); }
    }
  }
}, 1000);

loadGameData();
