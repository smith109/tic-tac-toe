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
  const players = [];

  const { getBoard, clearBoard } = gameBoard;
  let activePlayer = players[0];
  let result;

  const getResult = () => result;
  const getActivePlayer = () => activePlayer;

  const setPlayers = (playerOneName, playerTwoName) => {
    const playerOne = createPlayer(playerOneName, 'X');
    const playerTwo = createPlayer(playerTwoName, 'O');
    return [playerOne, playerTwo];
  }

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
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

  const resetGame = (playerOneName, playerTwoName) => {
    const [playerOne, playerTwo] = setPlayers(playerOneName, playerTwoName);
    activePlayer = playerOne;
    result = null;

    clearBoard();
    players.splice(0);
    players.push(playerOne, playerTwo);
  }

  return { getBoard, getResult, getActivePlayer, playRound, resetGame };
})();

const displayController = (() => {
  const messageCenterDiv = document.querySelector('.message-center');
  const newPlayerModal = document.querySelector('#new-player-modal');
  const newPlayerForm = document.querySelector('.new-player-form');
  const gameBoardDiv = document.querySelector('.game-board');
  const boardCellDivs = document.querySelectorAll('.cell');

  const highlightWinningCells = (winningPattern) => {
    winningPattern.forEach((cell) =>
      boardCellDivs[cell].classList.add('highlight')
    );
  };

  const removeCellHighlights = () => {
    boardCellDivs.forEach((cellDiv) => {
      if (!(cellDiv.classList.contains('highlight'))) return;
      cellDiv.classList.remove('highlight');
    });
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

  const submitPlayerForm = () => {
    const inputs = newPlayerForm.elements;
    let playerOneName = inputs['p1-name'].value.trim() || 'Player One';
    let playerTwoName = inputs['p2-name'].value.trim() || 'Player Two';


    gameController.resetGame(playerOneName, playerTwoName);
    removeCellHighlights();
    newPlayerForm.reset();
    updateDisplay();
  };

  newPlayerModal.showModal();
  gameBoardDiv.addEventListener('click', clickHandlerBoard);
  newPlayerForm.addEventListener('submit', submitPlayerForm);
})();
