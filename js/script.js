function createPlayer(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
}

const gameBoard = (function () {
  const board = ['', '', '', '', '', '', '', '', ''];

  const addMarker = (index, marker) => {
    if (board[index] !== '') return;
    board[index] = marker;
  }

  const getBoard = () => board;
  const clearBoard = () => board.fill('');
  return { addMarker, getBoard, clearBoard };
})();

const gameController = (function () {
  const playerOne = createPlayer('Player One', 'X');
  const playerTwo = createPlayer('Player Two', 'O');
  const board = gameBoard.getBoard();
  let currentPlayer = playerOne;
  let isGameOver = false;
  let winningCells = '';
  let result = '';

  const checkGameTied = () => board.every(cell => cell !== '');
  const getCurrentPlayer = () => currentPlayer;
  const getWinningCells = () => winningCells;
  const getResult = () => result;

  const checkWinner = () => {
    const winCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
      [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winCombinations) {
      const [a, b, c] = combination;
      if (board[a] === '') continue;
      if (board[a] === board[b] && board[b] === board[c]) {
        winningCells = combination;
        return true;
      }
    }
  }

  const checkGameOver = () => {
    if (checkWinner()) {
      isGameOver = true;
      result = `${currentPlayer.getName()} wins!`;
    } else if (checkGameTied()) {
      isGameOver = true;
      result = "It's a tie!";
    }
  }

  const switchPlayerTurn = () => {
    currentPlayer = currentPlayer === playerOne ?
      playerTwo : playerOne;
  }

  const playRound = (cell) => {
    if (isGameOver) return;
    if (board[cell] !== '') return;
    gameBoard.addMarker(cell, currentPlayer.getMarker());
    checkGameOver();
    switchPlayerTurn();
  }

  return {
    getCurrentPlayer,
    getWinningCells,
    getResult,
    playRound
  };
})();

const displayController = (function () {
  const mainEl = document.querySelector('.main');
  const cells = document.querySelectorAll('.cell');

  const highlightWinningCells = () => {
    const winningCells = gameController.getWinningCells();
    if (!winningCells) return;
    winningCells.forEach(i => cells[i].classList.add('highlight'));
  }

  const updateGameStatus = () => {
    const gameStatusEl = document.querySelector('.game-status');
    const currentPlayer = gameController.getCurrentPlayer();
    const result = gameController.getResult();

    if (result) {
      gameStatusEl.textContent = `${result}`;
      highlightWinningCells();
    } else {
      gameStatusEl.textContent =
        `It's ${currentPlayer.getName()}'s turn`;
    }
  }

  const renderGameBoard = () => {
    const board = gameBoard.getBoard();
    board.forEach((marker, i) => cells[i].textContent = marker);
  }

  const handleClick = (event) => {
    const target = event.target;
    if (target.classList.contains('game-board')) return;

    if (target.classList.contains('cell')) {
      const cell = target.dataset.id;
      gameController.playRound(cell);
    }

    updateGameStatus();
    renderGameBoard();
  }

  updateGameStatus();
  mainEl.addEventListener('click', handleClick);
})();