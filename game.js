let currentNote = "";
let mode = "treble";

const notes = ["C", "D", "E", "F", "G", "A", "B"];

function startGame(selectedMode) {
  mode = selectedMode;

  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";

  nextNote();
}

function nextNote() {
  const r = Math.floor(Math.random() * notes.length);
  currentNote = notes[r];
  document.getElementById("note").innerText = currentNote;
}

function answer(input) {
  if (input === currentNote) {
    player.score += 10;
    player.combo += 1;

    if (player.combo % 5 === 0) {
      player.score += 20;
    }

  } else {
    player.combo = 0;
  }

  updateUI();
  nextNote();
}

function updateUI() {
  document.getElementById("score").innerText = "Score: " + player.score;
  document.getElementById("combo").innerText = "Combo: " + player.combo;
}

function backMenu() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("game").style.display = "none";
}
