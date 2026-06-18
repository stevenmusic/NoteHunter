let isAttacking = false;
let state = {
    gold: 0,
    hp: 100,
    maxHp: 100
};

const slime = document.getElementById('slime');
const hpFill = document.getElementById('hpFill');
const hpText = document.getElementById('hpText');
const goldDisplay = document.getElementById('goldDisplay');

slime.addEventListener('click', () => {
    // 防連點機制
    if (isAttacking) return;
    isAttacking = true;

    // 邏輯處理
    state.hp -= 10;
    if (state.hp <= 0) {
        state.hp = state.maxHp;
        state.gold += 10;
        goldDisplay.innerText = state.gold;
    }

    // UI 更新
    const percent = (state.hp / state.maxHp) * 100;
    hpFill.style.width = percent + '%';
    hpText.innerText = `${state.hp} / ${state.maxHp}`;

    // 視覺回饋
    slime.style.filter = "brightness(2)";
    
    setTimeout(() => {
        isAttacking = false;
        slime.style.filter = "brightness(1)";
    }, 200);
});
