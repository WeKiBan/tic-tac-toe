//global query selectors.
const squares = Array.from(document.querySelectorAll('.square'));
const modal = document.querySelector('.bg-modal');


const CreatePlayers = function (symbol) {

  // return and update score and return symbol functions for each player
  var _score = 0;
  var name = undefined;
  const setName = (playerName) => name = playerName;
  const getName = () => name;
  const getScore = () => _score;
  const resetScore = () => _score = 0;
  const updateScore = () => _score++
  const getSymbol = () => symbol

  return { getName, setName, resetScore, getSymbol, getScore, updateScore };
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
  }


  // updates the board after checking if the space in the array is available
  const updateGameBoard = (locationInArray, symbol) => {
    if (_currentGameBoard[locationInArray] !== "") return;
    _currentGameBoard[locationInArray] = symbol;
  }

  return { getGameBoard, resetGameBoard, updateGameBoard, getWinningCombinations }

})();






const DisplayController = (() => {
  //query selector for winner-modal
  const _winnerModal = document.querySelector('.winner-modal')
  const _winnerModalText = document.querySelector('.winner-modal-text')
  const _startAgainBtn = document.querySelector('.restart')
  const _nextGameButton = document.querySelector(".next-game");


 // changes winner modal display to visible and sets text to winners name
 const announceWinner = (currentTurn) => {

  var winnerName = currentTurn.getName()
  _winnerModalText.innerHTML = `${winnerName} wins!`;
  _winnerModal.style.display= "flex";
  _winnerModalText.classList.add('growAndShrink')
  
  
  
}

  // start again button in the modal opens the new game modal and closes the winner modal
  _startAgainBtn.addEventListener('click', function () {
    GameSetup.resetPlayersToOne();
    modal.style.display = 'flex'
    _winnerModal.display = 'none'
    GameBoard.resetGameBoard();
    addListeners();
    gamePlay.setRoundIncomplete();
    renderBoard();
    _winnerModal.style.display = "none"
    GameSetup.playerTwoContainer.style.display = 'none';
    
  })

  // resets the board and re-add the event listeners to each square when the next game is started.
  _nextGameButton.addEventListener('click', function () {

    GameBoard.resetGameBoard();
    addListeners();
    gamePlay.setRoundIncomplete();
    renderBoard();
    _winnerModal.style.display = "none"
    
  });

 


  // query selectors for the score display
  const _playerOneScoreDisplay = document.querySelector(".player-one-score")
  const _playerTwoScoreDisplay = document.querySelector(".player-two-score")



  //function loops through current board array and displays it on the page, then updates the score using the player objects.
  const renderBoard = () => {
    for (var i = 0; i < squares.length; i++) {
      squares[i].innerHTML = GameBoard.getGameBoard()[i];
      squares[i].style.opacity = "";
    }
  }

  // update the scores display
  const updateScoresDisplay = () => {
    _playerOneScoreDisplay.innerHTML = gamePlay._playerOne.getScore();
    _playerTwoScoreDisplay.innerHTML = gamePlay._playerTwo.getScore();
  }

  // lookup array and function to highlight winning line
  const _winningRowLookup = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const highLightWinningLine = (row) => {
    _winningRowLookup[row].forEach(item => {
      squares[item].style.opacity = 0.6;
    });
  }

  // change score container colors on players turn 

  var highlightColor = "#7BE0AD"
  const displayPlayerInFocus = () => {
    if (gamePlay.getCurrentTurn().getSymbol() === 'O') {
      _playerOneScoreDisplay.style.background = highlightColor;
      _playerOneScoreDisplay.parentNode.style.borderColor = highlightColor;
      _playerTwoScoreDisplay.style.background = "";
      _playerTwoScoreDisplay.parentNode.style.borderColor = "";
    } else if (gamePlay.getCurrentTurn().getSymbol() === 'X') {
      _playerTwoScoreDisplay.style.background = highlightColor;
      _playerTwoScoreDisplay.parentNode.style.borderColor = highlightColor;
      _playerOneScoreDisplay.style.background = "";
      _playerOneScoreDisplay.parentNode.style.borderColor = "";
    }
  }


  // add event listener to each square to allow players to click board to take turn
  const addListeners = () => squares.forEach(square => {
    square.addEventListener('click', gamePlay.takeTurn);
  });


  // remove eventListeners when game is won
  const removeListeners = () => squares.forEach(square => {
    square.removeEventListener('click', gamePlay.takeTurn);
  });






  return { announceWinner, displayPlayerInFocus, updateScoresDisplay, highLightWinningLine, removeListeners, addListeners, renderBoard }
})();




