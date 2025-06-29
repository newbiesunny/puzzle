const canvas = document.getElementById("puzzleCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "image.jpg"; // replace with your actual image filename

const rows = 4;
const cols = 4;
let pieceWidth, pieceHeight;

let board = [];
let selectedPiece = null;

img.onload = () => {
  const maxWidth = 800;
  const scale = img.width > maxWidth ? maxWidth / img.width : 1;

  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  pieceWidth = canvas.width / cols;
  pieceHeight = canvas.height / rows;

  initBoard();
  shuffleBoard();
  draw();
};

function initBoard() {
  board = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push({ originalX: x, originalY: y });
    }
    board.push(row);
  }
}

function shuffleBoard() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const randX = Math.floor(Math.random() * cols);
      const randY = Math.floor(Math.random() * rows);
      [board[y][x], board[randY][randX]] = [board[randY][randX], board[y][x]];
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const piece = board[y][x];
      const sx = piece.originalX * pieceWidth;
      const sy = piece.originalY * pieceHeight;

      ctx.drawImage(
        img,
        sx / canvas.width * img.width,
        sy / canvas.height * img.height,
        pieceWidth / canvas.width * img.width,
        pieceHeight / canvas.height * img.height,
        x * pieceWidth,
        y * pieceHeight,
        pieceWidth,
        pieceHeight
      );

      ctx.strokeStyle = selectedPiece && selectedPiece.x === x && selectedPiece.y === y ? "#00cc00" : "#cc0000";
      ctx.lineWidth = 2;
      ctx.strokeRect(x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight);
    }
  }
}

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pieceWidth);
  const y = Math.floor((e.clientY - rect.top) / pieceHeight);
  selectedPiece = { x, y };
  draw();
});

canvas.addEventListener("mouseup", (e) => {
  if (!selectedPiece) return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pieceWidth);
  const y = Math.floor((e.clientY - rect.top) / pieceHeight);

  const dx = Math.abs(x - selectedPiece.x);
  const dy = Math.abs(y - selectedPiece.y);

  if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    [board[y][x], board[selectedPiece.y][selectedPiece.x]] =
      [board[selectedPiece.y][selectedPiece.x], board[y][x]];
    draw();
    checkWin();
  }

  selectedPiece = null;
});

function checkWin() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const piece = board[y][x];
      if (piece.originalX !== x || piece.originalY !== y) {
        return;
      }
    }
  }

  setTimeout(() => {
    document.getElementById("winMessage").style.display = "flex";
  }, 300);
}
