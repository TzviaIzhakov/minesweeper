'use strict';
function countMinesAroundCells(board, rowIdx, colIdx) {
  var count = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[0].length) continue;
      var currCell = board[i][j];
      if (currCell.isMine) count++;
    }
  }
  return count;
}
function renderCell(i, j, value) {
  const cellSelector = '.' + getClassName(i, j);
  const elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
  console.log(elCell);
}
function getHTMLValue(value) {
  return `<span>${value}</span>`;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
function getClassName(i, j) {
  const cellClass = 'cell-' + i + '-' + j;
  return cellClass;
}
function renderCellNums(i, j, value) {
  const cellSelector = '.' + getClassName(i, j);
  const elCell = document.querySelector(cellSelector);
  if (value !== 0) {
    elCell.innerHTML = value;
    console.log(elCell);
  } else {
    elCell.classList.add('zero');
  }
}
function getEmptyCell(board, idxRow, idxCol) {
  var emptyCells = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cell = board[i][j];
      if (!cell.isMine && i !== idxRow && j !== idxCol)
        emptyCells.push({ i, j });
    }
  }
  // console.table(gBoard);
  // console.log(emptyCells);
  if (!emptyCells.length) return;
  const randomIdx = getRandomInt(0, emptyCells.length);
  const pos = emptyCells.splice(randomIdx, 1)[0];
  return pos;
}
