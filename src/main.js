const gameBoardElement = document.getElementById('game-board');
const game = new Game(16, gameBoardElement);
game.initGame();

function showCongratulations() {
    const message = document.getElementById('congrats-message');
    message.style.display = 'block';
  }
  


