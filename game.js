let currentNote = "";
let score = 0;
let combo = 0;

const notes = ["C","D","E","F","G","A","B"];

/* PAGE SWITCH */
function switchPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if (pageId === "characterPage") updateCharacter();
}

/* CHARACTER UI */
function updateCharacter() {
  document.getElementById("stats").innerHTML =
    `ATK: ${player.atk} / HP: ${player.hp} / DEF: ${player.def}`;

  document.getElementById("weapon").innerHTML =
    player.weapon.name + " (+" + player.weapon.atk + " ATK)";

  document.getElementById("armor").innerHTML =
    player.armor.name + " (+" + player.armor.hp + " HP)";

  document.getElementById("shield").innerHTML =
    player.shield.name + " (+" + player.shield.def + " DEF)";
}

/* GAME */
function startGame(mode) {
  switchPage("gamePage");
  nextNote();
}

function nextNote() {
  currentNote = notes[Math.floor(Math.random() * notes.length)];
  document.getElementById("note").innerText = currentNote;
}

function answer(n) {
  if (n === currentNote) {
    score += 10;
    combo++;
    if (combo % 5 === 0) score += 20;
  } else {
    combo = 0;
  }

  document.getElementById("score").innerText = "Score " + score;
  document.getElementById("combo").innerText = "Combo " + combo;

  nextNote();
}

function backHome() {
  switchPage("homePage");
}
