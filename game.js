/* ============================================================
   👤 核心資料結構與初始化
   ============================================================ */
let player = {
  name: "雷恩", level: 1, exp: 0, expToNextLevel: 100, gold: 0,
  hp: 100, atk: 10, def: 5, critChance: 0.12, critMultiplier: 1.5,
  weapon: { name: "武者打刀", atkBonus: 2, level: 1 },
  shield: { name: "御神木盾", defBonus: 1, critBonus: 0, level: 1 }
};

let monster = { level: 1, maxHp: 50, currentHp: 50, typeIndex: 0 };

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

const QUIZ_IMAGES = ["quiz1.png", "quiz2.png", "quiz3.png"]; // 請確保圖片檔在根目錄
let score = 0, combo = 0, lastHeartbeat = Date.now();

/* ============================================================
   ⚔️ 核心戰鬥邏輯
   ============================================================ */
function damageMonster(amount, skipVisuals = false) {
  monster.currentHp -= amount;
  if (!skipVisuals) triggerMonsterHit();
  
  if (monster.currentHp <= 0) {
    executeSpawnNextMonster();
  }
  updateUI();
  updateExpUI();
  saveGameData();
}

function executeSpawnNextMonster() {
  monster.level++;
  monster.maxHp = Math.floor(50 * Math.pow(1.25, monster.level - 1));
  monster.currentHp = monster.maxHp;
  monster.typeIndex = (monster.level - 1) % YOKAI_DATABASE.length;
  player.gold += 10;
  player.exp += 15;
  levelUp();
  applyYokaiVisuals();
}

function triggerMonsterHit() {
  // 史萊姆受擊表情
  const monsters = document.querySelectorAll('.monster-slime');
  monsters.forEach(m => {
    m.classList.add('damaged');
    setTimeout(() => m.classList.remove('damaged'), 250);
  });

  // 五種角度砍痕特效
  const slash = document.createElement('div');
  const type = Math.floor(Math.random() * 5) + 1;
  slash.className = `slash-line slash-${type}`;
  slash.style.left = "50%"; slash.style.top = "50%";
  document.body.appendChild(slash);
  setTimeout(() => slash.remove(), 250);
}

/* ============================================================
   🎵 遊戲流程控制
   ============================================================ */
function nextNote() {
  const q = QUIZ_IMAGES[Math.floor(Math.random() * QUIZ_IMAGES.length)];
  const display = document.getElementById("quizDisplay");
  if (display) display.innerHTML = `<img src="${q}" style="max-width:100%; max-height:100%;">`;
}

function answer(n) {
  // 這裡假設答題邏輯為造成基礎傷害
  const dmg = Math.floor(player.atk + (player.weapon.atkBonus || 0));
  damageMonster(dmg);
  score += dmg;
  combo++;
  updateUI();
  nextNote();
}

function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  
  // 更新導覽按鈕狀態
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  if (id === 'homePage') {
    document.getElementById("navHomeBtn").classList.add("active");
    applyYokaiVisuals();
  } else if (id === 'characterPage') {
    document.getElementById("navCharBtn").classList.add("active");
  }
}

function startGame(mode) {
  switchPage('gamePage');
  nextNote();
}

function backHome() {
  switchPage('homePage');
}

/* ============================================================
   📊 UI 更新與數據管理
   ============================================================ */
function applyYokaiVisuals() {
  const yokai = YOKAI_DATABASE[monster.typeIndex];
  const homeMonster = document.getElementById('homeMonster');
  const gameMonster = document.getElementById('gameMonster');
  if (homeMonster) { homeMonster.style.background = yokai.bg; document.getElementById('homeMonsterIcon').innerText = yokai.icon; }
  if (gameMonster) { gameMonster.style.background = yokai.bg; document.getElementById('gameMonsterIcon').innerText = yokai.icon; }
  document.getElementById("monsterName").innerText = `Lv.${monster.level} ${yokai.name}`;
}

function updateUI() {
  document.getElementById("score").innerText = `戰功: ${score}`;
  document.getElementById("combo").innerText = `連擊: ${combo}`;
  const hpPercent = (monster.currentHp / monster.maxHp) * 100;
  document.getElementById("monsterHpFill").style.width = `${hpPercent}%`;
  document.getElementById("monsterHpText").innerText = `體力: ${Math.ceil(monster.currentHp)} / ${monster.maxHp}`;
}

function updateExpUI() {
  const currentMax = player.level * player.expToNextLevel;
  document.getElementById("expFill").style.width = `${(player.exp / currentMax) * 100}%`;
  document.getElementById("expText").innerText = `魂魄 ${player.exp} / ${currentMax}`;
  document.getElementById("levelText").innerText = `段位.${player.level}`;
}

function levelUp() {
  if (player.exp >= player.level * player.expToNextLevel) {
    player.exp -= player.level * player.expToNextLevel;
    player.level++; player.atk += 2;
  }
}

function saveGameData() {
  localStorage.setItem("noteHunter", JSON.stringify({ player, score, monster }));
}

function loadGameData() {
  const data = localStorage.getItem("noteHunter");
  if (data) {
    const parsed = JSON.parse(data);
    player = parsed.player; monster = parsed.monster; score = parsed.score;
  }
  updateUI(); updateExpUI(); applyYokaiVisuals();
}

/* ============================================================
   🏁 初始化執行
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  loadGameData();
  
  // 怪獸點擊事件
  const handleMonsterClick = (e) => {
    e.stopPropagation();
    damageMonster(player.atk * 2);
  };
  
  document.getElementById("monsterBattleBox")?.addEventListener("click", handleMonsterClick);
  document.getElementById("homeMonsterWrapper")?.addEventListener("click", handleMonsterClick);
  
  // 每秒離線/自動攻擊
  setInterval(() => {
    if (document.getElementById("homePage").classList.contains("active")) {
      damageMonster(player.atk, true);
    }
  }, 1000);
});
