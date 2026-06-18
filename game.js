/* ============================================================
   🎨 裝備 SVG ICONS
   ============================================================ */
const ICON_WEAPON = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="w" x1="0" x2="1"><stop offset="0%" stop-color="#bc002d"/><stop offset="100%" stop-color="#3a0007"/></linearGradient></defs><path d="M10 50 L50 10 L54 14 L14 54 Z" fill="url(#w)" stroke="#d4af37" stroke-width="2"/><path d="M8 56 L16 48" stroke="#d4af37" stroke-width="4" stroke-linecap="round"/><circle cx="8" cy="56" r="3" fill="#fff"/></svg>`;
const ICON_SHIELD = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="s" x1="0" x2="1"><stop offset="0%" stop-color="#e6c280"/><stop offset="100%" stop-color="#aa851c"/></linearGradient></defs><path d="M32 6 C45 6 54 14 54 34 C54 50 32 60 32 60 C32 60 10 50 10 34 C10 14 19 6 32 6 Z" fill="url(#s)" stroke="#1c1b1a" stroke-width="2.5"/><circle cx="32" cy="32" r="10" fill="none" stroke="#bc002d" stroke-width="3"/></svg>`;

/* ============================================================
   🎵 音符位置
   ============================================================ */
const notePositions = {
    treble: [
        { note: "C", top: 150 }, { note: "D", top: 140 }, { note: "E", top: 130 },
        { note: "F", top: 120 }, { note: "G", top: 110 }, { note: "A", top: 100 },
        { note: "B", top: 90 }, { note: "C", top: 80 }, { note: "D", top: 70 },
        { note: "E", top: 60 }, { note: "F", top: 50 }, { note: "G", top: 40 },
        { note: "A", top: 30 }, { note: "B", top: 20 }, { note: "C", top: 12 }
    ],
    bass: [
        { note: "C", top: 168 }, { note: "D", top: 158 }, { note: "E", top: 148 },
        { note: "F", top: 138 }, { note: "G", top: 130 }, { note: "A", top: 120 },
        { note: "B", top: 110 }, { note: "C", top: 100 }, { note: "D", top: 90 },
        { note: "E", top: 80 }, { note: "F", top: 70 }, { note: "G", top: 60 },
        { note: "A", top: 50 }, { note: "B", top: 40 }, { note: "C", top: 30 }
    ]
};

/* ============================================================
   🎯 音效引擎
   ============================================================ */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioCtx();
    }
}

function playTone(frequency, duration = 0.15, type = 'sine', volume = 0.25) {
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) { /* 靜默處理 */ }
}

function playCorrectSound() {
    playTone(523.25, 0.1, 'sine', 0.25);
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.25), 100);
    setTimeout(() => playTone(783.99, 0.15, 'sine', 0.25), 200);
}

function playWrongSound() {
    playTone(200, 0.3, 'sawtooth', 0.15);
}

function playComboSound(comboCount) {
    if (comboCount >= 10) playTone(880, 0.1, 'square', 0.15);
    else if (comboCount >= 5) playTone(659.25, 0.1, 'square', 0.15);
}

function playDefeatSound() {
    playTone(523.25, 0.15, 'sine', 0.2);
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.2), 150);
    setTimeout(() => playTone(783.99, 0.2, 'sine', 0.2), 300);
}

function playLevelUpSound() {
    playTone(523.25, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.2), 100);
    setTimeout(() => playTone(783.99, 0.1, 'sine', 0.2), 200);
    setTimeout(() => playTone(1046.5, 0.2, 'sine', 0.2), 300);
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
    // 重置計時器
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
   😊 史萊姆表情（全域版 - 修正定位）
   ============================================================ */
const SLIME_EXPRESSIONS = ['normal', 'happy', 'surprised', 'angry', 'crying'];

function getRandomExpression() {
    return SLIME_EXPRESSIONS[Math.floor(Math.random() * SLIME_EXPRESSIONS.length)];
}

function applySlimeExpression(monsterId, expression) {
    // 支援 home、game、global
    const face = document.getElementById(monsterId + 'SlimeFace');
    if (!face) return;

    const mouth = face.querySelector('.slime-mouth');
    const leftEye = face.querySelector('.slime-eye.left');
    const rightEye = face.querySelector('.slime-eye.right');

    if (mouth) {
        mouth.className = 'slime-mouth';
        mouth.classList.add(expression);
    }

    if (leftEye) {
        leftEye.className = 'slime-eye left';
        if (expression === 'happy') leftEye.classList.add('happy');
        else if (expression === 'surprised') leftEye.classList.add('surprised');
        else if (expression === 'angry') leftEye.classList.add('angry');
        else if (expression === 'crying') leftEye.classList.add('crying');
    }

    if (rightEye) {
        rightEye.className = 'slime-eye right';
        if (expression === 'happy') rightEye.classList.add('happy');
        else if (expression === 'surprised') rightEye.classList.add('surprised');
        else if (expression === 'angry') rightEye.classList.add('angry');
        else if (expression === 'crying') rightEye.classList.add('crying');
    }
}

/* ============================================================
   🗡️ 五種角度/力度的砍痕
   ============================================================ */
const SLASH_STYLES = [
    { id: 'slash1', label: '輕斬', rotation: -25, scale: 0.7, color: '#ff6b8a', duration: 0.3, icon: '⚡' },
    { id: 'slash2', label: '斜劈', rotation: 15, scale: 1.0, color: '#ff2a6d', duration: 0.35, icon: '🗡️' },
    { id: 'slash3', label: '重斬', rotation: -45, scale: 1.3, color: '#ff0055', duration: 0.4, icon: '⚔️' },
    { id: 'slash4', label: '逆襲', rotation: 60, scale: 1.1, color: '#ff4488', duration: 0.3, icon: '💥' },
    { id: 'slash5', label: '絕殺', rotation: -70, scale: 1.5, color: '#ff0044', duration: 0.45, icon: '🌟' }
];

