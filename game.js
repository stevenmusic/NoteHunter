/* ============================================================
   🎨 裝備 SVG ICONS
   ============================================================ */
const ICON_WEAPON = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="w" x1="0" x2="1"><stop offset="0%" stop-color="#bc002d"/><stop offset="100%" stop-color="#3a0007"/></linearGradient></defs><path d="M10 50 L50 10 L54 14 L14 54 Z" fill="url(#w)" stroke="#d4af37" stroke-width="2"/><path d="M8 56 L16 48" stroke="#d4af37" stroke-width="4" stroke-linecap="round"/><circle cx="8" cy="56" r="3" fill="#fff"/></svg>`;
const ICON_SHIELD = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="s" x1="0" x2="1"><stop offset="0%" stop-color="#e6c280"/><stop offset="100%" stop-color="#aa851c"/></linearGradient></defs><path d="M32 6 C45 6 54 14 54 34 C54 50 32 60 32 60 C32 60 10 50 10 34 C10 14 19 6 32 6 Z" fill="url(#s)" stroke="#1c1b1a" stroke-width="2.5"/><circle cx="32" cy="32" r="10" fill="none" stroke="#bc002d" stroke-width="3"/></svg>`;

/* ============================================================
   📥 載入音符題庫
   ============================================================ */
let questionBank = null;
try {
    if (typeof NOTE_QUESTIONS !== 'undefined' && NOTE_QUESTIONS) {
        questionBank = NOTE_QUESTIONS;
        console.log('✅ 已載入 questions.js 題庫');
    }
} catch(e) {
    console.warn('⚠️ 無法載入 questions.js');
}

if (!questionBank) {
    console.log('📝 使用內建備用題庫');
    questionBank = {
        treble: [
            { id: "t_c4", answer: "C", name: "C4", img: "assets/notes/IMG_2528.jpeg" },
            { id: "t_d4", answer: "D", name: "D4", img: "assets/notes/IMG_2529.jpeg" },
            { id: "t_e4", answer: "E", name: "E4", img: "assets/notes/IMG_2530.jpeg" },
            { id: "t_f4", answer: "F", name: "F4", img: "assets/notes/IMG_2531.jpeg" },
            { id: "t_g4", answer: "G", name: "G4", img: "assets/notes/IMG_2532.jpeg" },
            { id: "t_a4", answer: "A", name: "A4", img: "assets/notes/IMG_2533.jpeg" },
            { id: "t_b4", answer: "B", name: "B4", img: "assets/notes/IMG_2534.jpeg" },
            { id: "t_c5", answer: "C", name: "C5", img: "assets/notes/IMG_2535.jpeg" },
            { id: "t_d5", answer: "D", name: "D5", img: "assets/notes/IMG_2536.jpeg" },
            { id: "t_e5", answer: "E", name: "E5", img: "assets/notes/IMG_2537.jpeg" },
            { id: "t_f5", answer: "F", name: "F5", img: "assets/notes/IMG_2538.jpeg" },
            { id: "t_g5", answer: "G", name: "G5", img: "assets/notes/IMG_2539.jpeg" },
            { id: "t_a5", answer: "A", name: "A5", img: "assets/notes/IMG_2540.jpeg" },
            { id: "t_b5", answer: "B", name: "B5", img: "assets/notes/IMG_2541.jpeg" },
            { id: "t_c6", answer: "C", name: "C6", img: "assets/notes/IMG_2542.jpeg" }
        ],
        bass: [
            { id: "b_c2", answer: "C", name: "C2", img: "assets/notes/bass_c2.jpeg" },
            { id: "b_d2", answer: "D", name: "D2", img: "assets/notes/bass_d2.jpeg" },
            { id: "b_e2", answer: "E", name: "E2", img: "assets/notes/bass_e2.jpeg" },
            { id: "b_f2", answer: "F", name: "F2", img: "assets/notes/bass_f2.jpeg" },
            { id: "b_g2", answer: "G", name: "G2", img: "assets/notes/bass_g2.jpeg" },
            { id: "b_a2", answer: "A", name: "A2", img: "assets/notes/bass_a2.jpeg" },
            { id: "b_b2", answer: "B", name: "B2", img: "assets/notes/bass_b2.jpeg" },
            { id: "b_c3", answer: "C", name: "C3", img: "assets/notes/bass_c3.jpeg" },
            { id: "b_d3", answer: "D", name: "D3", img: "assets/notes/bass_d3.jpeg" },
            { id: "b_e3", answer: "E", name: "E3", img: "assets/notes/bass_e3.jpeg" },
            { id: "b_f3", answer: "F", name: "F3", img: "assets/notes/bass_f3.jpeg" },
            { id: "b_g3", answer: "G", name: "G3", img: "assets/notes/bass_g3.jpeg" },
            { id: "b_a3", answer: "A", name: "A3", img: "assets/notes/bass_a3.jpeg" },
            { id: "b_b3", answer: "B", name: "B3", img: "assets/notes/bass_b3.jpeg" },
            { id: "b_c4", answer: "C", name: "C4", img: "assets/notes/bass_c4.jpeg" }
        ]
    };
}

