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
    const board = gameBoard.getBoard();
    if (result || board[cell] !== '') return;

    gameBoard.addMarker(cell, activePlayer.getMarker());
    checkGameOver(activePlayer.getMarker());
  };

  return { getResult, getActivePlayer, playRound };
})();
