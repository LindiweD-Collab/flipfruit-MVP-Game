const { Game } = require('../src/game');
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`<!DOCTYPE html><body><div id="game-board"></div></body>`);
global.document = dom.window.document;
global.window = dom.window;

function setupDOM() {
  const gameBoardElement = document.createElement('div');
  gameBoardElement.id = 'game-board';
  document.body.appendChild(gameBoardElement);
  return gameBoardElement;
}

describe('Memory Game Initialization', () => {
  let game;
  let gameBoardElement;
  const boardSize = 16;

  beforeEach(() => {
    gameBoardElement = setupDOM();
    game = new Game(boardSize, gameBoardElement);
    game.initGame();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should create a board array with the correct size', () => {
    expect(game.board.length).toBe(boardSize);
  });

  it('should contain pairs of symbols', () => {
    const symbolCounts = {};
    game.board.forEach((card) => {
      symbolCounts[card.symbol] = (symbolCounts[card.symbol] || 0) + 1;
    });
    Object.values(symbolCounts).forEach((count) => {
      expect(count).toBe(2);
    });
  });

  it('should initialize cards as not flipped and not matched', () => {
    game.board.forEach((card) => {
      expect(card.isFlipped).toBe(false);
      expect(card.isMatched).toBe(false);
    });
  });
});

describe('Game Logic and Interaction', () => {
  let game;
  let gameBoardElement;
  const boardSize = 16;

  beforeEach(() => {
    gameBoardElement = setupDOM();
    game = new Game(boardSize, gameBoardElement);
    
    game.initGame();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should flip a card when clicked', () => {
    const firstCard = game.board[0];
    expect(firstCard.isFlipped).toBe(false);
    game.handleCardClick(0);
    expect(firstCard.isFlipped).toBe(true);
  });

  it('should not flip the card if it is already flipped or matched', () => {
    const firstCard = game.board[0];
    firstCard.isFlipped = true;
    game.handleCardClick(0);
    expect(firstCard.isFlipped).toBe(true);
  });

  it('should match cards if their symbols are the same', () => {
    const firstCard = game.board[0];
    const secondCard = game.board[1];
    firstCard.symbol = '🍎';
    secondCard.symbol = '🍎';
    firstCard.isFlipped = true;
    secondCard.isFlipped = true;
    game.checkMatch([firstCard, secondCard]);
    expect(firstCard.isMatched).toBe(true);
    expect(secondCard.isMatched).toBe(true);
  });

  it('should call showCongratulations when all cards are matched', () => {
    spyOn(game, 'showCongratulations'); 
    game.board.forEach(card => {
      card.symbol = '🍎';
      card.isFlipped = true;
    });
    for (let i = 0; i < boardSize; i += 2) {
      game.checkMatch([game.board[i], game.board[i + 1]]);
    }
  
    expect(game.showCongratulations).toHaveBeenCalled();
  });

  it('should not allow more than two unmatched cards to be flipped', () => {
    jasmine.clock().install();
    const card1 = game.board[0];
    const card2 = game.board[1];
    const card3 = game.board[2];
  
    card1.symbol = '🍎';
    card2.symbol = '🍌';
    card3.symbol = '🍉';
  
    card1.element = document.createElement('div');
    card2.element = document.createElement('div');
    card3.element = document.createElement('div');
    game.board[0].element = card1.element;
    game.board[1].element = card2.element;
    game.board[2].element = card3.element;
  
    card1.element.click = () => game.handleCardClick(0);
    card2.element.click = () => game.handleCardClick(1);
    card3.element.click = () => game.handleCardClick(2);

    card1.element.click();
    card2.element.click();
    card3.element.click();
    expect(card3.isFlipped).toBe(false);
    jasmine.clock().tick(1000);
    card3.element.click();
    expect(card3.isFlipped).toBe(true);
  
    jasmine.clock().uninstall();
  });
  
  
  it('should flip cards back after delay if they don’t match (using jasmine.clock)', () => {
    jasmine.clock().install();
  
    const firstCard = game.board[0];
    const secondCard = game.board[1];
  
    firstCard.symbol = '🍎';
    secondCard.symbol = '🍌';
  
    firstCard.isFlipped = true;
    secondCard.isFlipped = true;
  
    game.checkMatch([firstCard, secondCard]);
  
    jasmine.clock().tick(1000);
  
    expect(firstCard.isFlipped).toBe(false);
    expect(secondCard.isFlipped).toBe(false);
  
    jasmine.clock().uninstall();
  });
  
});