/* ============================================================
   👤 核心資料結構
   ============================================================ */
let player = {
    name: "Steven",
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    gold: 0,
    hp: 100,
    maxHp: 100,
    atk: 10,
    def: 5,
    critChance: 0.12,
    critMultiplier: 1.5,
    lives: 5,
    maxLives: 5,
    weapon: { name: "武者打刀", atkBonus: 2, level: 1 },
    shield: { name: "御神木盾", defBonus: 1, critBonus: 0, level: 1 }
};

let monster = {
    level: 1,
    maxHp: 50,
    currentHp: 50,
    typeIndex: 0
};

/* 🏮 妖怪資料庫 */
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
let currentQuestion = null;
let currentMode = "treble";
let score = 0;
let combo = 0;
let maxCombo = 0;
let monstersDefeated = 0;
let lastClickTime = 0;
let lastHeartbeat = Date.now();

/* ⏱️ 計時器 */
let timerInterval = null;
let timeLeft = 10;
const MAX_TIME = 10;

/* 🗡️ 攻擊冷卻 - 每秒最多 8 次 */
let attackCount = 0;
let attackResetTimer = null;

function resetAttackCount() {
    attackCount = 0;
}

function canAttack() {
    if (attackCount >= 8) return false;
    attackCount++;
    if (attackResetTimer) clearTimeout(attackResetTimer);
    attackResetTimer = setTimeout(resetAttackCount, 1000);
    return true;
}

/* 🎯 Combo 倍率 */
function getComboMultiplier() {
    if (combo >= 10) return 3;
    if (combo >= 5) return 2;
    if (combo >= 3) return 1.5;
    return 1;
}

/* ============================================================
   😊 史萊姆永遠微笑
   ============================================================ */
function applySlimeExpression(monsterId, expression) {
    const face = document.getElementById(monsterId + 'SlimeFace');
    if (!face) return;

    const mouth = face.querySelector('.slime-mouth');
    const leftEye = face.querySelector('.slime-eye.left');
    const rightEye = face.querySelector('.slime-eye.right');

    if (mouth) {
        mouth.className = 'slime-mouth normal';
    }
    if (leftEye) {
        leftEye.className = 'slime-eye left';
    }
    if (rightEye) {
        rightEye.className = 'slime-eye right';
    }
}

/* ============================================================
   🗡️ 五種砍痕特效
   ============================================================ */
function applySlashEffect(monsterId, slashType) {
    const slash = document.getElementById(monsterId + 'SlashEffect');
    if (!slash) return;

    slash.className = 'slash-effect';
    void slash.offsetHeight;
    
    const types = ['slash-1', 'slash-2', 'slash-3', 'slash-4', 'slash-5'];
    const type = types[slashType % types.length];
    slash.classList.add(type);
    
    setTimeout(() => {
        slash.className = 'slash-effect';
    }, 600);
}

function getRandomSlashType() {
    return Math.floor(Math.random() * 5);
}

function triggerRandomSlash() {
    const type = getRandomSlashType();
    applySlashEffect('global', type);
}

/* ============================================================
   🎨 顯示譜號與音符
   ============================================================ */
