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
  const board = gameBoard.getBoard();
  let currentPlayer;
  let playerOne;
  let playerTwo;
  let isGameOver;
  let winningCells;
  let result;

  const startGame = (playerOneName, playerTwoName) => {
    playerOne = createPlayer(playerOneName, 'X');
    playerTwo = createPlayer(playerTwoName, 'O');
    currentPlayer = playerOne;
    isGameOver = false;
    winningCells = '';
    result = '';
    gameBoard.clearBoard();
  }

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
    startGame,
    getCurrentPlayer,
    getWinningCells,
    getResult,
    playRound
  };
})();

const displayController = (function () {
  const mainEl = document.querySelector('.main');
  const cells = document.querySelectorAll('.cell');
  const playerForm = document.querySelector('form');
  const dialogEl = document.querySelector('dialog');

  const submitPlayerForm = (e) => {
    e.preventDefault();
    let playerOneName = document.querySelector('#p1_name').value;
    let playerTwoName = document.querySelector('#p2_name').value;

    if (!playerOneName) {
      playerOneName = 'Player One';
    }

    if (!playerTwoName) {
      playerTwoName = 'Player Two';
    }

    gameController.startGame(playerOneName, playerTwoName);
    dialogEl.close();
    updateGameStatus();
    renderGameBoard();
    removeCellHighlights();
  }

  const highlightWinningCells = () => {
    const winningCells = gameController.getWinningCells();
    if (!winningCells) return;
    winningCells.forEach(i => cells[i].classList.add('highlight'));
  }

  const removeCellHighlights = () => {
    cells.forEach(cell => {
      if (cell.classList.contains('highlight')) {
        cell.classList.remove('highlight');
      }
    })
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
      updateGameStatus();
      renderGameBoard();
    }

    if (target.classList.contains('new-game')) {
      dialogEl.showModal();
    }
  }

  mainEl.addEventListener('click', handleClick);
  playerForm.addEventListener('submit', submitPlayerForm);
  dialogEl.showModal();
})();