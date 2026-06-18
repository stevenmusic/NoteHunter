/* ============================================================
   🎨 裝備 SVG ICONS（日式和風）
   ============================================================ */
const ICON_WEAPON = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="w" x1="0" x2="1"><stop offset="0%" stop-color="#bc002d"/><stop offset="100%" stop-color="#3a0007"/></linearGradient></defs><path d="M10 50 L50 10 L54 14 L14 54 Z" fill="url(#w)" stroke="#d4af37" stroke-width="2"/><path d="M8 56 L16 48" stroke="#d4af37" stroke-width="4" stroke-linecap="round"/><circle cx="8" cy="56" r="3" fill="#fff"/></svg>`;
const ICON_SHIELD = `<svg viewBox="0 0 64 64" width="44" height="44"><defs><linearGradient id="s" x1="0" x2="1"><stop offset="0%" stop-color="#e6c280"/><stop offset="100%" stop-color="#aa851c"/></linearGradient></defs><path d="M32 6 C45 6 54 14 54 34 C54 50 32 60 32 60 C32 60 10 50 10 34 C10 14 19 6 32 6 Z" fill="url(#s)" stroke="#1c1b1a" stroke-width="2.5"/><circle cx="32" cy="32" r="10" fill="none" stroke="#bc002d" stroke-width="3"/></svg>`;

/* ============================================================
   🎵 五線譜 SVG（備用，當圖片無法載入時使用）
   ============================================================ */
const TREBLE_SVG_FALLBACK = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="150" viewBox="0 0 36 150"><path fill="#fff" d="M18,4 C20,4 24,8 24,14 C24,22 20,30 16,38 C22,34 28,36 30,42 C33,50 30,60 24,64 C20,67 15,68 12,66 C8,64 6,60 6,55 C6,48 10,43 16,42 C20,41 24,43 26,47 C28,51 27,57 24,60 C21,63 17,63 15,61 C13,59 13,56 15,54 C17,52 20,53 20,55 C20,57 18,58 17,57 C16,56 17,54 18,55 Z M18,74 C18,74 18,110 18,125 C16,130 12,133 10,138 C8,142 9,146 12,147 C16,148 20,145 22,141 C24,137 23,132 20,129 C19,127 18,126 18,125 "/></svg>`;
const BASS_SVG_FALLBACK = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60"><path fill="#fff" d="M6,12 C6,12 8,2 16,2 C24,2 30,10 30,22 C30,36 22,46 10,50 C8,51 6,51 6,50 C6,49 8,49 10,48 C20,44 26,35 26,22 C26,12 21,6 16,6 C11,6 9,10 9,14 C9,18 11,20 14,20 C17,20 19,18 19,15 C19,13 17,11 15,12 C14,12 13,13 14,14 Z"/><circle cx="38" cy="9" r="4"/><circle cx="38" cy="21" r="4"/></svg>`;
const WHOLE_NOTE_SVG = `<svg width="30" height="22" viewBox="-15 -11 30 22"><ellipse cx="0" cy="0" rx="12" ry="7.5" fill="none" stroke="#ffd700" stroke-width="3.5"/></svg>`;

/* ============================================================
   🎯 音效引擎（Web Audio API）
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

function playLevelUpSound() {
    playTone(523.25, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.2), 100);
    setTimeout(() => playTone(783.99, 0.1, 'sine', 0.2), 200);
    setTimeout(() => playTone(1046.5, 0.2, 'sine', 0.2), 300);
}

function playDefeatSound() {
    playTone(523.25, 0.15, 'sine', 0.2);
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.2), 150);
    setTimeout(() => playTone(783.99, 0.2, 'sine', 0.2), 300);
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

/* 🎯 Combo 倍率計算 */
function getComboMultiplier() {
    if (combo >= 10) return 3;
    if (combo >= 5) return 2;
    if (combo >= 3) return 1.5;
    return 1;
}

/* 😊 史萊姆五種表情 */
const SLIME_EXPRESSIONS = ['normal', 'happy', 'surprised', 'angry', 'crying'];
const SLASH_TYPES = ['type1', 'type2', 'type3', 'type4', 'type5'];

function getRandomExpression() {
    return SLIME_EXPRESSIONS[Math.floor(Math.random() * SLIME_EXPRESSIONS.length)];
}