function renderClef(mode) {
    const clefEl = document.getElementById("staffClef");
    if (!clefEl) return;

    const isTreble = mode === 'treble';
    clefEl.innerHTML = `<span style="font-size:clamp(60px,10vh,80px);opacity:0.4;color:#f0e6d3;">${isTreble ? '𝄞' : '𝄢'}</span>`;
}

function renderNote(question) {
    const noteEl = document.getElementById("noteNote");
    if (!noteEl) return;

    if (question && question.img) {
        noteEl.innerHTML = `<img src="${question.img}" alt="${question.name}" style="height:clamp(40px,6vw,55px);width:auto;filter:drop-shadow(0 4px 20px rgba(255,215,0,0.15));">`;
    } else {
        noteEl.innerHTML = `<span style="font-size:clamp(32px,5vw,48px);color:#f1c40f;">🎵</span>`;
    }
}

/* ============================================================
   💾 存檔
   ============================================================ */
function saveGameData() {
    localStorage.setItem("noteHunter", JSON.stringify({
        player,
        score,
        monster,
        maxCombo,
        monstersDefeated,
        lastSavedTime: Date.now()
    }));
}

function loadGameData() {
    const data = JSON.parse(localStorage.getItem("noteHunter"));
    let offlineSeconds = 0;
    if (data) {
        player = data.player || player;
        score = data.score || 0;
        if (data.monster) monster = data.monster;
        if (data.maxCombo) maxCombo = data.maxCombo;
        if (data.monstersDefeated) monstersDefeated = data.monstersDefeated;
        if (data.lastSavedTime) offlineSeconds = Math.floor((Date.now() - data.lastSavedTime) / 1000);
    }

    if (!player.lives) player.lives = player.maxLives || 5;
    if (!player.maxLives) player.maxLives = 5;

    if (monster.currentHp === undefined || monster.currentHp <= 0) {
        monster.currentHp = monster.maxHp;
    }
    if (!player.name) player.name = "雷恩";
    if (!player.weapon.level) player.weapon.level = 1;
    if (!player.shield.level) player.shield.level = 1;
    if (player.shield.critBonus === undefined) player.shield.critBonus = 0;

    buildStaticEquipmentCards();

    updateUI();
    updateExpUI();
    applyYokaiVisuals();

    if (offlineSeconds > 3) simulateOfflineProgress(offlineSeconds);
}

function simulateOfflineProgress(seconds) {
    if (seconds > 86400) seconds = 86400;
    let dps = getWeaponAtk();
    let totalDmg = dps * seconds;

    monster.currentHp -= totalDmg;
    let slimesDefeated = 0;
    while (monster.currentHp <= 0) {
        monster.level++;
        slimesDefeated++;
        monstersDefeated += slimesDefeated;
        monster.maxHp = Math.floor(50 * Math.pow(1.25, monster.level - 1));
        monster.currentHp += monster.maxHp;
    }
    monster.typeIndex = (monster.level - 1) % YOKAI_DATABASE.length;

    let goldEarned = slimesDefeated * 10;
    player.gold += goldEarned;
    player.exp += slimesDefeated * 15;

    while (player.exp >= player.level * player.expToNextLevel) {
        levelUp(true);
    }

    updateUI();
    updateExpUI();
    applyYokaiVisuals();
    saveGameData();

    if (slimesDefeated > 0) {
        setTimeout(() => {
            alert(`💤 歸陣報告！修練期間自動祓除 ${slimesDefeated} 隻妖怪！獲得 🪙 ${goldEarned} 財貨！`);
        }, 600);
    }
}

/* ============================================================
   📌 裝備系統
   ============================================================ */
