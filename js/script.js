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
  let currentPlayer = playerOne;

  const switchPlayerTurn = () => {
    currentPlayer = currentPlayer === playerOne ?
      playerTwo : playerOne;
  }

  const playRound = (cell) => {
    gameBoard.addMarker(cell, currentPlayer.getMarker());
    switchPlayerTurn();
    console.log(gameBoard.getBoard());
  }

  return { playRound };
})();