function getRandomSlash() {
    return SLASH_STYLES[Math.floor(Math.random() * SLASH_STYLES.length)];
}

function applySlashEffect(monsterId, slashStyle) {
    const slash = document.getElementById(monsterId + 'SlashEffect');
    if (!slash) return;

    slash.className = 'slash-effect active';
    slash.style.setProperty('--slash-rotation', slashStyle.rotation + 'deg');
    slash.style.setProperty('--slash-scale', slashStyle.scale);
    slash.style.setProperty('--slash-color', slashStyle.color);
    slash.style.setProperty('--slash-duration', slashStyle.duration + 's');

    slash.textContent = slashStyle.icon;

    slash.style.animation = 'none';
    void slash.offsetHeight;
    slash.style.animation = `slashAnim ${slashStyle.duration}s ease-out forwards`;

    setTimeout(() => {
        slash.classList.remove('active');
        slash.style.animation = '';
        slash.textContent = '';
    }, slashStyle.duration * 1000 + 100);
}

/* ============================================================
   🎨 顯示譜號（使用圖片）
   ============================================================ */
function renderClef(mode) {
    const clefEl = document.getElementById("staffClef");
    if (!clefEl) return;

    const isTreble = mode === 'treble';
    const imgPath = isTreble ? 'assets/notes/treble.png' : 'assets/notes/bass.png';

    clefEl.innerHTML = `<img src="${imgPath}" alt="${isTreble ? '高音譜號' : '低音譜號'}" style="height:clamp(80px,14vh,110px);width:auto;filter:drop-shadow(0 4px 15px rgba(0,0,0,0.3));">`;
}

function renderNote(position) {
    const noteEl = document.getElementById("noteNote");
    if (!noteEl) return;

    const imgPath = 'assets/notes/note.png';
    noteEl.innerHTML = `<img src="${imgPath}" alt="音符" style="height:clamp(28px,4.5vw,38px);width:auto;filter:drop-shadow(0 4px 15px rgba(255,215,0,0.2));">`;
    noteEl.style.top = position + "px";
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
        playTone(880, 0.1, 'sine', 0.2);
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
        playTone(659.25, 0.1, 'sine', 0.2);
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
   🎵 分頁控管 + 底部導航
   ============================================================ */
let navCollapsed = false;

function toggleNav() {
    navCollapsed = !navCollapsed;
    const menu = document.getElementById('navMenu');
    const icon = document.getElementById('navToggleIcon');
    if (menu) menu.classList.toggle('collapsed', navCollapsed);
    if (icon) icon.classList.toggle('collapsed', navCollapsed);
}

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
    // 確保表情正常
    setTimeout(() => {
        applySlimeExpression('global', 'normal');
    }, 100);
}

/* ============================================================
   🎵 核心遊戲邏輯
   ============================================================ */
function nextNote() {
    const lookupMode = currentMode.replace('_practice', '');
    const pool = notePositions[lookupMode] || notePositions['treble'];
    const q = pool[Math.floor(Math.random() * pool.length)];
    currentNote = q.note;

    renderNote(q.top);

    timeLeft = MAX_TIME;
    updateTimerDisplay();
}

function answer(n) {
    initAudio();

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

        playCorrectSound();
        if (combo >= 3) playComboSound(combo);

        damageMonster(finalDmg);

        showComboEffect();
    } else {
        combo = 0;
        playWrongSound();
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

    playDefeatSound();

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
    
    // 更新全域史萊姆
    const globalMonster = document.getElementById('globalMonster');
    const globalIcon = document.getElementById('globalMonsterIcon');
    if (globalMonster) globalMonster.style.background = currentYokai.bg;
    if (globalIcon) globalIcon.innerText = currentYokai.icon;

    // 更新名稱
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

        playLevelUpSound();

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
            playWrongSound();
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
   😊 史萊姆受擊動畫（全域版）
   ============================================================ */
function triggerMonsterHit() {
    const globalMonster = document.getElementById('globalMonster');
    const globalHit = document.getElementById('globalHitEffect');

    const expression = getRandomExpression();
    const slashStyle = getRandomSlash();

    if (globalMonster) {
        globalMonster.classList.add('damaged');
        applySlimeExpression('global', expression);
        applySlashEffect('global', slashStyle);
    }
    if (globalHit) globalHit.classList.add('animate');

    setTimeout(() => {
        if (globalMonster) {
            globalMonster.classList.remove('damaged');
            applySlimeExpression('global', 'normal');
        }
        if (globalHit) globalHit.classList.remove('animate');
    }, 500);
}

/* ============================================================
   🕹️ 點擊怪獸（有冷卻限制）
   ============================================================ */
function handleMonsterClick(e) {
    e.stopPropagation();
    
    // 攻擊冷卻檢查 - 每秒最多 8 次
    if (!canAttack()) return;
    
    const now = Date.now();
    if (now - lastClickTime < 80) return;
    lastClickTime = now;

    initAudio();
    const isCrit = Math.random() < getTotalCritChance();
    const clickDmg = isCrit ? Math.floor(getWeaponAtk() * player.critMultiplier * 2) : (getWeaponAtk() * 2);
    damageMonster(clickDmg);

    playTone(440, 0.05, 'sine', 0.1);
}

/* ============================================================
   📊 UI 更新（全域版）
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

    // 更新全域血條
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

    // 更新全域名稱
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

    setTimeout(() => {
        applySlimeExpression('global', 'normal');
    }, 100);
});
