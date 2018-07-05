class EnemyArmy {
  constructor() {
    this.allEnemyShips = [];
    this.spaceL = 10; //In percent
    this.spaceT = 50; //In vh
    this.lines = new Array(5); //This created empty array for 5 elements, where will be bottom space for all lines
    this.currentLine = 1; //Current horizontal line
    this.idEnemy = 0;  //Ship position in a row
    this.verticalLines = []; //This array contains vertical row of ships
    this.moveSpeed = 800; //Current speed of movement
    this.shootShips = []; //This is arrary which include ships which can shoot
    this.g = 0; //counter do pętli wypisującej statki an plansze

    this.switchMove = false; //vertical lines
    this.j = 0; //vertical lines from forward
    this.k = 9; //vertical lines from behind
    this.lineClear = true;

    this.a = 0; //How low are ships
  };

  createArmy() { //This method determines how will be set each ship in formation
    this.createAnimation();

    setTimeout(() => {
      this.setLine();
      this.movementSystem();
      this.randomShoot();
    }, 1200);
  };

  createAnimation() {
    let loop = setTimeout(() => {
      if (this.g<this.lines.length*10) {
        if (this.g != 0 && this.g%10 == 0) { //This change horizontal line
          this.currentLine++;
          this.idEnemy = 0; //Position ship in a row is equal to 0 - new line
          this.spaceT += 8; // +8vh
        }

        const x = new EnemyShip(1);
        this.spaceL = 10 + 2 * this.idEnemy + 6 * this.idEnemy + 0.222 * this.idEnemy; //Pattern for calculating the spacing
        x.createShip(this.g); //Create ship
        x.setOnBoard(); //Set this ship on the game board
        this.idEnemy++;
        this.allEnemyShips.push(x); //Add ship to arrary which include all ships
        if (this.g<10) x.setShoot();
        this.g++;
        this.createAnimation(); //This sets every ship on game board after 0.003 sec
      }
    }, 5);
  };

  setLine() { //This set/create lines
    //Code for horizontal lines
    let ship = 0;
    for(let i=0; i<this.lines.length; i++) {
      this.lines[i] = $('.game__board').height() - enemyArmy.allEnemyShips[ship].getPosition(0) - enemyArmy.allEnemyShips[ship].heightShip; //Set bottom to lines
      ship += 10;
    }

    //Code for vertical lines
    let mvl = this.allEnemyShips.length / this.lines.length;
    for(let i=0; i<mvl; i++) {
      this.verticalLines[i] = new Array(0); //Create two-dimensional array
    }

    for(let i=0; i<this.allEnemyShips.length; i++) {
      let modulo = this.allEnemyShips[i].identifier % 10; //Modulo determines lines to which ship belong
      this.verticalLines[modulo].push(this.allEnemyShips[i]); //Add ship to his vertical line
    }
  };

  changeLine() { //This change horizontal lines after ships slow down
    for(let i=0; i<this.lines.length; i++) {
      this.lines[i] -= $('.game__board').height()*0.05;
    }

    this.checkLine();
  };

  checkLine() { //This function checks how low ships are
    //Call the loop when first horizontal line will be lower than 200px
    //The loop searches horizontal rows of ships, if any from they are alive variable this.lineClear will be equal to false and we won`t do change horizontal line. Then if alive ship will have top position bigger than 80% of height game board, the game will be stopped and player lose.
    for (let i=this.a; i<this.a+10 && this.lines[0] < 200; i++) {
      let ship = this.allEnemyShips[i];
      if (!ship.dead) {
        this.lineClear = false;
        if(ship.getPosition(0) > $('.game__board').height()*0.80) {
          startGame = false;
          setTimeout(function () {
            initGame.clearGame();
          }, 1000)
        }
      }
      //If this.lineClear still is equal to true and this is the last call this loop (every ships were dead; we didnt search any live ships in current horizontal row), we change horizontal row at higher and call this function
      if (this.lineClear && i == this.a+9) {
        if (this.a != 40) {
          this.a += 10;
          this.checkLine();
        }
      }
      else if (!this.lineClear && i == this.a+9) this.lineClear = true;
        //If we found alive ship in current row and it is the last call this loop, we set variable this.lineClear at true. Thanks to that next call this function will be correct
    }
  };

  setMoveSpeed() { //This function sets enemy ships speed of movement and game music
    if (player.killed == 49) {
      this.moveSpeed = 130;
      audioGame2.pause();
      audioGame3.play();
    }
    else if (player.killed > 46 && player.killed < 49) {
      this.moveSpeed = 400;
      audioGame1.pause();
      audioGame2.play();
    }
    else if (player.killed > 35 && player.killed < 46) {
      this.moveSpeed = 450;
      audioGame.pause();
      audioGame1.play();
    }
    else if (player.killed > 15 && player.killed < 35) this.moveSpeed = 550;
  };

  movementSystem() {
    let position = undefined;
    let ship;
    const width = $('.game__board').width();
    for (let i=0; i<this.allEnemyShips.length; i++) { //Every ship perform the specified movement
      if (!this.switchMove && !this.allEnemyShips[i].dead) this.allEnemyShips[i].move(0, 0);
      if (this.switchMove && !this.allEnemyShips[i].dead) this.allEnemyShips[i].move(1, 0);
    }
    let move = (() => {
      for (let i=0; i<this.lines.length; i++) {
        //If that.switchMove === true, ships will be move to the right; fasle=left
        //If taht.switchMove is equal to true, script choose the last vertical row of ships (right); input k == 9; !switchMove input j == 0 (first row of ships)
        this.switchMove ? ship = this.verticalLines[this.k][i] : ship = this.verticalLines[this.j][i];
        if (!ship.dead) position = ship.getPosition(1); //If ship is alive, overwrite position variable at their .left value
        if ((position < width*0.05 && !this.switchMove) || (position > width*0.9 && this.switchMove)) { //If ship from left or right vertical row touch the edge, we call function changeLine to change worth horizontal lines
          //Ships slide down
          for (let i=0; i<this.allEnemyShips.length; i++) {
            this.allEnemyShips[i].slideDown();
          }
          this.changeLine();
        }

        //Right now we reverse direction of movement
        if (position < width*0.05 && !this.switchMove) this.switchMove = true;
        if (position > width*0.9 && this.switchMove) this.switchMove = false;
        if (i==this.lines.length-1 && position === undefined) { //If this is the last call this loop, we change vertical rows at rows closer to the center
          if (!this.switchMove) this.j++;
          if (this.switchMove) this.k--;
        }
      }
    })();
    setTimeout(() => this.movementSystem(), this.moveSpeed);
  };

  randomShoot() {
    if (enemyArmy === undefined || enemyArmy.shootShips.length<2) return;
    let number = Math.floor(Math.random() * enemyArmy.shootShips.length);
    enemyArmy.shootShips[number].attack(); //Random ship from shootShips array can be shoot
    setTimeout(() => this.randomShoot(), 1000);
  };

}
