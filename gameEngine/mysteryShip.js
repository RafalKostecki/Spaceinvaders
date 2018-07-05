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
    this.mysteryLine = $('body').height()*0.99 - $('body').width()*0.026;
  };

  destroy(animation) { //This method will destroy mystery ship when he will be shot down or he will be off the board
    this.dead = true;
    if (animation) {
      audioInvaderKilled.play();
      $(this.ship).css('background-image', 'url("./images/destroyedMystery.png")')
      setTimeout(() => $(this.ship).remove(), 250);
    }
    else $(this.ship).remove();
    audioMysteryShip.pause();
  };

  collides(bullet, playerBullet) { //This method checks whether mystery ships was shot down
    let position = $(this.ship).position();
    let pointA = position.left;
    let pointB = pointA + $(this.ship).width();

    if(playerBullet > pointA && playerBullet < pointB) {
      bullet.cassation();
      this.destroy(true);
      player.points += 200;
    }
  };

  movementSystem() {
    if (this.dead) return;
    let position = $(this.ship).position();
    if (position.left > $('.game__board').width() - $(this.ship).width() - 5) {
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
