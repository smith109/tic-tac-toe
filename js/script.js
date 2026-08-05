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
