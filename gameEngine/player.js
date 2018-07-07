class PlayerShip extends Vehicle {
  constructor(style) {
    super(style);
    this.life = 5;
    this.killed = 0;
    this.points = 0;
    this.canShoot = true;
    this.gamerLine = null;
  };


  shoot(type) {
    if (!this.canShoot || !startGame) return;

    let time;
    if (type==1) {
      e.stopPropagation();
      e.preventDefault();
      time = 230;
    }
    else {
      time = 450;
      audioShot.play();
    }

    this.canShoot = false;
    const shot = new PlayerBullet(this.ship);
    shot.createBullet();
    initGame.bullets++;
    document.getElementById('interfaceBullets').innerHTML = initGame.bullets;
    player.accuracy;
    setTimeout(() => this.canShoot = true, time); //How fast player can shoot
  };

  createPlayerLine() { //this create line where is player, where is he can be hit by enemy ship
    const playerShip = document.getElementById('player');
    const y = window.getComputedStyle(playerShip, null).getPropertyValue('top');
    const top = playerShip.style.top === '' ? y : playerShip.style.top;
    const gameBoard = document.getElementById('gameBoard');

    this.gamerLine = gameBoard.clientHeight - parseInt(top);
  };

  get accuracy() { //The accuracy of the player
    const accuracy = (player.killed / initGame.bullets) * 100;
    document.getElementById('interfaceAccuracy').innerHTML = accuracy.toFixed(2) + '%';
  };
}
