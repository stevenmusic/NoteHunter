/* ============================================================
   🎨 裝備 SVG ICONS（Clash Royale風）
   ============================================================ */

const ICON_WEAPON = `
<svg viewBox="0 0 64 64" width="44" height="44">
<defs>
<linearGradient id="w" x1="0" x2="1">
<stop offset="0%" stop-color="#ffd36b"/>
<stop offset="100%" stop-color="#ff7a00"/>
</linearGradient>
</defs>
<path d="M10 54 L54 10 L58 14 L14 58 Z" fill="url(#w)" stroke="#fff" stroke-width="2"/>
<circle cx="16" cy="48" r="6" fill="#222"/>
</svg>`;

const ICON_ARMOR = `
<svg viewBox="0 0 64 64" width="44" height="44">
<defs>
<linearGradient id="a" x1="0" x2="1">
<stop offset="0%" stop-color="#66e0ff"/>
<stop offset="100%" stop-color="#0066ff"/>
</linearGradient>
</defs>
<path d="M32 6 L54 16 L50 52 L32 60 L14 52 L10 16 Z"
fill="url(#a)" stroke="#fff" stroke-width="2"/>
</svg>`;

const ICON_SHIELD = `
<svg viewBox="0 0 64 64" width="44" height="44">
<defs>
<linearGradient id="s" x1="0" x2="1">
<stop offset="0%" stop-color="#aaffaa"/>
<stop offset="100%" stop-color="#00cc66"/>
</linearGradient>
</defs>
<path d="M32 6 L54 14 L50 50 L32 60 L14 50 L10 14 Z"
fill="url(#s)" stroke="#fff" stroke-width="2"/>
</svg>`;

/* ============================================================
   🎼 五線譜 SVG（原版完整保留）
   ============================================================ */

const TREBLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg"
width="36" height="150" viewBox="0 0 36 150"
style="position:absolute;left:6px;top:16px;">
<path fill="#1a1a1a" d="
M18,4 C20,4 24,8 24,14
C24,22 20,30 16,38
C22,34 28,36 30,42
C33,50 30,60 24,64
C20,67 15,68 12,66
C8,64 6,60 6,55
C6,48 10,43 16,42
C20,41 24,43 26,47
C28,51 27,57 24,60
C21,63 17,63 15,61
C13,59 13,56 15,54
C17,52 20,53 20,55
C20,57 18,58 17,57
C16,56 17,54 18,55
Z
M18,74
C18,74 18,110 18,125
C16,130 12,133 10,138
C8,142 9,146 12,147
C16,148 20,145 22,141
C24,137 23,132 20,129
C19,127 18,126 18,125
"/>
</svg>`;

const BASS_SVG = `<svg xmlns="http://www.w3.org/2000/svg"
width="48" height="60" viewBox="0 0 48 60"
style="position:absolute;left:8px;top:58px;">
<path fill="#1a1a1a" d="
M6,12 C6,12 8,2 16,2
C24,2 30,10 30,22
C30,36 22,46 10,50
C8,51 6,51 6,50
C6,49 8,49 10,48
C20,44 26,35 26,22
C26,12 21,6 16,6
C11,6 9,10 9,14
C9,18 11,20 14,20
C17,20 19,18 19,15
C19,13 17,11 15,12
C14,12 13,13 14,14
Z"/>
<circle cx="38" cy="9" r="4"/>
<circle cx="38" cy="21" r="4"/>
</svg>`;

/* ============================================================
   🎵 音符
   ============================================================ */

const WHOLE_NOTE_SVG = `
<svg width="30" height="22" viewBox="-15 -11 30 22">
<ellipse cx="0" cy="0" rx="12" ry="7.5"
fill="none" stroke="#1a1a1a" stroke-width="3.5"/>
</svg>`;

/* ============================================================
   👤 玩家資料
   ============================================================ */

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

  // 為武器新增初始等級欄位 level
  weapon: { name:"新手木劍", atkBonus:2, rarity:"common", level: 1 }, 
  armor:  { name:"布質外衣", hpBonus:10, rarity:"rare" },
  shield: { name:"破舊木盾", defBonus:1, rarity:"common" }
};

/* ============================================================
   👾 史萊姆怪物資料狀態
   ============================================================ */

let monster = {
  level: 1,
  maxHp: 50,
  currentHp: 50,
  colorIndex: 0 
};

const SLIME_COLORS = [
  "radial-gradient(circle at 35% 35%, #8cb9e6, #568ec9)", 
  "radial-gradient(circle at 35% 35%, #a5d6a7, #66bb6a)", 
  "radial-gradient(circle at 35% 35%, #ff8a80, #e53935)", 
  "radial-gradient(circle at 35% 35%, #ffb74d, #f57c00)", 
  "radial-gradient(circle at 35% 35%, #b39ddb, #5e35b1)", 
  "radial-gradient(circle at 35% 35%, #f8bbd0, #c2185b)"  
];

/* ============================================================
   🎮 遊戲狀態
   ============================================================ */

let currentNote = "";
let currentMode = "treble";
let score = 0;
let combo = 0;
let lastClickTime = 0; 

/* ============================================================
   🎯 音符資料
   ============================================================ */

const notePositions = {
  treble: [
    { note:"C", top:150 }, { note:"D", top:140 },
    { note:"E", top:130 }, { note:"F", top:120 },
    { note:"G", top:110 }, { note:"A", top:100 },
    { note:"B", top:90 },  { note:"C", top:80 },
    { note:"D", top:70 },  { note:"E", top:60 },
    { note:"F", top:50 },  { note:"G", top:40 },
    { note:"A", top:30 },  { note:"B", top:20 },
    { note:"C", top:12 }
  ],
  bass: [
    { note:"C", top:168 }, { note:"D", top:158 },
    { note:"E", top:148 }, { note:"F", top:138 },
    { note:"G", top:130 }, { note:"A", top:120 },
    { note:"B", top:110 }, { note:"C", top:100 },
    { note:"D", top:90 },  { note:"E", top:80 },
    { note:"F", top:70 },  { note:"G", top:60 },
    { note:"A", top:50 },  { note:"B", top:40 },
    { note:"C", top:30 }
  ]
};

/* ============================================================
   ⚔️ 核心戰鬥與機制控制
   ============================================================ */

function getWeaponAtk() {
  let bonus = player.weapon && player.weapon.atkBonus ? player.weapon.atkBonus : 0;
  return player.atk + bonus;
}

function damageMonster(amount) {
  monster.currentHp -= amount;
  triggerMonsterHit();
  
  if (monster.currentHp <= 0) {
    spawnNextSlime();
  }
  
  updateUI();
  updateExpUI();
  saveGameData();
}

function spawnNextSlime() {
  monster.level++;
  monster.maxHp = Math.floor(50 * Math.pow(1.25, monster.level - 1));
  monster.currentHp = monster.maxHp;
  
  monster.colorIndex = Math.floor(Math.random() * SLIME_COLORS.length);
  
  // 來源一：斬殺史萊姆獲得金幣
  player.gold += monster.level * 3;
  player.exp += 15;
  
  levelUp();
  applySlimeColor(); 
}

function applySlimeColor() {
  const color = SLIME_COLORS[monster.colorIndex] || SLIME_COLORS[0];
  const homeMonster = document.getElementById('homeMonster');
  const gameMonster = document.getElementById('gameMonster');
  if(homeMonster) homeMonster.style.background = color;
  if(gameMonster) gameMonster.style.background = color;
}

/* ============================================================
   💰 武器升級系統邏輯
   ============================================================ */

function upgradeWeapon() {
  // 確保武器內有等級與加成欄位
  if (!player.weapon.level) player.weapon.level = 1;
  
  // 動態公式：升級花費 = 當前等級 * 20 金幣
  let cost = player.weapon.level * 20;
  
  if (player.gold >= cost) {
    player.gold -= cost;          // 扣除金幣
    player.weapon.level++;        // 武器等級提升
    player.weapon.atkBonus += 4;  // 每次升級永久 +4 武器攻擊力 bonus
    
    // 即時重繪與儲存
    updateCharacter();
    updateUI();
    saveGameData();
  } else {
    // 金幣不足時的防呆提示效果（可自由替換成網頁震動等）
    console.log("金幣不夠唷！");
  }
}

/* ============================================================
   💾 存檔
   ============================================================ */

function saveGameData(){
  localStorage.setItem("noteHunter", JSON.stringify({player, score, monster}));
}

function loadGameData(){
  const data = JSON.parse(localStorage.getItem("noteHunter"));
  if(data){
    player = data.player || player;
    score = data.score || 0;
    if(data.monster) monster = data.monster;
  }
  if(monster.currentHp === undefined || monster.currentHp <= 0) {
    monster.currentHp = monster.maxHp;
  }
  if(monster.colorIndex === undefined) monster.colorIndex = 0;
  if(!player.weapon.level) player.weapon.level = 1; // 舊存檔相容性確保

  updateUI();
  updateExpUI();
  applySlimeColor(); 
}

/* ============================================================
   📌 UI 切換
   ============================================================ */

function switchPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if(id==="characterPage") updateCharacter();
  if(id==="homePage") applySlimeColor(); 
}

/* ============================================================
   🎮 遊戲流程
   ============================================================ */

function startGame(mode){
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
  setTimeout(applySlimeColor, 50); 
}

function nextNote(){
  const pool = notePositions[currentMode];
  const q = pool[Math.floor(Math.random()*pool.length)];
  currentNote = q.note;

  const noteEl = document.getElementById("noteNote");
  if(noteEl) {
    noteEl.innerHTML = WHOLE_NOTE_SVG;
    noteEl.style.top = q.top + "px";
  }

  const clef = document.getElementById("staffClef");
  if(clef) clef.innerHTML = currentMode==="treble" ? TREBLE_SVG : BASS_SVG;
}

function answer(n){
  if(n === currentNote){
    const baseAtk = getWeaponAtk();
    score += baseAtk;
    combo++;
    
    // 來源二：答對題目也直接獲得 5 金幣！
    player.gold += 5; 
    
    damageMonster(baseAtk); 
  } else {
    combo = 0;
  }
  updateUI();
  updateExpUI();
  saveGameData();
  nextNote();
}

/* ============================================================
   📈 等級
   ============================================================ */

function levelUp(){
  if(player.exp >= player.level * player.expToNextLevel){
    player.level++;
    player.atk += 2;
    player.hp += 10;
  }
}

/* ============================================================
   🎨 UI 更新
   ============================================================ */

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
  
  if(mHpFill) {
    const hpPercent = (displayHp / monster.maxHp) * 100;
    mHpFill.style.width = hpPercent + "%";
  }
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
   🧍 角色頁（支援動態武器卡片升級按鈕）
   ============================================================ */

function card(item, icon, isWeapon = false){
  let actionHtml = `<div style="color:#ffcc00;font-weight:bold">★★★</div>`;
  
  // 如果是武器卡，注入 Clash Royale 風格的升級綠色按鈕
  if (isWeapon) {
    let currentLv = item.level || 1;
    let cost = currentLv * 20;
    
    actionHtml = `
      <button onclick="upgradeWeapon()" style="background: linear-gradient(180deg, #66bb6a 0%, #43a047 100%); border: 1px solid #2e7d32; border-bottom: 3px solid #1b5e20; color: #fff; font-size: 11px; padding: 6px 10px; border-radius: 6px; font-weight: bold; cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; min-width: 65px;">
        <span>升級</span>
        <span style="font-size: 10px; opacity: 0.9;">💰${cost}</span>
      </button>
    `;
  }

  return `
  <div class="item-card" style="display:flex;align-items:center;gap:10px;background: #fff;border: 1px solid #eeebe3;border-radius: 12px;padding: 12px;margin-bottom: 10px;box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
    <div>${icon}</div>
    <div style="flex:1">
      <div style="font-weight:800; color:#2c3e50;">
        ${item.name} 
        ${isWeapon ? `<span style="color:#43a047; font-size:13px; margin-left:4px;">Lv.${item.level || 1}</span>` : ''}
      </div>
      <div style="font-size:12px;color:#8a8a9e;margin-top:3px;">
        ${item.atkBonus ? "ATK + "+item.atkBonus:""}
        ${item.hpBonus ? "HP + "+item.hpBonus:""}
        ${item.defBonus ? "DEF + "+item.defBonus:""}
      </div>
    </div>
    <div>
      ${actionHtml}
    </div>
  </div>`;
}

function updateCharacter() {
  const currentTotalAtk = getWeaponAtk();
  document.getElementById("stats").innerHTML =
  `<div style="background:#faf9f6; padding:10px; border-radius:8px; border:1px solid #eeebe3; font-weight:bold; color:#5c8a6a; text-align:center;">
    ⚔️ 總攻擊力: ${currentTotalAtk} (基礎 ${player.atk} + 武器 ${player.weapon.atkBonus}) | 💖 HP: ${player.hp} | 🛡️ DEF: ${player.def}
  </div>`;

  // 傳入 true 標記，代表此卡片需要產生升級按鈕
  document.getElementById("weapon").innerHTML = card(player.weapon, ICON_WEAPON, true);
  document.getElementById("armor").innerHTML = card(player.armor, ICON_ARMOR, false);
  document.getElementById("shield").innerHTML = card(player.shield, ICON_SHIELD, false);
}

// 觸發打擊怪物動畫的函式
function triggerMonsterHit() {
  const homeMonster = document.getElementById('homeMonster');
  const gameMonster = document.getElementById('gameMonster');
  const homeHit = document.getElementById('homeHitEffect');
  const gameHit = document.getElementById('gameHitEffect');

  const faceMood = Math.random() > 0.5 ? 'angry' : 'crying';

  if(homeMonster) homeMonster.classList.add('damaged', faceMood);
  if(gameMonster) gameMonster.classList.add('damaged', faceMood);
  if(homeHit) homeHit.classList.add('animate');
  if(gameHit) gameHit.classList.add('animate');

  setTimeout(() => {
    if(homeMonster) homeMonster.classList.remove('damaged', 'angry', 'crying');
    if(gameMonster) gameMonster.classList.remove('damaged', 'angry', 'crying');
    if(homeHit) homeHit.classList.remove('animate');
    if(gameHit) gameHit.classList.remove('animate');
  }, 300);
}

function backHome() {
  switchPage('homePage');
}

/* ============================================================
   🕹️ 自動監聽器與掛機心跳 (Ticker)
   ============================================================ */

document.getElementById("monsterBattleBox")?.addEventListener("click", (e) => {
  e.stopPropagation(); 
  
  const now = Date.now();
  if (now - lastClickTime < 200) {
    return; 
  }
  lastClickTime = now;

  const clickDmg = getWeaponAtk() * 2;
  damageMonster(clickDmg);
});

setInterval(() => {
  const homePage = document.getElementById("homePage");
  if(homePage && homePage.classList.contains("active")) {
    damageMonster(getWeaponAtk());
  }
}, 1000);

/* ============================================================
   🚀 初始化
   ============================================================ */

loadGameData();
