let currentNote = "";
let score = 0;
let combo = 0;

/* PAGE SWITCH */
function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if (pageId === "characterPage") updateCharacter();
}

/* START GAME */
function startGame() {
  switchPage("gamePage");
  nextNote();
}

/* NOTE */
const notes = ["C","D","E","F","G","A","B"];

function nextNote() {
  currentNote = notes[Math.floor(Math.random() * notes.length)];
  document.getElementById("note").innerText = currentNote;
}

/* ANSWER */
function answer(n) {
  if (n === currentNote) {
    score += 10;
    combo++;

    player.exp += 5;

    if (combo % 5 === 0) {
      score += 20;
      levelUpCheck();
    }
  } else {
    combo = 0;
  }

  updateUI();
  updateExpUI();
  nextNote();
}

/* UI */
function updateUI() {
  document.getElementById("score").innerText = "Score " + score;
  document.getElementById("combo").innerText = "Combo " + combo;
}

/* EXP */
function updateExpUI() {
  let percent = player.exp % 100;

  document.getElementById("expFill").style.width = percent + "%";
  document.getElementById("expText").innerText =
    `EXP ${player.exp % 100} / 100`;

  document.getElementById("levelText").innerText =
    "Lv." + player.level;
}

/* LEVEL UP */
function levelUpCheck() {
  if (player.exp >= player.level * 100) {
    player.level++;
    player.hp += 10;
    player.atk += 2;
    player.def += 1;
  }
}

/* CHARACTER */
function updateCharacter() {
  document.getElementById("stats").innerText =
    `ATK ${player.atk} / HP ${player.hp} / DEF ${player.def}`;

  document.getElementById("weapon").innerText =
    `${player.weapon.name} (+${player.weapon.atk})`;

  document.getElementById("armor").innerText =
    `${player.armor.name} (+${player.armor.hp})`;

  document.getElementById("shield").innerText =
    `${player.shield.name} (+${player.shield.def})`;
}

/* BACK */
function backHome() {
  switchPage("homePage");
}
