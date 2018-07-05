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
    let s = new PlayerBullet(this.ship);
    s.createBullet();
    initGame.bullets++;
    document.getElementById('interfaceBullets').innerHTML = initGame.bullets;
    player.accuracy;
    setTimeout(() => this.canShoot = true, time); //How fast player can shoot
  };

  createPlayerLine() { //this create line where is player, where is he can be hit by enemy ship
    let position = $('.ship__player').position();
    this.gamerLine = $('.game__board').height() - position.top;
  };

  get accuracy() { //The accuracy of the player
    let accuracy = (player.killed / initGame.bullets) * 100;
    document.getElementById('interfaceAccuracy').innerHTML = accuracy.toFixed(2) + '%';
  };
}
