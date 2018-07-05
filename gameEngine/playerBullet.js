class PlayerBullet extends Bullet {
  constructor (ship, bulletDiv) {
    super(ship, bulletDiv);

    this.bulletSpeed = document.getElementById('gameBoard').clientHeight/55;
    this.bottom = this.gameWindowHeight - this.bulletPosition[1];
    this.bulletDiv.className = 'bullet bullet--player';
    this.dead = false;
  };

  move() { //jest git
    if (!startGame) return;

    this.bottom += this.bulletSpeed; //Bottom spacing rising
    this.bulletDiv.style.bottom = this.bottom + 'px';

    if (this.bottom >= enemyArmy.lines[0] && this.bottom <= enemyArmy.lines[enemyArmy.lines.length-1] + this.bulletSpeed) {
      this.checkLine();
    };
    if (!mystery.dead && this.bottom >= mystery.mysteryLine && this.bottom <= mystery.mysteryLine + this.bulletSpeed) mystery.collides(this, this.bulletPosition[0]);

    this.bottom >= this.gameWindowHeight ? this.cassation() : setTimeout(() => this.move(), 10); //Deleting bullet which is off the board
  };

  checkLine() {
    let scopeLine = 0;
      for (let i=0; i<enemyArmy.lines.length; i++) {
        if (this.bottom >= enemyArmy.lines[i] && this.bottom < enemyArmy.lines[i] + this.bulletSpeed) {
          scopeLine = i * 10;
          if (!this.dead) this.collides(scopeLine, scopeLine+10);
        }
      }
  };

  collides(scopeLineA, scopeLineB) { //This check whether enemy ship was shot down
    for (let i=scopeLineA; i<scopeLineB; i++) {
      const pointA = enemyArmy.allEnemyShips[i].getPosition(1);
      const pointB = pointA + enemyArmy.allEnemyShips[i].widthShip;

      if (this.bulletPosition[0] > pointA && this.bulletPosition[0] < pointB && !enemyArmy.allEnemyShips[i].dead) { //If yes, ship and bullet will be destroy
        enemyArmy.allEnemyShips[i].destroyShip();
        this.cassation();
        this.dead = true;

        player.killed += 1;
        player.accuracy;
        enemyArmy.setMoveSpeed();
        if (i<20) player.points += 10; //Points
        else if (i>19 && i<40) player.points += 20;
        else if (i> 39 && i<50) player.points += 30;

        document.getElementById('interfacePoints').innerHTML = player.points;
        if(player.killed == enemyArmy.allEnemyShips.length) { //If player shot down all enemy ships
          initGame.nextLevel();
        }
      }
    }
  };

}
