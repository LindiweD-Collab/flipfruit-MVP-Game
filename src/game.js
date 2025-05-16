class Game {
  constructor(boardSize, gameBoardElement) {
    this.boardSize = boardSize;
    this.board = [];
    this.gameBoardElement = gameBoardElement;
    this.lockBoard = false; 
  }

  createBoardState() {
    const symbols = ['🍎', '🍌', '🍓', '🍇', '🍍', '🍉', '🍊', '🍋'];
    const pairs = symbols.slice(0, this.boardSize / 2);
    const allSymbols = [...pairs, ...pairs];
    this.board = allSymbols
      .sort(() => Math.random() - 0.5)
      .map((symbol) => ({
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
  }

  initGame() {
    this.createBoardState();
    this.renderBoard();
  }

  renderBoard() {
    this.gameBoardElement.innerHTML = '';
    this.board.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.setAttribute('data-index', index);
      cardElement.textContent =
        card.isFlipped || card.isMatched ? card.symbol : '❓';
      cardElement.addEventListener('click', () => this.handleCardClick(index));
      this.gameBoardElement.appendChild(cardElement);
    });
  }

  handleCardClick(index) {
    const clickedCard = this.board[index];

    if (this.lockBoard || clickedCard.isFlipped || clickedCard.isMatched) {
      const flippedCount = this.board.filter(
        (card) => card.isFlipped && !card.isMatched
      ).length;
      if (
        !clickedCard.isMatched &&
        !clickedCard.isFlipped &&
        flippedCount >= 2
      ) {
        if (this.wrongClickAudio && typeof this.wrongClickAudio.play === 'function') {
          this.wrongClickAudio.play();
        }
        
      }
      return;
    }

    clickedCard.isFlipped = true;
    this.renderBoard();

    const flippedCards = this.board.filter(
      (card) => card.isFlipped && !card.isMatched
    );

    if (flippedCards.length === 2) {
      this.lockBoard = true;
      this.checkMatch(flippedCards);
    }
  }


  checkMatch(flippedCards) {
    const [card1, card2] = flippedCards;
    if (card1.symbol === card2.symbol) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.renderBoard();
  
      const allMatched = this.board.every((card) => card.isMatched);
      if (allMatched) {
        this.showCongratulations();
  
        
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
          playAgainBtn.style.display = 'inline-block';
        }
      }
  
      this.lockBoard = false;
    } else {
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.renderBoard();
        this.lockBoard = false;
      }, 1000);
    }
  }
  
  
  showCongratulations() {
    this.gameBoardElement.innerHTML = '';
    const message = document.getElementById('congrats-message');
    if (message) {
      this.gameBoardElement.appendChild(message);
      message.style.display = 'block';
    }

    this.hideIntroParagraph();
  }

 
  hideIntroParagraph() {
    const introParagraph = document.getElementById('intro-paragraph');
    if (introParagraph) {
      introParagraph.style.display = 'none';
    }
  }
}

module.exports = { Game };


