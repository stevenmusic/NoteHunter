/* 全域與基礎排版 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  user-select: none;
}

body {
  background-color: #0d0f12;
  color: #e3e8ee;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 10px;
}

#gameApp {
  width: 100%;
  max-width: 420px;
  background-color: #161920;
  border: 2px solid #2c3242;
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* 頂部全域狀態欄 */
.global-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 6px;
  font-weight: bold;
}
#levelText {
  color: #00e5ff;
  font-size: 18px;
}
#goldDisplay {
  color: #ffe600;
  font-size: 16px;
}

/* EXP 經驗值條 */
.exp-container {
  margin: 0 16px 10px;
  height: 14px;
  background: #222836;
  border-radius: 7px;
  position: relative;
  overflow: hidden;
  border: 1px solid #2d3548;
}
.exp-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00e5ff);
  transition: width 0.3s ease;
}
.exp-text {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 9px;
  line-height: 12px;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

/* 內容區與分頁控制 */
#content {
  padding: 16px;
  min-height: 380px;
  overflow-y: auto;
  max-height: calc(100vh - 160px);
}
.page {
  display: none;
}
.page.active {
  display: block;
}

h1, h2 {
  text-align: center;
  margin-bottom: 12px;
  color: #fff;
}
.subtitle {
  text-align: center;
  font-size: 13px;
  color: #707e94;
  margin-bottom: 20px;
}

/* 按鈕風格 */
button {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  background: #252b3a;
  border: 1px solid #3d4761;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s ease;
}
button:active {
  transform: scale(0.98);
  background: #1f2431;
}

/* ==================== 🎼 五線譜戰場結構 ==================== */
.game-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
  color: #00ff88;
}

.note-container {
  width: 100%;
  height: 190px;
  background-color: #f4f5f7;
  border-radius: 12px;
  position: relative;
  border: 4px solid #3b4254;
  overflow: visible;
  box-shadow: inset 0 4px 10px rgba(0,0,0,0.15);
}

.staff-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #333;
}

/* 臨時上下加線 */
.dynamic-ledger {
  position: absolute;
  left: calc(65% - 22px);
  width: 44px;
  height: 2px;
  background-color: #1a1a1a;
  z-index: 2;
}

/* 音符目標定位 */
.note-target {
  position: absolute;
  left: 65%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

@keyframes pop {
  0% { transform: translate(-50%, -50%) scale(0.7); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

/* 音樂輸入鍵盤 */
.keyboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 16px;
}
.keyboard button {
  margin: 0;
  padding: 14px 0;
  background: linear-gradient(180deg, #323b52 0%, #212738 100%);
  border-bottom: 3px solid #11151e;
  font-size: 18px;
}

.exit-btn {
  background: #441d25;
  border-color: #662632;
  margin-top: 16px;
}

/* ==================== ⚔️ 人物面板與裝備卡牌 ==================== */
.stats-box {
  background: #1f2431;
  border: 1px solid #2d3548;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 16px;
}

.equip-slots {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

/* 核心裝備卡片卡槽 (防禦 Class 覆蓋之核心基底) */
.item-card {
  position: relative;
  width: 100%;
  padding: 14px;
  background: #1c202c;
  border-radius: 10px;
  border: 1px solid #2d3548;
  overflow: hidden;
}

/* ==================== 🛒 裝備商店樣式 ==================== */
.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1f2431;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 14px;
  border: 1px solid #2d3548;
}

.shop-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.shop-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.shop-item-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.buy-btn {
  width: auto;
  min-width: 95px;
  padding: 10px 12px;
  margin: 0;
  font-size: 13px;
  background: linear-gradient(180deg, #00e5ff 0%, #008ca3 100%);
  border: 1px solid #00e5ff;
  border-bottom: 3px solid #004c57;
  border-radius: 6px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
.buy-btn:active {
  transform: translateY(2px);
  border-bottom-width: 1px;
}
.buy-btn.owned {
  background: #2a2a3a;
  border-color: #4a4a5a;
  border-bottom: 2px solid #1a1a24;
  color: #8a8a9e;
  cursor: not-allowed;
  pointer-events: none;
}

/* ==================== ✨ 五大裝備稀有度特效系統 ==================== */

/* 1. 普通 (Common) — 灰色 */
.item-card.common {
  border-left: 5px solid #8a8a9e;
}

/* 2. 精良 (Uncommon) — 綠色 */
.item-card.uncommon {
  border-left: 5px solid #00ff88;
  box-shadow: inset 0 0 8px rgba(0, 255, 136, 0.1);
}

/* 3. 稀有 (Rare) — 藍色 */
.item-card.rare {
  border-left: 5px solid #00e5ff;
  border-color: rgba(0, 229, 255, 0.3);
  box-shadow: inset 0 0 12px rgba(0, 229, 255, 0.15);
}

/* 4. 傳奇 (Legendary) — 金色流光 */
.item-card.legendary {
  border: 1px solid #ffcc00;
  border-left: 5px solid #ffcc00;
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.2), inset 0 0 15px rgba(255, 204, 0, 0.1);
}
/* 雷射流光掃掠層 */
.item-card.legendary::after, .item-card.mythic::after {
  content: "";
  position: absolute;
  top: 0; left: -150%;
  width: 50%; height: 100%;
  transform: skewX(-25deg);
  pointer-events: none;
}
.item-card.legendary::after {
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,204,0,0.3) 50%, rgba(255,255,255,0) 100%);
  animation: sweep 4s infinite linear;
}

/* 5. 神話 (Mythic) — 紅光虛空能量脈衝 */
.item-card.mythic {
  border: 1px solid #ff0055;
  border-left: 5px solid #ff0055;
  animation: mythicPulse 2.5s infinite alternate ease-in-out;
}
.item-card.mythic::after {
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(245, 0, 82, 0.4) 50%, rgba(255,255,255,0) 100%);
  animation: sweep 3s infinite linear;
}

/* 動態特效動畫 */
@keyframes sweep {
  0% { left: -150%; }
  30% { left: 150%; }
  100% { left: 150%; }
}
@keyframes mythicPulse {
  0% { box-shadow: 0 0 4px rgba(255, 0, 85, 0.2), inset 0 0 8px rgba(255, 0, 85, 0.1); }
  100% { box-shadow: 0 0 16px rgba(255, 0, 85, 0.5), inset 0 0 20px rgba(255, 0, 85, 0.25); border-color: #ff3377; }
}

/* 底部全域導覽列 */
.bottomNav {
  display: flex;
  background: #1a1e29;
  border-top: 2px solid #2c3242;
}
.bottomNav button {
  flex: 1;
  margin: 0;
  padding: 16px 0;
  border: none;
  border-radius: 0;
  background: transparent;
  font-size: 14px;
}
.bottomNav button:not(:last-child) {
  border-right: 1px solid #252b3a;
}
.bottomNav button:active {
  background: #13161f;
}
