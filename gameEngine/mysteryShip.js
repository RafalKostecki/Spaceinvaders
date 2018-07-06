class MysteryShip extends Vehicle {
  constructor(style) {
    super(style);
    this.mysteryLine;
    this.dead = true;
  };

  move() {
    return super.move(1);
  };

  setMysteryLine() { //Set line where is mystery ship
    const body = document.getElementById('body');
    this.mysteryLine = body.clientHeight*0.99 - body.clientWidth*0.026;
  };

  destroy(animation) { //This method will destroy mystery ship when he will be shot down or he will be off the board
    this.dead = true;
    if (animation) {
      audioInvaderKilled.play();
      this.ship.style.backgroundImage = 'url("./images/destroyedMystery.png")';
      setTimeout(() => this.ship.remove(), 250);
    }
    else this.ship.remove();
    audioMysteryShip.pause();
  };

  collides(bullet, playerBullet) { //This method checks whether mystery ships was shot down
    const pointA = parseInt(this.ship.style.left);
    const pointB = pointA + this.ship.clientWidth;

    if(playerBullet > pointA && playerBullet < pointB) {
      bullet.cassation();
      this.destroy(true);
      player.points += 200;
    }
  };

  movementSystem() {
    if (this.dead) return;

    const gameBoard = document.getElementById('gameBoard');
    if (parseInt(this.ship.style.left) > gameBoard.clientWidth - this.ship.clientWidth - 5) {
      this.destroy(false);
    }
    else {
      this.move();
      setTimeout(() => this.movementSystem(), 15);
    }
  };

  run() {
    if (!startGame) return;

    audioMysteryShip.play();
    this.dead = false;
    mystery.createShip('mystery');
    mystery.movementSystem();
  };
}
