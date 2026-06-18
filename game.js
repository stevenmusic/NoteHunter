/**
 * 和風音符獵人 - 核心邏輯
 */

let isAttacking = false;
const state = {
    gold: 0,
    playerDamage: 10,
    monster: { hp: 100, maxHp: 100 }
};

function attackMonster() {
    if (isAttacking) return; // 防連點鎖定
    isAttacking = true;

    // 1. 視覺回饋
    const monsterEl = document.querySelector('.monster-slime');
    monsterEl.classList.add('damaged');
    triggerSlashEffect();

    // 2. 數值計算
    state.monster.hp -= state.playerDamage;
    if (state.monster.hp <= 0) {
        state.gold += 10;
        state.monster.hp = state.monster.maxHp;
        alert("妖怪已被淨化！");
    }

    // 3. 更新 UI
    updateUI();

    // 4. 解鎖
    setTimeout(() => {
        isAttacking = false;
        monsterEl.classList.remove('damaged');
    }, 250);
}

function triggerSlashEffect() {
    const wrapper = document.querySelector('.global-monster-wrapper');
    const slash = document.createElement('div');
    slash.className = 'slash-effect slash-1'; // 這裡可隨機選 class
    wrapper.appendChild(slash);
    setTimeout(() => slash.remove(), 500);
}

function updateUI() {
    document.getElementById('goldDisplay').innerText = state.gold;
    const hpBar = document.querySelector('.hp-bar-fill');
    hpBar.style.width = `${(state.monster.hp / state.monster.maxHp) * 100}%`;
}

// 事件監聽
document.querySelector('.monster-slime').addEventListener('click', attackMonster);
