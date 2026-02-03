const board = document.getElementById("game-board");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const finalScore = document.getElementById("final-score");

const size = 4;
let grid = [];
let score = 0;

function init() {
  board.innerHTML = "";
  grid = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  scoreEl.textContent = "0";
  overlay.classList.add("hidden");

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
  }

  addTile();
  addTile();
  draw();
}

function addTile() {
  const empty = [];
  grid.forEach((row, y) =>
    row.forEach((v, x) => v === 0 && empty.push({ x, y }))
  );

  if (!empty.length) return;
  const { x, y } = empty[Math.floor(Math.random() * empty.length)];
  grid[y][x] = Math.random() < 0.9 ? 2 : 4;
}

function draw() {
  document.querySelectorAll(".tile").forEach(t => t.remove());

  grid.forEach((row, y) =>
    row.forEach((value, x) => {
      if (!value) return;
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.value = value;
      tile.textContent = value;
      tile.style.top = `${y * 100 + 10}px`;
      tile.style.left = `${x * 100 + 10}px`;
      board.appendChild(tile);
    })
  );
}

function slide(row) {
  row = row.filter(v => v);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return row.filter(v => v);
}

function move(dir) {
  let moved = false;

  for (let i = 0; i < size; i++) {
    let line =
      dir === "left" || dir === "right"
        ? grid[i]
        : grid.map(r => r[i]);

    if (dir === "right" || dir === "down") line.reverse();

    const newLine = slide(line);
    while (newLine.length < size) newLine.push(0);

    if (dir === "right" || dir === "down") newLine.reverse();

    for (let j = 0; j < size; j++) {
      const val = newLine[j];
      if (dir === "left" || dir === "right") {
        if (grid[i][j] !== val) moved = true;
        grid[i][j] = val;
      } else {
        if (grid[j][i] !== val) moved = true;
        grid[j][i] = val;
      }
    }
  }

  if (moved) {
    addTile();
    draw();
    scoreEl.textContent = score;
    if (isGameOver()) showGameOver();
  }
}

function isGameOver() {
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      if (grid[y][x] === 0) return false;
      if (grid[y][x] === grid[y]?.[x + 1]) return false;
      if (grid[y][x] === grid[y + 1]?.[x]) return false;
    }
  return true;
}

function showGameOver() {
  finalScore.textContent = score;
  overlay.classList.remove("hidden");
}

document.getElementById("restart").onclick = init;
document.getElementById("play-again").onclick = init;

window.addEventListener("keydown", e => {
  const map = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down"
  };
  if (map[e.key]) move(map[e.key]);
});

init();
