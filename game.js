let isAttacking = false;
let state = { gold: 0, hp: 100, maxHp: 100 };

const slime = document.getElementById('slime');
const hpFill = document.getElementById('hpFill');
const goldDisplay = document.getElementById('goldDisplay');

slime.addEventListener('click', () => {
    if (isAttacking) return;
    isAttacking = true;

    // 1. 打擊視覺：瞬間放大與變色
    slime.style.transform = "scale(0.85) rotate(-5deg)";
    slime.style.filter = "brightness(2) drop-shadow(0 0 10px gold)";

    // 2. 邏輯
    state.hp -= 10;
    if (state.hp <= 0) {
        state.hp = state.maxHp;
        state.gold += 10;
        goldDisplay.innerText = state.gold;
    }

    // 3. UI 更新
    hpFill.style.width = (state.hp / state.maxHp) * 100 + '%';

    // 4. 重置動畫
    setTimeout(() => {
        slime.style.transform = "scale(1) rotate(0deg)";
        slime.style.filter = "brightness(1) drop-shadow(0 0 0 transparent)";
        isAttacking = false;
    }, 150);
});