function getRandomSlash() {
    return SLASH_TYPES[Math.floor(Math.random() * SLASH_TYPES.length)];
}

function applySlimeExpression(monsterId, expression) {
    const face = document.getElementById(monsterId + 'SlimeFace');
    if (!face) return;

    // 清除所有表情類別
    const mouth = face.querySelector('.slime-mouth');
    if (mouth) {
        mouth.className = 'slime-mouth';
        mouth.classList.add(expression);
    }

    // 眼睛變化
    const eyes = face.querySelectorAll('.slime-eye');
    eyes.forEach(eye => {
        eye.className = 'slime-eye';
        if (expression === 'happy') eye.classList.add('happy');
        else if (expression === 'surprised') eye.classList.add('surprised');
        else if (expression === 'angry') eye.classList.add('angry');
        else if (expression === 'crying') eye.classList.add('crying');
    });
}

function applySlashEffect(monsterId, slashType) {
    const slash = document.getElementById(monsterId + 'SlashEffect');
    if (!slash) return;

    slash.className = 'slash-effect';
    slash.classList.add(slashType);
    slash.classList.add('active');

    setTimeout(() => {
        slash.classList.remove('active');
    }, 400);
}

/* 🎵 音符位置 */
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

function getWeaponAtk() {
    return player.atk + (player.weapon.atkBonus || 0);
}

function getTotalCritChance() {
    return player.critChance + (player.shield.critBonus || 0);
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

    monster.level = 1;
    monster.maxHp = 50;
    monster.currentHp = 50;
    monster.typeIndex = 0;

    updateUI();
    updateExpUI();
    applyYokaiVisuals();
    saveGameData();
    backHome();
}

/* ============================================================
   ⏱️ 計時器系統
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
            // 怪物反擊動畫
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
   🎨 顯示高音譜號（使用圖片）
   ============================================================ */
function renderClef(mode) {
    const clefEl = document.getElementById("staffClef");
    if (!clefEl) return;

    const isTreble = mode === 'treble';
    const imgPath = isTreble ? 'assets/notes/treble.png' : 'assets/notes/bass.png';

    // 嘗試使用圖片
    const img = new Image();
    img.onload = function() {
        clefEl.innerHTML = `<img src="${imgPath}" alt="${isTreble ? '高音譜號' : '低音譜號'}" style="height:130px;width:auto;filter:drop-shadow(0 4px 15px rgba(0,0,0,0.3));">`;
    };
    img.onerror = function() {
        // 圖片載入失敗，使用SVG備案
        clefEl.innerHTML = isTreble ? TREBLE_SVG_FALLBACK : BASS_SVG_FALLBACK;
    };
    img.src = imgPath;
}

/* ============================================================
   💾 存檔與離線模擬
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

    if (monster.currentHp === undefined || monster.currentHp <= 0) monster.currentHp = monster.maxHp;
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

    while (player.exp >= player.level * player.expToNextLevel) { levelUp(); }

    updateUI();
    updateExpUI();
    applyYokaiVisuals();
    saveGameData();
    setTimeout(() => {
        alert(`💤 歸陣報告！修練期間自動祓除 ${slimesDefeated} 隻妖怪！獲得 🪙 ${goldEarned} 財貨！`);
    }, 600);
}

/* ============================================================
   📌 靜態裝備欄生成
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
   🎵 分頁控管
   ============================================================ */
function switchPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    const isHome = id === "homePage";
    const navHome = document.getElementById("navHomeBtn");
    const navChar = document.getElementById("navCharBtn");
    const navHomeChar = document.getElementById("navHomeBtnChar");
    const navCharChar = document.getElementById("navCharBtnChar");

    if (navHome) navHome.classList.toggle("active", isHome);
    if (navChar) navChar.classList.toggle("active", !isHome);
    if (navHomeChar) navHomeChar.classList.toggle("active", isHome);
    if (navCharChar) navCharChar.classList.toggle("active", !isHome);

    if (id === "characterPage") updateCharacter();
    if (id === "homePage") {
        applyYokaiVisuals();
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
}

function startGame(mode) {
    currentMode = mode;
    player.lives = player.maxLives;
    combo = 0;
    switchPage("gamePage");
    nextNote();
    startTimer();
    setTimeout(applyYokaiVisuals, 50);
}

/* ============================================================
   🎵 核心遊戲邏輯
   ============================================================ */
