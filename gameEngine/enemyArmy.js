class EnemyArmy {
  constructor() {
    this.allEnemyShips = [];
    this.lines = new Array(5); //This created empty array for 5 elements, where will be bottom space for all lines
    this.currentLine = 1; //Current horizontal line
    this.idEnemy = 0;  //Ship position in a row
    this.verticalLines = []; //This array contains vertical row of ships
    this.moveSpeed = 800; //Current speed of movement
    this.shootShips = []; //This is arrary which include ships which can shoot
  };

  createArmy() { //This method determines how will be set each ship in formation
    const shipsQuantity = this.allEnemyShips.length;

    const loop = setTimeout(() => {
      if (shipsQuantity >= 50) return;

      if (shipsQuantity != 0 && shipsQuantity%10 == 0) { //Change horizontal line
        this.currentLine++;
        this.idEnemy = 0; //Position ship in a row is equal to 0 - new line
      }

      const ship = new EnemyShip(1);
      const leftSpace = 10 + 2 * this.idEnemy + 6 * this.idEnemy + 0.222 * this.idEnemy; //Pattern for calculating the spacing
      const topSpace = 42 + (8*this.currentLine); // +8vh

      ship.createShip(shipsQuantity); //Create ship
      ship.setOnBoard(leftSpace, topSpace); //Set this ship on the game board
      this.idEnemy++;
      this.allEnemyShips.push(ship); //Add ship to arrary which include all ships

      if (shipsQuantity<10) ship.setShoot();
      this.createArmy();
    }, 7);

    if (shipsQuantity === 50) {
      this.setLine();
      this.movementSystem();
      this.randomShoot();
    }
  };

  setLine() { //This set/create lines
    //Code for horizontal lines
    const gameBoard = document.getElementById('gameBoard');
    let ship = 0;

    for(let i=0; i<this.lines.length; i++) {
      this.lines[i] = gameBoard.clientHeight - enemyArmy.allEnemyShips[ship].getPosition(0) - enemyArmy.allEnemyShips[ship].heightShip; //Set bottom to lines
      ship += 10;
    }

    //Code for vertical lines
    const mvl = this.allEnemyShips.length / this.lines.length;
    for(let i=0; i<mvl; i++) {
      this.verticalLines[i] = new Array(0); //Create two-dimensional array
    }

    for(let i=0; i<this.allEnemyShips.length; i++) {
      const modulo = this.allEnemyShips[i].identifier % 10; //Modulo determines lines to which ship belong
      this.verticalLines[modulo].push(this.allEnemyShips[i]); //Add ship to his vertical line
    }
  };

  changeLine() { //This change horizontal lines after ships slow down
    const gameBoard = document.getElementById('gameBoard');
    for(let i=0; i<this.lines.length; i++) {
      this.lines[i] -= gameBoard.clientHeight*0.05;
    }

    this.checkLine();
  };

  checkLine(currentHowLow=0, currentLineClear=true) { //This function checks how low ships are
    //Call the loop when first horizontal line will be lower than 200px
    //The loop searches horizontal rows of ships, if any from they are alive variable lineClear will be equal to false and we won`t do change horizontal line. Then if alive ship will have top position bigger than 80% of height game board, the game will be stopped and player lose.
    let howLow = currentHowLow;
    let lineClear = currentLineClear;
    const gameBoard = document.getElementById('gameBoard');

    for (let i=howLow; i<howLow+10 && this.lines[0] < 200; i++) {
      const ship = this.allEnemyShips[i];
      if (!ship.dead) {
        lineClear = false;
        if(ship.getPosition(0) > gameBoard.clientHeight*0.80) {
          startGame = false;
          setTimeout(() => {
            initGame.clearGame();
          }, 1000)
        }
      }
      //If lineClear still is equal to true and this is the last call this loop (every ships were dead; we didnt search any live ships in current horizontal row), we change horizontal row at higher and call this function
      if (lineClear && i == howLow+9) {
        if (howLow != 40) {
          howLow += 10;
          this.checkLine(howLow, lineClear);
        }
      }
      else if (!lineClear && i == howLow+9) lineClear = true;
      //If we found alive ship in current row and it is the last call this loop, we set variable lineClear at true. Thanks to that next call this function will be correct
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

  movementSystem(currentSwitchMove=false, currentJ=0, currentK=9) {
    let position = undefined;
    let ship;
    let switchMove = currentSwitchMove;
    let j = currentJ;
    let k = currentK;
    const gameBoard = document.getElementById('gameBoard');
    const width = gameBoard.clientWidth;

    for (let i=0; i<this.allEnemyShips.length; i++) { //Every ship perform the specified movement
      if (!switchMove && !this.allEnemyShips[i].dead) this.allEnemyShips[i].move(0, 0);
      if (switchMove && !this.allEnemyShips[i].dead) this.allEnemyShips[i].move(1, 0);
    }

    for (let i=0; i<this.lines.length; i++) {
      //If switchMove === true, ships will be move to the right; fasle=left
      //If switchMove is equal to true, script choose the last vertical row of ships (right); input k == 9; !switchMove input j == 0 (first row of ships)
      switchMove ? ship = this.verticalLines[k][i] : ship = this.verticalLines[j][i];

      if (!ship.dead) position = ship.getPosition(1); //If ship is alive, overwrite position variable at their .left value
      if ((position < width*0.05 && !switchMove) || (position > width*0.9 && switchMove)) { //If ship from left or right vertical row touch the edge, we call function changeLine to change worth horizontal lines
        //Ships slide down
        for (let i=0; i<this.allEnemyShips.length; i++) {
          this.allEnemyShips[i].slideDown();
        }
        this.changeLine();
      }

      //Right now we reverse direction of movement
      if (position < width*0.05 && !switchMove) switchMove = true;
      if (position > width*0.9 && switchMove) switchMove = false;
      if (i==this.lines.length-1 && position === undefined) { //If this is the last call this loop, we change vertical rows at rows closer to the center
        if (!switchMove) j++;
        if (switchMove) k--;
      }
    }

    setTimeout(() => this.movementSystem(switchMove, j, k), this.moveSpeed);
  };

  randomShoot() {
    if (enemyArmy === undefined || enemyArmy.shootShips.length<2) return;

    const number = Math.floor(Math.random() * enemyArmy.shootShips.length);
    enemyArmy.shootShips[number].attack(); //Random ship from shootShips array can be shoot
    setTimeout(() => this.randomShoot(), 1000);
  };

}
