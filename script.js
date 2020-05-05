//global query selectors.
const squares = Array.from(document.querySelectorAll('.square'));




// factory function to create the players
const CreatePlayers = function (symbol) {
  
  
  // return and update score and return symbol functions for each player
  var score = 0;
  const getScore = () => score;
  const resetScore = () => score = 0;
  const updateScore = () => score++
  const getSymbol = () => symbol

  return { resetScore, getSymbol, getScore, updateScore };
}


const GameBoard = (() => {

  var _currentGameBoard = ["", "", "", "", "", "", "", "", ""];

  // returns array of each possible winning combination on the board;
  const getWinningCombinations = () => [
    [_currentGameBoard[0], _currentGameBoard[1], _currentGameBoard[2]],
    [_currentGameBoard[3], _currentGameBoard[4], _currentGameBoard[5]],
    [_currentGameBoard[6], _currentGameBoard[7], _currentGameBoard[8]],
    [_currentGameBoard[0], _currentGameBoard[3], _currentGameBoard[6]],
    [_currentGameBoard[1], _currentGameBoard[4], _currentGameBoard[7]],
    [_currentGameBoard[2], _currentGameBoard[5], _currentGameBoard[8]],
    [_currentGameBoard[0], _currentGameBoard[4], _currentGameBoard[8]],
    [_currentGameBoard[2], _currentGameBoard[4], _currentGameBoard[6]]
  ]

  // functions to return and reset the board.
  const getGameBoard = () => _currentGameBoard;
  const resetGameBoard = () => {
    _currentGameBoard = ["", "", "", "", "", "", "", "", ""];
    DisplayController.renderBoard()
  }


  // updates the board after checking if the space in the array is available
  const updateGameBoard = (locationInArray, symbol) => {
    if (_currentGameBoard[locationInArray] !== "") return;
    _currentGameBoard[locationInArray] = symbol;
  }

  return { getGameBoard, resetGameBoard, updateGameBoard, getWinningCombinations }

})();






const DisplayController = (() => {

  // query selectors for the score display
  const _playerOneScoreDisplay = document.querySelector(".player-one-score")
  const _playerTwoScoreDisplay = document.querySelector(".player-two-score")
  const _NextGameButton = document.querySelector(".next-game");


  //function loops through current board array and displays it on the page, then updates the score using the player objects.
  const renderBoard = () => {
    for (var i = 0; i < squares.length; i++) {
      squares[i].innerHTML = GameBoard.getGameBoard()[i];
    }
    _playerOneScoreDisplay.innerHTML = gamePlay._playerOne.getScore();
    _playerTwoScoreDisplay.innerHTML = gamePlay._playerTwo.getScore();
  }


  // add event listener to each square to allow players to click board to take turn
  const addListeners = () => squares.forEach(square => {
    square.addEventListener('click', gamePlay.takeTurn);
  });


  // remove eventListeners when game is won
  const removeListeners = () => squares.forEach(square => {
    square.removeEventListener('click', gamePlay.takeTurn);
  });


  // checks to see if game is finished, if finished resets the board and re-add the event listeners to each square when the next game is started.
  _NextGameButton.addEventListener('click', function () {
    if(gamePlay.checkRoundComplete) return;
    GameBoard.resetGameBoard();
    DisplayController.addListeners();
    gamePlay.setRoundIncomplete();
  });



  return { removeListeners, addListeners, renderBoard }
})();






