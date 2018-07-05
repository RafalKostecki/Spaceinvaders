class EnemyShip extends Vehicle {
  constructor(style) {
    super(style);
    this.dead = false; //Whether ship is alive
    this.shoot = false;
    this.animation1;
    this.animation2;
    this.currentAnimation = this.animation1;
    this.grow; //This variable determines how much be bigger
  };


  setOnBoard() { //This method set ship on the game board
    this.ship.style.left = enemyArmy.spaceL + '%';
    this.ship.style.bottom = enemyArmy.spaceT + 'vh';

    this.setAnimation();
    this.animation();
  };

  setShoot() {
    enemyArmy.shootShips.push(this); //Add ship to shootShips array
    this.shoot = true; //Can shoot - true
  };

  slideDown() {
    const y = window.getComputedStyle(this.ship, null).getPropertyValue('top');
    const top = this.ship.style.top === '' ? y : this.ship.style.top;
    const gameHeight = document.getElementById('gameBoard').clientHeight;

    this.ship.style.top = parseInt(top) + gameHeight*0.05 + 'px';
  };

  setAnimation() { //This method set animation
    if(this.identifier < 20) {
      this.animation1 = 'url("./images/ship1a.png")';
      this.animation2 = 'url("./images/ship1b.png")';
    }
    else if (this.identifier >= 40) {
      this.animation1 = 'url("./images/ship3a.png")';
      this.animation2 = 'url("./images/ship3b.png")';
    }
    else {
      this.animation1 = 'url("./images/ship2a.png")';
      this.animation2 = 'url("./images/ship2b.png")';
    }
  };

  animation() {
    if (this.dead && !startGame) return;
    this.ship.style.backgroundImage = this.currentAnimation;

    if (this.currentAnimation === this.animation1) this.currentAnimation = this.animation2;
    else this.currentAnimation = this.animation1;
    setTimeout(() => this.animation(), enemyArmy.moveSpeed);
  };

  attack() {
    if (this.dead) return;

    const bullet = new EnemyBullet(this.ship);
    bullet.createBullet();
  };

  destroyShip() { //This method is call when, ship will be shoot
    const id = parseInt(this.identifier);
    const inArray = enemyArmy.shootShips.indexOf(this);

    if (id < 40 && this.shoot) {
      enemyArmy.shootShips.splice(inArray, 1);
      this.shoot = false; //We change this dead ship that he can`t shoot
      let ship = enemyArmy.allEnemyShips[id+10]; //bierzemy statek nad zniszczonym statkiem
      this.grow = 10;

      if (ship.dead && id < 30) {
        this.grow +=10;
        ship = enemyArmy.allEnemyShips[id+this.grow];
        //If ship above current is not alive, we take ship which is above dead ship
      }
      else if (ship.dead && id >= 40) return;

      ship.setShoot();
    }
    else { //If there is no ship higher
      if (inArray > -1) enemyArmy.shootShips.splice(inArray, 1);
      this.shoot = false;
    }

    this.dead = true;
    audioInvaderKilled.play();
    this.ship.style.backgroundImage = 'url("./images/destroyed.png")';
    setTimeout(() => this.ship.remove(), 200);
  };

  getPosition(type) {
    const left = this.ship.style.left;
    const y = window.getComputedStyle(this.ship, null).getPropertyValue('top');
    const top = this.ship.style.top === '' ? y : this.ship.style.top;

    if (type == 0) return parseInt(top);
    else if (type == 1) return parseInt(left);
    else throw new Error('Invalid data type.')
  };

  get identifier() { //Return id ship
    return this.ship.id;
  };

  get widthShip() { //Return width ship
    const shipWidth = window.getComputedStyle(this.ship, null).getPropertyValue('width');

    return parseInt(shipWidth);
  };

  get heightShip() { //Return height ship
    const shipHeight = window.getComputedStyle(this.ship, null).getPropertyValue('height');

    return parseInt(shipHeight);
  };
}
