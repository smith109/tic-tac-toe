function createPlayer(name, marker) {
  const getMarker = () => marker;
  return { name, getMarker };
}

const gameBoard = (() => {
  const board = Array(9).fill('');

  const getBoard = () => [...board];
  const clearBoard = () => board.fill('');
  const isFull = () => board.every((cell) => cell !== '');

  const addMarker = (index, marker) => {
    if (board[index] !== '') return;
    board[index] = marker;
  };

  const checkForWin = (marker) => {
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return winCombinations.find((combination) =>
      combination.every((cell) => board[cell] === marker));
  };

  return { getBoard, clearBoard, isFull, addMarker, checkForWin };
})();

const gameController = (() => {
  const players = [
    createPlayer('Player One', 'X'),
    createPlayer('Player Two', 'O')
  ];

  const [playerOne, playerTwo] = players;
  const { getBoard } = gameBoard;
  let activePlayer = playerOne;
  let result;

  const getResult = () => result;
  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  const checkGameOver = (marker) => {
    const winningPattern = gameBoard.checkForWin(marker);
    const boardFull = gameBoard.isFull();
    const { name } = activePlayer;

    if (winningPattern) {
      result = { winner: name, winningPattern };
    } else if (boardFull) {
      result = { winner: 'Draw', winningPattern: null };
    } else {
      switchPlayerTurn();
    }
  };

  const playRound = (cell) => {
    const board = getBoard();
    if (result || board[cell] !== '') return;

    gameBoard.addMarker(cell, activePlayer.getMarker());
    checkGameOver(activePlayer.getMarker());
  };

  return { getBoard, getResult, getActivePlayer, playRound };
})();

const displayController = (() => {
  const messageCenterDiv = document.querySelector('.message-center');
  const gameBoardDiv = document.querySelector('.game-board');
  const boardCellDivs = document.querySelectorAll('.cell');

  const highlightWinningCells = (winningPattern) => {
    winningPattern.forEach((cell) =>
      boardCellDivs[cell].classList.add('highlight')
    );
  };

  const checkForResult = (result) => {
    if (!result) return;

    const { winner, winningPattern } = result;

    if (winner && winningPattern) {
      messageCenterDiv.textContent = `${winner} Wins!`;
      highlightWinningCells(winningPattern);
    }

    if (winningPattern === null) {
      messageCenterDiv.textContent = `It's a ${winner}!`;
    }
  };

  const updateDisplay = () => {
    const board = gameController.getBoard();
    const activePlayer = gameController.getActivePlayer();
    let result = gameController.getResult();

    messageCenterDiv.textContent = `${activePlayer.name}'s Turn`;

    boardCellDivs.forEach((cellDiv, index) => {
      cellDiv.textContent = board[index];
      cellDiv.dataset.marker = board[index];
    });

    checkForResult(result);
  };

  const clickHandlerBoard = (e) => {
    const selectedCell = e.target.dataset.id;

    if (!selectedCell) return;

    gameController.playRound(selectedCell);
    updateDisplay();
  };

  gameBoardDiv.addEventListener('click', clickHandlerBoard);
  updateDisplay();
})();
