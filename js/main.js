'use strict';
var gBoard;
var gLevel;
var gGame;
var gIsStartedGame;
var gCountShown = 0;
var gLifeLeft;
var gTimerInterval;
var gSeconds;
var gMinutes;
var gHours;
var gLight;
var gElLightBulbBtns;
var gMode = false;
const MINE_IMG = `<img src="img/mine.svg" alt="mine" />`;
const LIGHT_BULB = '<img src="img/lightbulb-regular.svg"/>';
const FLAG = '🚩';
const HURT = '❤️';
const WIN = '😎';
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function onInit() {
  console.log('hi');
  gLevel = {
    SIZE: 4,
    MINES: 3,
  };
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  gBoard = buildBoard();
  gIsStartedGame = false;
  stopTimer();
  gTimerInterval = null;
  gSeconds = 0;
  gMinutes = 0;
  gHours = 0;
  const elLifeLeft = document.querySelector('.life-left span');
  const elTimer = document.querySelector('.timer');
  const elResetGameBtn = document.querySelector('.reset-game');
  gElLightBulbBtns = document.querySelectorAll('.light');
  gElLightBulbBtns = Array.from(gElLightBulbBtns);
  elTimer.innerText = '00:00:00';
  gLifeLeft = 1;
  elLifeLeft.innerText = HURT.repeat(gLifeLeft);
  elResetGameBtn.innerText = '😀';
  if (gLevel.SIZE === 4) gLevel.MINES = 2;
  else if (gLevel.SIZE === 8) gLevel.MINES = 14;
  else if (gLevel.SIZE === 12) gLevel.MINES = 32;
  gLight = false;
  gMode = true;
  renderBoard(gBoard);
}
function onRevelLevel(elBtn) {
  gLevel = {
    SIZE: +elBtn.dataset.level,
    MINES: 2,
  };
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  gBoard = buildBoard();
  gIsStartedGame = false;
  stopTimer();
  gTimerInterval = null;
  gSeconds = 0;
  gMinutes = 0;
  gHours = 0;
  const elLifeLeft = document.querySelector('.life-left span');
  const elTimer = document.querySelector('.timer');
  const elResetGameBtn = document.querySelector('.reset-game');
  elTimer.innerText = '00:00:00';
  gElLightBulbBtns = document.querySelectorAll('.light');
  gElLightBulbBtns = Array.from(gElLightBulbBtns);
  elResetGameBtn.innerText = '😀';
  gLifeLeft = +elBtn.dataset.life;
  elLifeLeft.innerText = HURT.repeat(gLifeLeft);
  if (gLevel.SIZE === 4) gLevel.MINES = 2;
  else if (gLevel.SIZE === 8) gLevel.MINES = 14;
  else if (gLevel.SIZE === 12) gLevel.MINES = 32;
  gLight = false;
  gMode = true;
  renderBoard(gBoard);
}
function buildBoard() {
  const mineSweeper = [];
  for (let i = 0; i < gLevel.SIZE; i++) {
    mineSweeper[i] = [];
    for (let j = 0; j < gLevel.SIZE; j++) {
      const cell = {
        isMine: false,
        // (i === 1 && j === 1) || (i === 3 && j === 3),
        // (i === 0 && j === 0) ||
        // (i === 3 && j === 0) ||
        // (i === 0 && j === 3),
        isShown: false,
        isMarked: false,
        location: { i, j },
      };
      mineSweeper[i][j] = cell;
    }
  }

  //   getIndexsForMines(mineSweeper);
  // setMinesNegsCount(mineSweeper);
  return mineSweeper;
}

function renderBoard(board) {
  var strHTML = '';
  for (let i = 0; i < board.length; i++) {
    strHTML += `<tr class="minesweeper-row" >\n`;
    for (let j = 0; j < board.length; j++) {
      const cell = gBoard[i][j];
      var className = getClassName(i, j) + ' ' + getClassesForNeg(cell);
      // if (cell.isMarked) {
      //   className += ' marked';
      //   strHTML += `\t<td class="${className}"
      //     onclick="onCellClicked(this, ${i}, ${j})"
      //     oncontextmenu="onCellMarked(this,${i}, ${j},event)">${FLAG}</td>\n`;
      // } else {
      strHTML += `\t<td class="${className}" 
        onclick="onCellClicked(this, ${i}, ${j})"
        oncontextmenu="onCellMarked(this,${i}, ${j},event)"></td>\n`;
      // }
    }
    strHTML += `</tr>\n`;
  }
  const elMinesweeperCells = document.querySelector('.minesweeper-cells');
  elMinesweeperCells.innerHTML = strHTML;
}

