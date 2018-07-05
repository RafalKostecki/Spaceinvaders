const startButton = document.querySelector('.interface__startGame');
const leftButton = document.querySelector('.movement--left');
const rightButton = document.querySelector('.movement--right');
const attackButton = document.querySelector('.movement__attack');

attackButton.addEventListener('click', () => player.shoot(window.event, 0));
attackButton.addEventListener('touchstart', () => player.shoot(window.event, 1));
startButton.addEventListener('click', () => initGame.startGame());
leftButton.addEventListener('touchstart', () => manualMovement.keyDown(0));
leftButton.addEventListener('touchend', () => manualMovement.keyUp());
rightButton.addEventListener('touchstart', () => manualMovement.keyDown(1));
rightButton.addEventListener('touchend', () => manualMovement.keyUp());

const manualMovement = {
  timeMove: 10,
  canMove: false,
  cantDoubleMove: true,

  keyDown: function(type) { //0-left, 1-right
    if (!startGame) return;
    canMove = true;
    this.moveLoop(type)
  },

  keyUp: function() {
    if (!startGame) return;
    canMove = false;
  },

  helper: function() {
    setTimeout(() => this._cantDoubleMove = true, this._timeMove)
  },

  moveLoop: function(type) {
    if(!_canMove || !this._cantDoubleMove || player===undefined) return;
    player.move(type);
    this._cantDoubleMove = false;
    this.helper();
    setTimeout(() => this.moveLoop(type), this._timeMove);
  }
}