const gamePlay = (() => {

  // two players saved in objects with scores and symbols attached
  const _playerOne = CreatePlayers("O");
  const _playerTwo = CreatePlayers("X");

  // which players turn it currently is
  var _currentTurn = _playerOne;
  const getCurrentTurn = () => _currentTurn;


  // variable to see if round has finished and to reset it to incomplete
  var _roundIsIncomplete = true;
  const isRoundIncomplete = () => _roundIsIncomplete;
  const setRoundIncomplete = () => _roundIsIncomplete = true;



  // each turn updates the gameboard then checks to see if there is a win before rendering the display
  // before updating and changing the current player in focus
  const takeTurn = (e) => {
    var _squareLocation = e.target.dataset.sq;
    GameBoard.updateGameBoard(_squareLocation, _currentTurn.getSymbol());
    DisplayController.renderBoard();
    checkForWin();
    updateCurrentTurn();
    DisplayController.displayPlayerInFocus();
  }


  // updates which players turn is next.  
  const updateCurrentTurn = () => {
    if (_currentTurn === _playerOne) {
      _currentTurn = _playerTwo;
    } else {
      _currentTurn = _playerOne;
    }
  }


  // checks the board for a win if there is a win it updates the score, highlights the winning line and 
  // removes the listeners from the board so another turn cannot be played
  // until the next game begins.
  const checkForWin = () => {
    var _winningRow = 0;
    GameBoard.getWinningCombinations().forEach(combination => {
      if (combination.every(item => item === combination[0] && item !== "")) {
        _currentTurn.updateScore();
        DisplayController.updateScoresDisplay();
        DisplayController.removeListeners();
        _roundIsIncomplete = false;
        DisplayController.highLightWinningLine(_winningRow);
        DisplayController.announceWinner(_currentTurn);
      };
      _winningRow++
    });
  }


  // function to reset the game 
  const gameReset = () => {
    _playerOne.resetScore();
    _playerTwo.resetScore();
    GameBoard.resetGameBoard();
    DisplayController.renderBoard();
  }

  return { getCurrentTurn, setRoundIncomplete, isRoundIncomplete, gameReset, _playerOne, _playerTwo, takeTurn }
})()





const GameSetup = (() => {


  // query selectors for modal
  const _newGameButton = document.querySelector('.new-game')
  const _form = document.querySelector(".form");
  const _closeButton = document.querySelector('.close');
  const _radioButtons = Array.from(document.querySelectorAll('.radio'))
  const _playerOneNameInput = document.querySelector('.player-one-name-input')
  const _playerTwoNameInput = document.querySelector('.player-two-name-input')
  const playerTwoContainer = document.querySelector(".player-two-container")
  const _startGameButton = document.querySelector('.start-button')


  //selectors for name display in score containers
  const _playerOneNameDisplay = document.querySelector('.player-one-name-display')
  const _playerTwoNameDisplay = document.querySelector('.player-two-name-display')


  // function to check if game will be multiplayer or single player;
  var _howManyPlayers = 1;
  const getHowManyPlayers = () => _howManyPlayers;
  const resetPlayersToOne = () => _howManyPlayers = 1;



  // function to set the player names in the score containers and in the player objects
  const setPlayerNames = () => {
    _playerOneNameDisplay.innerHTML = _playerOneNameInput.value;
    gamePlay._playerOne.setName(_playerOneNameInput.value);
    if (_howManyPlayers === 1) {
      _playerTwoNameDisplay.innerHTML = "Computer";
      gamePlay._playerTwo.setName("Computer");
    } else {
      _playerTwoNameDisplay.innerHTML = _playerTwoNameInput.value;
      gamePlay._playerTwo.setName(_playerTwoNameInput.value);
    }
  }


  // display modal new-game is clicked
  _newGameButton.addEventListener('click', function () {
    modal.style.display = 'flex'
    playerTwoContainer.style.display = 'none';
    resetPlayersToOne();
  })



  // close modal and reset form when click outside of box
  window.onclick = function (e) {
    if (e.target == document.querySelector('.bg-modal')) {
      modal.style.display = 'none'
      playerTwoContainer.style.display = 'none';
      _form.reset()
    }
  }



  //close modal and reset form when x is clicked
  _closeButton.addEventListener('click', function () {
    modal.style.display = 'none'
    playerTwoContainer.style.display = 'none';
    _form.reset()
  })



  // hides player 2 container if single player is selected and sets how many players
  _radioButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      if (e.target.value === "single") {
        playerTwoContainer.style.display = 'none';
        _howManyPlayers = 1

      } else {
        playerTwoContainer.style.display = "flex";
        _howManyPlayers = 2
      }
    })
  });



  /* start game, checks if name inputs are empty, adds event listeners to the board, 
  resets form and any previous game data and calls the sets players names 
  and scores*/
  _startGameButton.addEventListener('click', function () {
    if (!_playerOneNameInput.value) return alert('Must enter player name');
    if (playerTwoContainer.style.display === "flex" && !_playerTwoNameInput.value) return alert('Must enter player name');
    modal.style.display = 'none'
    setPlayerNames();
    _form.reset()
    DisplayController.addListeners()
    gamePlay.gameReset();
    DisplayController.updateScoresDisplay();
    DisplayController.displayPlayerInFocus();

  })

  return {resetPlayersToOne, playerTwoContainer: playerTwoContainer, getHowManyPlayers };
})();




