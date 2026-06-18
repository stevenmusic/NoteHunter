/**
 * 🎼 音符獵人 (Onpu Hunter) - 遊戲核心邏輯
 * 風格：和風/妖異
 */

// 1. 遊戲狀態管理
const state = {
    gold: 0,
    exp: 0,
    level: 1,
    playerDamage: 10,
    monster: {
        hp: 100,
        maxHp: 100,
        name: "迷途小鬼",
        type: "slime" // 可擴充為其他妖怪
    }
};

// 2. 頁面切換機制
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // 隱藏底部選單以外的雜訊 (若有需要)
    console.log(`已切換至: ${pageId}`);
}

// 3. 戰鬥邏輯：斬擊
function attackMonster() {
    const monsterEl = document.querySelector('.monster-slime');
    
    // 受擊視覺效果
    monsterEl.classList.add('damaged');
    setTimeout(() => monsterEl.classList.remove('damaged'), 200);

    // 觸發隨機斬擊特效 (1-5)
    const slashType = Math.floor(Math.random() * 5) + 1;
    triggerSlashEffect(slashType);

    // 傷害計算
    state.monster.hp -= state.playerDamage;

    // 檢查死亡
    if (state.monster.hp <= 0) {
        defeatMonster();
    }

    updateMonsterUI();
}

// 觸發 CSS 特效
function triggerSlashEffect(type) {
    const wrapper = document.querySelector('.global-monster-wrapper');
    const slashEl = document.createElement('div');
    slashEl.className = `slash-effect slash-${type}`;
    wrapper.appendChild(slashEl);
    
    // 動畫結束後移除節點，避免 DOM 堆積
    setTimeout(() => {
        slashEl.remove();
    }, 600);
}

// 擊敗怪物
function defeatMonster() {
    state.gold += 10 * state.level;
    state.exp += 20;
    state.monster.hp = state.monster.maxHp + (state.level * 20); // 隨等級變強
    state.monster.maxHp = state.monster.hp;
    
    alert("妖怪被淨化了！");
    updatePlayerUI();
}

// 4. 更新介面
function updateMonsterUI() {
    const hpPercent = (state.monster.hp / state.monster.maxHp) * 100;
    document.querySelector('.hp-bar-fill').style.width = `${hpPercent}%`;
    document.querySelector('.hp-bar-text').innerText = `${state.monster.hp} / ${state.monster.maxHp}`;
}

function updatePlayerUI() {
    document.getElementById('goldDisplay').innerText = state.gold;
    document.getElementById('levelDisplay').innerText = `Lv.${state.level}`;
    // 經驗條邏輯...
}

// 5. 裝備升級
function upgradeItem(type) {
    const cost = 50 * state.level;
    if (state.gold >= cost) {
        state.gold -= cost;
        state.playerDamage += 5;
        updatePlayerUI();
        console.log("裝備提升！");
    } else {
        alert("金錢不足...");
    }
}

// 6. 初始化監聽器
document.addEventListener('DOMContentLoaded', () => {
    // 怪物點擊
    document.querySelector('.global-monster-wrapper').addEventListener('click', attackMonster);
    
    // 導航點擊 (假設你的導航按鈕有 data-page 屬性)
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchPage(e.target.dataset.page);
        });
    });
});