function onCellMarked(elCell, i, j, ev) {
  ev.preventDefault();

  if (isWin()) {
    console.log('you win');
    const elResetGameBtn = document.querySelector('.reset-game');
    elResetGameBtn.innerText = WIN;
    stopTimer();
    return;
  }
  // if (gGame.isOn) {
  var cell = gBoard[i][j];
  if (cell.isShown) return;
  if (cell.isMarked) {
    cell.isMarked = false;
    elCell.classList.remove('marked');
    elCell.innerHTML = '';
  } else {
    cell.isMarked = true;
    gGame.markedCount++;
    elCell.classList.add('marked');
    elCell.innerHTML = FLAG;
    // renderBoard(gBoard);
  }
}
function getClickedLightBulb(elLightBulbBtns) {
  for (let i = 0; i < elLightBulbBtns.length; i++) {
    const elLightBulb = elLightBulbBtns[i];
    console.log(elLightBulb.dataset.isClicked);
    if (elLightBulb.dataset.isClicked === 'true') {
      elLightBulb.style.backgroundColor = 'lightgray';
      elLightBulb.dataset.isClicked === 'false';
      elLightBulbBtns.splice(i, 1);
      console.log('gElLightBulbBtns', gElLightBulbBtns);
      return;
    }
  }
}

function onCellClicked(elCell, i, j) {
  const elLifeLeft = document.querySelector('.life-left span');
  const elResetGameBtn = document.querySelector('.reset-game');

  if (!gIsStartedGame) {
    gGame.isOn = true;
    gIsStartedGame = true;
    getIndexsForMines(gBoard, i, j);
    setMinesNegsCount(gBoard);
    startTimer();
  }
  if (gGame.isOn) {
    if (gLight && !gBoard[i][j].isShown) {
      getClickedLightBulb(gElLightBulbBtns);
      expandShown(gBoard, i, j);
      gLight = false;
      return;
    }
    ///////////////////////////////////////
    var cell = gBoard[i][j];
    if (cell.isMarked) return;
    if (cell.isMine && cell.isShown) return;
    else if (cell.isMine) {
      cell.isShown = true;
      elCell.innerHTML = MINE_IMG;
      // showMines();
      gLifeLeft--;
      elLifeLeft.innerText = HURT.repeat(gLifeLeft);
      gGame.shownCount += 1;
      if (gLifeLeft === 0) {
        gGame.isOn = false;
        console.log('You loose');
        elLifeLeft.innerText = '💔';
        elResetGameBtn.innerText = '🤯';
        elCell.classList.remove('marked');
        stopTimer();
        showMines();
        return;
      }
    }
    //if a number
    else if (cell.minesAroundCount !== 0) {
      elCell.innerHTML = getHTMLValue(cell.minesAroundCount);
    } //if nothing
    else {
      elCell.classList.add('zero');
      expandShownForFurtherTasks(gBoard, i, j);
    }
    cell.isShown = true;
    getShownCells(gBoard);
    // console.table(gBoard);
  }
  if (isWin()) {
    console.log('you win');
    elResetGameBtn.innerText = WIN;
    stopTimer();
    return;
  }
}

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      var currCell = board[i][j];
      if (!currCell.isMine) {
        currCell.minesAroundCount = countMinesAroundCells(board, i, j);
      }
    }
  }
}

function expandShownForFurtherTasks(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[0].length) continue;
      var currCell = board[i][j];
      // DOM
      if (!currCell.isMarked && !currCell.isShown) {
        renderCellNums(i, j, currCell.minesAroundCount);
        currCell.isShown = true;
        if (currCell.minesAroundCount === 0) {
          expandShownForFurtherTasks(board, i, j);
        }
      }
    }
  }
}

function onLight(elBtn) {
  if (gElLightBulbBtns.length === 0) return;
  elBtn.style.backgroundColor = 'lightgray';
  gLight = true;
}

