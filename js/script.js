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

  return { getBoard, clearBoard, isFull, addMarker };
})();

const gameController = (() => {
  const players = [
    createPlayer('Player One', 'X'),
    createPlayer('Player Two', 'O')
  ];

  const [playerOne, playerTwo] = players;
  let activePlayer = playerOne;

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  const playRound = (cell) => {
    const board = gameBoard.getBoard();
    if (board[cell] !== '') return;

    gameBoard.addMarker(cell, activePlayer.getMarker());
    switchPlayerTurn();
  };

  return { getActivePlayer, playRound };
})();
