class EnemyBullet extends Bullet {
  constructor (ship, bulletDiv) {
    super(ship, bulletDiv);

    const top = window.getComputedStyle(this.ship, null).getPropertyValue('top');
    if (this.ship.style.top === '') this.ship.style.top = top;

    this.bottom = this.gameWindowHeight - parseInt(this.ship.style.top) - this.ship.clientHeight - 10;
    this.bulletDiv.className = 'bullet bullet--enemy';
  };


  move() {
    if(!startGame) return;
    this.bottom -= 5;
    this.bulletDiv.style.bottom = this.bottom + 'px';

    if(this.bottom <= player.gamerLine && this.bottom >= player.gamerLine - 5) {
      this.collides();
    }

    this.bottom <= 20 ? this.cassation() : setTimeout(() => this.move(), 20);
  };

  collides() { //This method checks whether bullet is on player line
    const playerDiv = document.getElementById('player');
    const x = window.getComputedStyle(playerDiv, null).getPropertyValue('left');
    const left = parseInt(playerDiv.style.left === '' ? x : playerDiv.style.left);
    const playerWidth = window.getComputedStyle(playerDiv, null).getPropertyValue('width');

    const pointA = left;
    const pointB = pointA + parseInt(playerWidth);

    if(this.bulletPosition[0] > pointA && this.bulletPosition[0] < pointB) { //If is
      audioExplosion.play();

      if (player.life > 0) {
        this.cassation();
        const life = document.getElementById(`life${player.life}`);
        life.remove();
        player.life--;
      }
      if (player.life==0) initGame.clearGame();
    }

  };
}