function expandShown(board, rowIdx, colIdx) {
  var cellHighlited = [];
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[0].length) continue;
      var currCell = board[i][j];
      //DOM
      // if (!currCell.isMarked && !currCell.isMine) {
      // if (!currCell.isShown) {
      if (currCell.isShown || currCell.isMarked) continue;
      if (!currCell.isMine) {
        cellHighlited.push(renderCellNums(i, j, currCell.minesAroundCount));
      } else if (currCell.isMine) {
        cellHighlited.push(renderCell(i, j, MINE_IMG));
      }
      removeHighlights(cellHighlited);
      // }
      // if (currCell.minesAroundCount !== 0) {
      //   currCell.isShown = true;
      // }
      // }
      //MODEL
    }
  }
}
function removeHighlights(cellsHighlighted) {
  for (let i = 0; i < cellsHighlighted.length; i++) {
    const cell = cellsHighlighted[i];
    setTimeout(() => {
      cell.classList.remove('zero');
      cell.innerText = '';
    }, 1000);
  }
}
function isWin() {
  var count = 0;
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      const cell = gBoard[i][j];
      // a cell that is flagged and a mine
      if (cell.isMarked && cell.isMine) {
        count++;
      } else if (!cell.isShown) {
        return false;
      }
    }
  }
  console.log('count', count);
  console.log(gLevel.MINES);
  if (count <= gLevel.MINES) {
    return true;
  } else {
    return false;
  }
}
// function isWinForFurtherTasks() {
//   for (let i = 0; i < gBoard.length; i++) {
//     for (let j = 0; j < gBoard[i].length; j++) {
//       const cell = gBoard[i][j];
//       if (cell.isMarked || cell.isMine) continue;
//       else if (!cell.isShown) {
//         // console.log('cell:', cell);
//         return false;
//       }
//     }
//   }
//   return true;
// }
function showMines() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isMine) {
        renderCell(i, j, MINE_IMG);
      }
    }
  }
}
function getIndexsForMines(board, idxRow, idxCol) {
  for (let i = 0; i < gLevel.MINES; i++) {
    var pos = getEmptyCell(board, idxRow, idxCol);
    console.log('pos', pos.i, pos.j);
    board[pos.i][pos.j].isMine = true;
  }
}
// function createMineWithIdx(i, j) {
//   var idxRow = getRandomInt(0, gBoard.length);
//   var idxCol = getRandomInt(0, gBoard.length);
//   while (i === idxRow && j === idxCol) {
//     var idxRow = getRandomInt(0, gBoard.length);
//     var idxCol = getRandomInt(0, gBoard.length);
//   }
//   gBoard[idxRow][idxCol].isMine = true;
// }
function getShownCells(board) {
  gCountShown = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].isShown) {
        gCountShown++;
      }
    }
  }
  gGame.shownCount = gCountShown;
}
function getClassesForNeg(cell) {
  var className = '';
  switch (cell.minesAroundCount) {
    // case 0:
    //   className = 'zero';
    //   break;
    case 1:
      className = 'one';
      break;
    case 2:
      className = 'two';
      break;
    case 3:
      className = 'three';
      break;
  }
  return className;
}

function startTimer() {
  clearInterval(gTimerInterval);
  gTimerInterval = setInterval(updateTimer, 1000); // Update timer every 1 second (1000ms)
}
function stopTimer() {
  clearInterval(gTimerInterval);
}
function updateTimer() {
  gSeconds++;

  if (gSeconds == 60) {
    gSeconds = 0;
    gMinutes++;
  }

  if (gMinutes == 60) {
    gMinutes = 0;
    gHours++;
  }

  const formattedTime = `${String(gHours).padStart(2, '0')}:${String(
    gMinutes
  ).padStart(2, '0')}:${String(gSeconds).padStart(2, '0')}`;
  document.querySelector('.timer').innerText = formattedTime;
}
function onLightMode() {
  const elBody = document.querySelector('body');
  const elH1 = document.querySelector('h1');
  const elLifeLeft = document.querySelector('.life-left');
  const elResetGame = document.querySelector('.reset-game');
  const elTimer = document.querySelector('.timer');
  const elButtons = document.querySelectorAll('button');
  if (gMode === true) {
    elBody.style.backgroundColor = '#F1F1F1';
    elH1.style.color = 'black';
    elLifeLeft.style.color = 'black';
    elResetGame.style.backgroundColor = '#F1F1F1';
    elResetGame.style.borderStyle = 'lightpink';
    elTimer.style.color = 'black';
    for (let i = 0; i < elButtons.length; i++) {
      elButtons[i].style.backgroundColor = '#F1F1F1';
      elButtons[i].style.color = 'black';
    }
  } else {
    elBody.style.backgroundColor = ' rgb(30, 31, 32)';
    elH1.style.color = 'azure';
    elLifeLeft.style.color = 'azure';
    elResetGame.style.backgroundColor = 'rgb(30, 31, 32)';
    // elResetGame.style.borderStyle = 'rgb(30, 31, 32)';
    elTimer.style.color = 'azure';
    for (let i = 0; i < elButtons.length; i++) {
      elButtons[i].style.backgroundColor = 'rgb(43, 43, 52)';
      elButtons[i].style.color = 'azure';
    }
  }
  gMode = !gMode;
}
