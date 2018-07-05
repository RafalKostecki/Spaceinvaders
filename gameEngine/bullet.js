class Bullet {
  constructor(ship) {
    this.gameWindowHeight = document.getElementById('gameBoard').clientHeight;
    this.bulletDiv = document.createElement('div');
    this.ship = ship;
  };


  createBullet() {
    const gameBoard = document.getElementById('gameBoard');
    const leftSpace = parseInt(this.ship.style.left) + (this.ship.clientWidth / 2);

    this.bulletDiv.style.left = leftSpace + 'px';
    gameBoard.appendChild(this.bulletDiv);
    this.move();
  };

  cassation() { //This method destroy bullet
    this.bulletDiv.remove();
    delete this;
  };

  get bulletPosition() {
    const y = window.getComputedStyle(this.ship, null).getPropertyValue('top');
    const top = this.bulletDiv.style.top === '' ? y : this.bulletDiv.style.top;
    const x = window.getComputedStyle(this.ship, null).getPropertyValue('left');
    const left = this.bulletDiv.style.left === '' ? x : this.bulletDiv.style.left;

    return [parseInt(left), parseInt(top)]
  };
}
