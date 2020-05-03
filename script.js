
const players = (name, symbol) => {
  return { name, symbol };
}

const gameBoard = (() => {
  const resetButton = document.getElementById('reset')
  const squares = document.getElementsByClassName('square')
  let gameBoardArray =
    ["", "", ""
      , "", "", "",
      "", "", ""];
  resetButton.addEventListener('click', function () {
    game.result = null;
    gameBoardArray =
      ["", "", ""
        , "", "", "",
        "", "", ""];
    Array.from(squares).forEach(element => {
      element.innerHTML = "";
    });
  })
  const getGameBoardArray = () => gameBoardArray;
  const updateGame = (squareNum, value) => {
    gameBoardArray[squareNum] = value;
  }
  return {
    getGameBoardArray,
    updateGame,
  }
})();


const displayController = (() => {

  const grid = document.getElementById('game-board')

  var squareLocation = 0;

  const render = () => {

    gameBoard.getGameBoardArray().forEach(element => {
      const square = document.createElement('div');
      square.classList.add('square')
      square.innerHTML = element;

      square.addEventListener('click', function (e) {
        let squareNum = e.target.dataset.squareIdNum;
        if (game.result || gameBoard.getGameBoardArray()[squareNum] !== "") return;
        e.target.innerHTML = game.getCurrentTurn().symbol;
        gameBoard.updateGame(squareNum, game.getCurrentTurn().symbol)
        game.checkForWin();
        game.setCurrentTurn();
      })

      square.dataset.squareIdNum = squareLocation;
      grid.appendChild(square);
      squareLocation++;
    })
  }
  return {
    render,
  }
})();



const game = (() => {

  var result;
  let playerOne = players('Player One', 'O');
  let playerTwo = players('Player Two', 'X');
  let currentTurn = playerOne;
  const getCurrentTurn = () => {
    return currentTurn
  }
  const setCurrentTurn = () => {
    if (currentTurn === playerOne) {
      currentTurn = playerTwo;
    } else {
      currentTurn = playerOne;
    }
  }

  const checkForWin = () => {
    let currentBoard = gameBoard.getGameBoardArray();
    let topRow = currentBoard[0] + currentBoard[1] + currentBoard[2];
    let middleRow = currentBoard[3] + currentBoard[4] + currentBoard[5];
    let bottomRow = currentBoard[6] + currentBoard[7] + currentBoard[8];
    let leftColumn = currentBoard[0] + currentBoard[3] + currentBoard[6];
    let middleColumn = currentBoard[1] + currentBoard[4] + currentBoard[7];
    let rightColumn = currentBoard[2] + currentBoard[5] + currentBoard[8];
    let diagonalOne = currentBoard[0] + currentBoard[4] + currentBoard[8];
    let diagonalTwo = currentBoard[2] + currentBoard[4] + currentBoard[6];
    if (topRow === "XXX" || topRow === "OOO") {
      game.result = currentTurn.name;
      console.log(`${currentTurn.name} Wins!`);
    } else if (middleRow === "XXX" || middleRow === "OOO") {
      game.result = currentTurn.name;
      console.log(`${currentTurn.name} Wins!`);
    } else if (bottomRow === "XXX" || bottomRow === "OOO") {
      game.result = currentTurn.name;
      console.log(`${currentTurn.name} Wins!`);
    } else if (leftColumn === "XXX" || leftColumn === "OOO") {
      game.result = currentTurn.name;
      console.log(`${currentTurn.name} Wins!`);
    } else if (middleColumn === "XXX" || middleColumn === "OOO") {
      game.result = currentTurn.name;
      console.log(`${currentTurn.name} Wins!`);
    } else if (rightColumn === "XXX" || rightColumn === "OOO") {
      game.result = currentTurn.name;
      console.log(`${currentTurn.name} Wins!`);
    } else if (diagonalOne === "XXX" || diagonalOne === "OOO") {
      game.result = currentTurn.name;
      console.log(`${currentTurn.name} Wins!`);
    } else if (diagonalTwo === "XXX" || diagonalTwo === "OOO") {
      result = currentTurn.name;
      console.log(`${currentTurn.name} Wins!`);
    } else if (currentBoard.join('').length === 9) {
      result = 'tie';
      console.log(" It's a Tie");
    }

  }
  return { getCurrentTurn, setCurrentTurn, checkForWin, result }
})()


displayController.render()









