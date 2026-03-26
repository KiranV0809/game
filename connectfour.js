const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = 1;
let players = { 1: 'Player 1', 2: 'Player 2' };
let gameEnded = false;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const namesDialog = document.querySelector('.names-dialog');
const resultDialog = document.querySelector('.result-dialog');
const resultMessage = document.getElementById('result-message');
const playAgainBtn = document.getElementById('play-again');

namesDialog.showModal();

namesDialog.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    players[1] = document.getElementById('name1').value;
    players[2] = document.getElementById('name2').value;
    namesDialog.close();
    initGame();
});

function initGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    currentPlayer = 1;
    gameEnded = false;
    statusEl.textContent = `${players[1]}'s Turn (Red)`;
    renderBoard();
}

function renderBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (board[r][c] === 1) cell.classList.add('p1');
            if (board[r][c] === 2) cell.classList.add('p2');
            cell.dataset.col = c;
            cell.addEventListener('click', handleClick);
            boardEl.appendChild(cell);
        }
    }
}

function handleClick(e) {
    if (gameEnded) return;
    const col = parseInt(e.target.dataset.col);
    dropPiece(col);
}

function dropPiece(col) {
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) { row = r; break; }
    }
    if (row === -1) return;

    board[row][col] = currentPlayer;
    renderBoard();

    if (checkWinner(row, col)) {
        const color = currentPlayer === 1 ? 'Red' : 'Yellow';
        statusEl.textContent = `${players[currentPlayer]} Wins!`;
        resultMessage.textContent = `${players[currentPlayer]} (${color}) Wins!`;
        resultDialog.showModal();
        gameEnded = true;
        return;
    }

    if (board[0].every(cell => cell !== 0)) {
        statusEl.textContent = "It's a Tie!";
        resultMessage.textContent = "It's a Tie!";
        resultDialog.showModal();
        gameEnded = true;
        return;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    const color = currentPlayer === 1 ? 'Red' : 'Yellow';
    statusEl.textContent = `${players[currentPlayer]}'s Turn (${color})`;
}

function checkWinner(row, col) {
    const p = currentPlayer;
    const directions = [[0,1],[1,0],[1,1],[1,-1]];
    for (const [dr, dc] of directions) {
        let count = 1;
        count += countDir(row, col, dr, dc, p);
        count += countDir(row, col, -dr, -dc, p);
        if (count >= 4) return true;
    }
    return false;
}

function countDir(row, col, dr, dc, player) {
    let count = 0;
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++; r += dr; c += dc;
    }
    return count;
}

resetBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', () => { resultDialog.close(); initGame(); });