function buildStaticEquipmentCards() {
    const wpContainer = document.getElementById("weapon");
    const sdContainer = document.getElementById("shield");

    if (wpContainer) {
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

    if (sdContainer) {
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
    let cost = (player.weapon.level || 1) * 20;
    if (player.gold >= cost) {
        player.gold -= cost;
        player.weapon.level++;
        player.weapon.atkBonus = (player.weapon.atkBonus || 0) + 4;
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

    const statsEl = document.getElementById("stats");
    if (statsEl) {
        statsEl.innerHTML = `
            <div style="display:flex;justify-content:space-around;gap:8px;flex-wrap:wrap;">
                <span>⚔️ 攻擊: <span style="color:#ff6b8a;">${currentTotalAtk}</span></span>
                <span>⚡ 會心: <span style="color:#ffd700;">${currentTotalCrit}%</span></span>
                <span>💖 體力: <span style="color:#00d2ff;">${player.hp}</span></span>
            </div>`;
    }

    if (document.getElementById("wpLvlText")) document.getElementById("wpLvlText").innerText = `+${player.weapon.level}`;
    if (document.getElementById("wpPropsText")) document.getElementById("wpPropsText").innerText = `攻擊附加 + ${player.weapon.atkBonus}`;
    if (document.getElementById("wpCostText")) document.getElementById("wpCostText").innerText = `🪙${player.weapon.level * 20}`;

    if (document.getElementById("sdLvlText")) document.getElementById("sdLvlText").innerText = `+${player.shield.level}`;
    if (document.getElementById("sdPropsText")) document.getElementById("sdPropsText").innerText = `🛡️ 格擋 + ${player.shield.defBonus} | ⚡ 會心 + ${Math.round((player.shield.critBonus || 0) * 100)}%`;
    if (document.getElementById("sdCostText")) document.getElementById("sdCostText").innerText = `🪙${player.shield.level * 20}`;
}

/* ============================================================
   📱 分頁控管 + 底部導航
   ============================================================ */
function switchPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    const isHome = id === "homePage";
    const navHome = document.getElementById("navHomeBtn");
    const navChar = document.getElementById("navCharBtn");

    if (navHome) navHome.classList.toggle("active", isHome);
    if (navChar) navChar.classList.toggle("active", !isHome);

    if (id === "characterPage") updateCharacter();
    if (id === "homePage") {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        updateUI();
    }
}

function startGame(mode) {
    currentMode = mode;
    player.lives = player.maxLives;
    combo = 0;
    switchPage("gamePage");
    renderClef(mode);
    nextNote();
    startTimer();
    setTimeout(() => {
        applySlimeExpression('global', 'normal');
    }, 100);
}

/* ============================================================
   🎵 核心遊戲邏輯
   ============================================================ */
function nextNote() {
    const lookupMode = currentMode.replace('_practice', '');
    
    const pool = questionBank[lookupMode] || questionBank['treble'];
    if (!pool || pool.length === 0) {
        const defaultNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const randomNote = defaultNotes[Math.floor(Math.random() * defaultNotes.length)];
        currentNote = randomNote;
        currentQuestion = null;
        renderNote(null);
        return;
    }
    
    const q = pool[Math.floor(Math.random() * pool.length)];
    currentNote = q.answer;
    currentQuestion = q;

    renderNote(q);

    timeLeft = MAX_TIME;
    updateTimerDisplay();
}

function answer(n) {
    timeLeft = Math.min(timeLeft + 2, MAX_TIME);
    updateTimerDisplay();

    if (n === currentNote) {
        const multiplier = getComboMultiplier();
        const isCrit = Math.random() < getTotalCritChance();
        const baseAtk = getWeaponAtk();
        const finalDmg = isCrit ? Math.floor(baseAtk * player.critMultiplier * multiplier) : Math.floor(baseAtk * multiplier);

        score += Math.floor(finalDmg);
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        player.gold += Math.floor(10 * multiplier);

        damageMonster(finalDmg);

        showComboEffect();
    } else {
        combo = 0;
        loseLife();
        triggerMonsterHit();
    }
    updateUI();
    updateExpUI();
    saveGameData();
    nextNote();
}

/* ============================================================
   🔥 Combo 特效
   ============================================================ */
function showComboEffect() {
    const comboEl = document.getElementById("combo");
    if (comboEl && combo >= 3) {
        comboEl.classList.add('combo-high');
        setTimeout(() => {
            comboEl.classList.remove('combo-high');
        }, 300);
    }
}

/* ============================================================
   👹 怪物相關
   ============================================================ */
function getWeaponAtk() {
    return player.atk + (player.weapon.atkBonus || 0);
}

function getTotalCritChance() {
    return player.critChance + (player.shield.critBonus || 0);
}

function damageMonster(amount, skipVisuals = false) {
    monster.currentHp -= amount;
    if (!skipVisuals) triggerMonsterHit();

    while (monster.currentHp <= 0) {
        executeSpawnNextMonster();
    }

    updateUI();
    updateExpUI();
    saveGameData();
}

function executeSpawnNextMonster() {
    monster.level++;
    monstersDefeated++;
    monster.maxHp = Math.floor(50 * Math.pow(1.25, monster.level - 1));
    monster.currentHp = monster.maxHp;
    monster.typeIndex = (monster.level - 1) % YOKAI_DATABASE.length;

    player.gold += 10;
    player.exp += 15;

    while (player.exp >= player.level * player.expToNextLevel) {
        levelUp(true);
    }

    applyYokaiVisuals();
    setTimeout(() => {
        applySlimeExpression('global', 'normal');
    }, 50);
}

function applyYokaiVisuals() {
    const currentYokai = YOKAI_DATABASE[monster.typeIndex] || YOKAI_DATABASE[0];
    
    const globalMonster = document.getElementById('globalMonster');
    const globalIcon = document.getElementById('globalMonsterIcon');
    if (globalMonster) globalMonster.style.background = currentYokai.bg;
    if (globalIcon) globalIcon.innerText = currentYokai.icon;

    const globalName = document.getElementById('globalMonsterName');
    if (globalName) globalName.innerText = `Lv.${monster.level} ${currentYokai.name}`;
}

function levelUp(silent = false) {
    if (player.exp >= player.level * player.expToNextLevel) {
        player.exp -= (player.level * player.expToNextLevel);
        player.level++;
        player.atk += 2;
        player.hp += 10;
        player.maxHp = player.hp;

        if (!silent) {
            setTimeout(() => {
                alert(`🎉 段位晉升！你已達到 ${player.level} 段！\n攻擊力 +2，體力 +10！`);
            }, 400);
        }
    }
}

/* ============================================================
   ❤️ 生命值系統
   ============================================================ */
function loseLife() {
    player.lives--;
    if (player.lives < 0) player.lives = 0;
    updateUI();

    if (navigator.vibrate) navigator.vibrate(50);

    if (player.lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const finalScore = score;
    setTimeout(() => {
        alert(`💀 魂魄消散...\n\n🏆 最終戰功: ${finalScore}\n🔥 最高連擊: ${maxCombo}\n👹 擊敗妖怪: ${monstersDefeated}\n\n返回神社重新修煉吧！`);
    }, 300);

    player.lives = player.maxLives;
    score = 0;
    combo = 0;
    maxCombo = 0;
    monstersDefeated = 0;

    monster.currentHp = monster.maxHp;

    updateUI();
    updateExpUI();
    applyYokaiVisuals();
    saveGameData();
    backHome();
}

/* ============================================================
   ⏱️ 計時器
   ============================================================ */
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    timeLeft = MAX_TIME;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            loseLife();
            combo = 0;
            updateUI();
            triggerMonsterHit();
            nextNote();
            timeLeft = MAX_TIME;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById("timerDisplay");
    if (timerEl) {
        timerEl.textContent = `⏱️ ${timeLeft}s`;
        if (timeLeft <= 3) {
            timerEl.style.color = "#ff2a6d";
        } else if (timeLeft <= 5) {
            timerEl.style.color = "#ffd700";
        } else {
            timerEl.style.color = "#00d2ff";
        }
    }
}

/* ============================================================
   😊 史萊姆受擊動畫 + 砍痕特效
   ============================================================ */
function triggerMonsterHit() {
    const globalMonster = document.getElementById('globalMonster');
    const globalHit = document.getElementById('globalHitEffect');

    const slashType = getRandomSlashType();
    
    if (globalMonster) {
        globalMonster.classList.add('damaged');
        applySlashEffect('global', slashType);
    }
    if (globalHit) globalHit.classList.add('animate');

    setTimeout(() => {
        if (globalMonster) {
            globalMonster.classList.remove('damaged');
            const slash = document.getElementById('globalSlashEffect');
            if (slash) slash.className = 'slash-effect';
        }
        if (globalHit) globalHit.classList.remove('animate');
    }, 500);
}

/* ============================================================
   🕹️ 點擊怪獸
   ============================================================ */
function handleMonsterClick(e) {
    e.stopPropagation();
    
    if (!canAttack()) return;
    
    const now = Date.now();
    if (now - lastClickTime < 80) return;
    lastClickTime = now;

    const isCrit = Math.random() < getTotalCritChance();
    const clickDmg = isCrit ? Math.floor(getWeaponAtk() * player.critMultiplier * 2) : (getWeaponAtk() * 2);
    damageMonster(clickDmg);
}

/* ============================================================
   📊 UI 更新
   ============================================================ */
function updateUI() {
    const scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.innerText = "🏆 戰功: " + score;

    const comboEl = document.getElementById("combo");
    if (comboEl) {
        const multiplier = getComboMultiplier();
        const comboText = combo >= 3 ? `🔥 連擊: ${combo} ✖${multiplier}` : `🔥 連擊: ${combo}`;
        comboEl.innerText = comboText;
    }

    const goldEl = document.getElementById("goldDisplay");
    if (goldEl) goldEl.innerText = "🪙 " + player.gold;

    const nameEl = document.getElementById("playerName");
    if (nameEl) nameEl.innerText = "⚔️ 武者 · " + player.name;

    const livesEl = document.getElementById("livesDisplay");
    if (livesEl) {
        let hearts = "";
        for (let i = 0; i < player.maxLives; i++) {
            hearts += i < player.lives ? "❤️" : "🖤";
        }
        livesEl.innerText = hearts;
    }

    const currentYokai = YOKAI_DATABASE[monster.typeIndex] || YOKAI_DATABASE[0];
    const displayHp = Math.max(0, Math.ceil(monster.currentHp));

    const hpTexts = document.querySelectorAll('.hp-bar-text');
    hpTexts.forEach(el => {
        el.innerText = `體力: ${displayHp} / ${monster.maxHp}`;
    });

    const hpFills = document.querySelectorAll('.hp-bar-fill');
    hpFills.forEach(el => {
        el.style.width = ((displayHp / monster.maxHp) * 100) + "%";
    });

    const globalName = document.getElementById('globalMonsterName');
    if (globalName) globalName.innerText = `Lv.${monster.level} ${currentYokai.name}`;
}

function updateExpUI() {
    const fill = document.getElementById("expFill");
    const lv = document.getElementById("levelText");
    const expText = document.getElementById("expText");
    let currentLevelMaxExp = player.level * player.expToNextLevel;
    if (fill) fill.style.width = (player.exp / currentLevelMaxExp) * 100 + "%";
    if (lv) lv.innerText = "段位." + player.level;
    if (expText) expText.innerText = `魂魄 ${player.exp} / ${currentLevelMaxExp}`;
}

function backHome() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    switchPage('homePage');
}

/* ============================================================
   ⏱️ 掛機計算
   ============================================================ */
setInterval(() => {
    const now = Date.now();
    let elapsedMs = now - lastHeartbeat;
    if (elapsedMs >= 1000) {
        lastHeartbeat = now;
        const homePage = document.getElementById("homePage");
        if (homePage && homePage.classList.contains("active")) {
            let secondsPassed = Math.floor(elapsedMs / 1000);
            if (secondsPassed > 0) {
                let totalDmg = getWeaponAtk() * secondsPassed;
                damageMonster(totalDmg, secondsPassed > 3);
            }
        }
    }
}, 1000);

/* ============================================================
   🚀 初始化
   ============================================================ */
document.addEventListener("DOMContentLoaded", function() {
    const globalWrapper = document.getElementById("globalMonsterWrapper");
    if (globalWrapper) globalWrapper.addEventListener("click", handleMonsterClick);

    loadGameData();
    renderClef('treble');
    updateUI();

    applySlimeExpression('global', 'normal');

    console.log('🎮 音符獵人已啟動！(無音效版)');
});