function nextNote() {
    const lookupMode = currentMode.replace('_practice', '');
    const pool = notePositions[lookupMode] || notePositions['treble'];
    const q = pool[Math.floor(Math.random() * pool.length)];
    currentNote = q.note;

    const noteEl = document.getElementById("noteNote");
    if (noteEl) {
        noteEl.innerHTML = WHOLE_NOTE_SVG;
        noteEl.style.top = q.top + "px";
    }

    // 使用圖片顯示譜號
    renderClef(lookupMode);

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

        // Combo 特效
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
   🔥 Combo 特效顯示
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
   👹 怪物相關函數
   ============================================================ */
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
    monster.currentHp += monster.maxHp;
    monster.typeIndex = (monster.level - 1) % YOKAI_DATABASE.length;

    player.gold += 10;
    player.exp += 15;

    playDefeatSound();

    levelUp();
    applyYokaiVisuals();
}

function applyYokaiVisuals() {
    const currentYokai = YOKAI_DATABASE[monster.typeIndex] || YOKAI_DATABASE[0];
    const homeMonster = document.getElementById('homeMonster');
    const gameMonster = document.getElementById('gameMonster');
    const homeIcon = document.getElementById('homeMonsterIcon');
    const gameIcon = document.getElementById('gameMonsterIcon');

    if (homeMonster) homeMonster.style.background = currentYokai.bg;
    if (gameMonster) gameMonster.style.background = currentYokai.bg;
    if (homeIcon) homeIcon.innerText = currentYokai.icon;
    if (gameIcon) gameIcon.innerText = currentYokai.icon;

    // 更新名字
    const homeName = document.getElementById('monsterName');
    const gameName = document.getElementById('gameMonsterName');
    if (homeName) homeName.innerText = `Lv.${monster.level} ${currentYokai.name}`;
    if (gameName) gameName.innerText = `Lv.${monster.level} ${currentYokai.name}`;
}

function levelUp() {
    if (player.exp >= player.level * player.expToNextLevel) {
        player.exp -= (player.level * player.expToNextLevel);
        player.level++;
        player.atk += 2;
        player.hp += 10;
        player.maxHp = player.hp;

        playLevelUpSound();

        setTimeout(() => {
            alert(`🎉 段位晉升！你已達到 ${player.level} 段！\n攻擊力 +2，體力 +10！`);
        }, 400);
    }
}

/* ============================================================
   😊 史萊姆受擊動畫（五種表情 + 五種砍痕）
   ============================================================ */
function triggerMonsterHit() {
    const hMonster = document.getElementById('homeMonster');
    const gMonster = document.getElementById('gameMonster');
    const hHit = document.getElementById('homeHitEffect');
    const gHit = document.getElementById('gameHitEffect');

    const expression = getRandomExpression();
    const slashType = getRandomSlash();

    if (hMonster) {
        hMonster.classList.add('damaged');
        applySlimeExpression('home', expression);
        applySlashEffect('home', slashType);
    }
    if (gMonster) {
        gMonster.classList.add('damaged');
        applySlimeExpression('game', expression);
        applySlashEffect('game', slashType);
    }
    if (hHit) hHit.classList.add('animate');
    if (gHit) gHit.classList.add('animate');

    setTimeout(() => {
        if (hMonster) {
            hMonster.classList.remove('damaged');
            applySlimeExpression('home', 'normal');
        }
        if (gMonster) {
            gMonster.classList.remove('damaged');
            applySlimeExpression('game', 'normal');
        }
        if (hHit) hHit.classList.remove('animate');
        if (gHit) gHit.classList.remove('animate');
    }, 400);
}

/* ============================================================
   🕹️ 點擊怪獸處理
   ============================================================ */
function handleMonsterClick(e) {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastClickTime < 200) return;
    lastClickTime = now;

    initAudio();
    const isCrit = Math.random() < getTotalCritChance();
    const clickDmg = isCrit ? Math.floor(getWeaponAtk() * player.critMultiplier * 2) : (getWeaponAtk() * 2);
    damageMonster(clickDmg);

    playTone(440, 0.05, 'sine', 0.1);
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

    // 更新怪物血條（home + game）
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
window.addEventListener("DOMContentLoaded", () => {
    loadGameData();
    // 設定初始譜號顯示
    renderClef('treble');
    updateUI();
});