const gamePlay = (() => {

  // two players saved in objects with scores and symbols attached
  const _playerOne = CreatePlayers("X");
  const _playerTwo = CreatePlayers("O");

  // which players turn it currently is
  var _currentTurn = _playerOne;
  

  // variable to see if round has finished and to reset it to incomplete
  var roundIsIncomplete = true;
  const isRoundIncomplete = () => roundIsIncomplete;
  const setRoundIncomplete = () => roundIsIncomplete = true;



  // each turn updates the gameboard then checks to see if there is a win before rendering the display
  const takeTurn = (e) => {

    var squareLocation = e.target.dataset.sq;

    GameBoard.updateGameBoard(squareLocation, _currentTurn.getSymbol());
    checkForWin();
    DisplayController.renderBoard();
    updateCurrentTurn();
  }


  // updates the players for the next turn.  
  const updateCurrentTurn = () => {
    if (_currentTurn === _playerOne) {
      _currentTurn = _playerTwo;
    } else {
      _currentTurn = _playerOne;
    }
  }


  // checks the board for a win if there is a win it updates the score and 
  // removes the listeners from the board so another turn cannot be played
  // until the next game begins.
  const checkForWin = () => {
    GameBoard.getWinningCombinations().forEach(combination => {
      if (combination.every(item => item === combination[0] && item !== "")) {
        _currentTurn.updateScore();
        DisplayController.removeListeners();
        roundIsIncomplete = false;
      };
    });
  }


  // function to reset the game 
  const gameReset = () => {
    _playerOne.resetScore();
    _playerTwo.resetScore();
    GameBoard.resetGameBoard();
    DisplayController.renderBoard();
  }

  return {setRoundIncomplete, isRoundIncomplete, gameReset, _playerOne, _playerTwo, takeTurn }
})()





const GameSetup = (() => {


  // query selectors for modal
  const _newGameButton = document.querySelector('.new-game')
  const _modal = document.querySelector('.bg-modal');
  const _form = document.querySelector(".form");
  const _closeButton = document.querySelector('.close');
  const _radioButtons = Array.from(document.querySelectorAll('.radio'))
  const _playerOneNameInput = document.querySelector('.player-one-name-input')
  const _playerTwoNameInput = document.querySelector('.player-two-name-input')
  const _playerTwoContainer = document.querySelector(".player-two-container")
  const _startGameButton = document.querySelector('.start-button')


  //selectors for name display in score containers
  const _playerOneNameDisplay = document.querySelector('.player-one-name-display')
  const _playerTwoNameDisplay = document.querySelector('.player-two-name-display')


  // function to check if game will be multiplayer or single player;
  var _howManyPlayers = 1;
  const getHowManyPlayers = () => _howManyPlayers;



  // function to set the player names in the score containers
  const setPlayerNames = () => {
    _playerOneNameDisplay.innerHTML = _playerOneNameInput.value;
    if (_howManyPlayers === 1) {
      _playerTwoNameDisplay.innerHTML = "Computer";
    } else {
      _playerTwoNameDisplay.innerHTML = _playerTwoNameInput.value;
    }
  }


  // display modal new-game is clicked
  _newGameButton.addEventListener('click', function () {
    _modal.style.display = 'flex'
  })



  // close modal and reset form when click outside of box
  window.onclick = function (e) {
    if (e.target == document.querySelector('.bg-modal')) {
      _modal.style.display = 'none'
      _playerTwoContainer.style.display = 'none';
      _form.reset()
    }
  }



  //close modal and reset form when x is clicked
  _closeButton.addEventListener('click', function () {
    _modal.style.display = 'none'
    _playerTwoContainer.style.display = 'none';
    _form.reset()
  })



  // hides player 2 container if single player is selected and sets how many players
  _radioButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      if (e.target.value === "single") {
        _playerTwoContainer.style.display = 'none';
        _howManyPlayers = 1

      } else {
        _playerTwoContainer.style.display = "flex";
        _howManyPlayers = 2
      }
    })
  });



  /* start game, checks if name inputs are empty, resets form and any previous game data and calls the setPlayerNames function */
  _startGameButton.addEventListener('click', function () {
    if (!_playerOneNameInput.value) return alert('Must enter player name');
    if (_playerTwoContainer.style.display === "flex" && !_playerTwoNameInput.value) return alert('Must enter player name');
    _modal.style.display = 'none'
    setPlayerNames();
    gamePlay.gameReset();
    _form.reset()
    DisplayController.addListeners()
    DisplayController.renderBoard();
  })

  return { getHowManyPlayers };
})();




