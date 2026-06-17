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
C15,15 16,14 16,13
C15,12 14,13 14,14
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
   👤 玩家資料（不改邏輯）
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

  weapon: { name:"新手木劍", atkBonus:2, rarity:"common" },
  armor:  { name:"布質外衣", hpBonus:10, rarity:"rare" },
  shield: { name:"破舊木盾", defBonus:1, rarity:"common" }
};

/* ============================================================
   🎮 遊戲狀態
   ============================================================ */

let currentNote = "";
let currentMode = "treble";
let score = 0;
let combo = 0;

/* ============================================================
   🎯 音符資料（完整保留）
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
   💾 存檔
   ============================================================ */

function saveGameData(){
  localStorage.setItem("noteHunter", JSON.stringify({player,score}));
}

function loadGameData(){
  const data = JSON.parse(localStorage.getItem("noteHunter"));
  if(data){
    player = data.player || player;
    score = data.score || 0;
  }
  updateUI();
  updateExpUI();
}

/* ============================================================
   📌 UI 切換
   ============================================================ */

function switchPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if(id==="characterPage") updateCharacter();
}

/* ============================================================
   🎮 遊戲流程
   ============================================================ */

function startGame(mode){
  currentMode = mode;
  switchPage("gamePage");
  nextNote();
}

function nextNote(){
  const pool = notePositions[currentMode];
  const q = pool[Math.floor(Math.random()*pool.length)];
  currentNote = q.note;

  const noteEl = document.getElementById("noteNote");
  noteEl.innerHTML = WHOLE_NOTE_SVG;
  noteEl.style.top = q.top + "px";

  const clef = document.getElementById("staffClef");
  clef.innerHTML = currentMode==="treble" ? TREBLE_SVG : BASS_SVG;
}

function answer(n){
  if(n === currentNote){
    score += player.atk;
    combo++;
    player.exp += 15;
    player.gold += 3;
  } else {
    combo = 0;
  }
  levelUp();
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
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("combo").innerText = "Combo: " + combo;
  document.getElementById("goldDisplay").innerText = "💰 " + player.gold;
}

function updateExpUI(){
  const fill = document.getElementById("expFill");
  const lv = document.getElementById("levelText");
  fill.style.width = ((player.exp % 100)/100)*100 + "%";
  lv.innerText = "Lv." + player.level;
}

/* ============================================================
   🧍 角色頁（🔥Clash Royale卡片）
   ============================================================ */

function card(item, icon){
  return `
  <div class="item-card" style="display:flex;align-items:center;gap:10px;">
    <div>${icon}</div>
    <div style="flex:1">
      <div style="font-weight:800">${item.name}</div>
      <div style="font-size:12px;color:#aaa">
        ${item.atkBonus ? "ATK+"+item.atkBonus:""}
        ${item.hpBonus ? "HP+"+item.hpBonus:""}
        ${item.defBonus ? "DEF+"+item.defBonus:""}
      </div>
    </div>
    <div style="color:#ffcc00;font-weight:bold">
      ★★★
    </div>
  </div>`;
}

function updateCharacter(){
  document.getElementById("stats").innerHTML =
  `ATK ${player.atk} | HP ${player.hp} | DEF ${player.def}`;

  document.getElementById("weapon").innerHTML = card(player.weapon, ICON_WEAPON);
  document.getElementById("armor").innerHTML = card(player.armor, ICON_ARMOR);
  document.getElementById("shield").innerHTML = card(player.shield, ICON_SHIELD);
}

// 觸發打擊怪物動畫的函式
function triggerMonsterHit() {
  // 取得首頁與遊戲頁面的怪物跟特效元素
  const homeMonster = document.getElementById('homeMonster');
  const gameMonster = document.getElementById('gameMonster');
  const homeHit = document.getElementById('homeHitEffect');
  const gameHit = document.getElementById('gameHitEffect');

  // 注入受擊 class (閃紅、抖動)
  if(homeMonster) homeMonster.classList.add('damaged');
  if(gameMonster) gameMonster.classList.add('damaged');
  
  // 注入爆炸特效 class
  if(homeHit) homeHit.classList.add('animate');
  if(gameHit) gameHit.classList.add('animate');

  // 動畫結束後 (0.3秒) 自動移除 Class，以便下次能重複觸發
  setTimeout(() => {
    if(homeMonster) homeMonster.classList.remove('damaged');
    if(gameMonster) gameMonster.classList.remove('damaged');
    if(homeHit) homeHit.classList.remove('animate');
    if(gameHit) gameHit.classList.remove('animate');
  }, 300);
}
/* ============================================================
   🚀 初始化
   ============================================================ */

loadGameData();
