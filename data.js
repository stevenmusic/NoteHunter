/* data.js */
const player = {
  // 基本資訊
  name: "勇者 Steven",
  level: 1,
  exp: 0,
  expToNextLevel: 100, // 下一級所需經驗
  
  // 資源
  gold: 0,
  
  // 戰鬥屬性
  hp: 100,
  atk: 10,  // 基礎攻擊力
  def: 5,
  tapDamage: 1, // 每次點擊的額外傷害
  
  // 裝備系統 (現在增加屬性加成)
  weapon: { 
    name: "生鏽的木劍", 
    atkBonus: 2, 
    desc: "一把充滿裂痕的木劍。" 
  },
  armor: { 
    name: "麻布衣", 
    hpBonus: 10, 
    desc: "防禦力極低，但很輕便。" 
  },
  shield: { 
    name: "破舊鍋蓋", 
    defBonus: 2, 
    desc: "這真的是盾牌嗎？" 
  },

  // 技能/加成
  critChance: 0.05, // 5% 爆擊率
  critMultiplier: 1.5 // 爆擊傷害倍率
};

// 輔助函式：計算總攻擊力 (基礎攻擊 + 武器加成)
function getPlayerTotalAtk() {
  return player.atk + player.weapon.atkBonus;
}

// 輔助函式：計算總防禦力
function getPlayerTotalDef() {
  return player.def + player.shield.defBonus;
}

// 初始化遊戲資料 (可選)
console.log(`${player.name} 已準備好進行冒險！`);
