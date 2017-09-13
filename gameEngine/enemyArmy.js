var EnemyArmy = function () {
    function EnemyArmyConstructor() {
        this.allEnemyShips = [];
        this.spaceL = 10; //In percent
        this.spaceT = 50; //In vh
        this.lines = new Array(5); //This created empty array for 5 elements, where will be bottom space for all lines
        this.currentLine = 1; //Current horizontal line
        this.idEnemy = 0;  //Ship position in a row
        this.verticalLines = []; //This array contains vertical row of ships
        this.moveSpeed = 500; //Current speed of movement
        this.shootShips = []; //This is arrary which include ships which can shoot
        this.g = 0; //counter do pętli wypisującej statki an plansze

        this.switchMove = false; //vertical lines
        this.j = 0; //vertical lines from forward
        this.k = 9; //vertical lines from behind
        this.lineClear = true;

        this.a = 0; //How low are ships
    }
    EnemyArmyConstructor.prototype.createArmy = function () { //This method determines how will be set each ship in formation
        this.createAnimation();
        
        setTimeout(() => {
            this.setLine();
            this.movementSystem();
            this.randomShoot();
        }, 1200); 
    }
    EnemyArmyConstructor.prototype.createAnimation= function () {
        var loop = setTimeout(() => {
            if (this.g<this.lines.length*10) {
                if (this.g != 0 && this.g%10 == 0) { //This change horizontal line
                    this.currentLine++;
                    this.idEnemy = 0; //Position ship in a row is equal to 0 - new line
                    this.spaceT += 8; // +8vh
                }
                let x = new EnemyShip(1);
                this.spaceL = 10 + 2 * this.idEnemy + 6 * this.idEnemy + 0.222 * this.idEnemy; //Pattern for calculating the spacing
                x.createShip(this.g); //Create ship
                x.setOnBoard(); //Set this ship on the game board
                this.idEnemy++;
                this.allEnemyShips.push(x); //Add ship to arrary which include all ships
                if (this.g<10) x.setShoot();
                this.g++;
                this.createAnimation(); //This sets every ship on game board after 0.003 sec
            }
        }, 3);
    }
    EnemyArmyConstructor.prototype.setLine = function () { //This set/create lines
        //Code for horizontal lines
        let ship = 0;
        for(let i=0; i<this.lines.length; i++) {
            this.lines[i] = $('.game__board').height() - enemyArmy.allEnemyShips[ship].getPosition(0) - enemyArmy.allEnemyShips[ship].heightShip; //Set bottom to lines
            ship += 10;
        };

        //Code for vertical lines
        let mvl = this.allEnemyShips.length / this.lines.length;
        for(i=0; i<mvl; i++) {
            this.verticalLines[i] = new Array(0); //Create two-dimensional array
        };

        for(let i=0; i<this.allEnemyShips.length; i++) {
            let modulo = this.allEnemyShips[i].identifier % 10; //Modulo determines lines to which ship belong
            this.verticalLines[modulo].push(this.allEnemyShips[i]); //Add ship to his vertical line
        };
    }
    EnemyArmyConstructor.prototype.changeLine = function () { //This change horizontal lines after ships slow down
        for(let i=0; i<this.lines.length; i++) {
            this.lines[i] -= $('.game__board').height()*0.05;
        };
        this.checkLine(); 
    }
    EnemyArmyConstructor.prototype.checkLine = function () { //This function checks how low ships are 
        //First values: this.a == 0; this.lineClear == true;
        //Call the loop when first horizontal line will be lower than 200px
        //The loop searches horizontal rows of ships, if any from they are alive variable this.lineClear will be equal to false and we won`t do change horizontal line. Then if alive ship will have top position bigger than 80% of height game board, the game will be stopped and player lose.
        for (i=this.a; i<this.a+10 && this.lines[0] < 200; i++) {
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
    }
    EnemyArmyConstructor.prototype.setMoveSpeed = function () { //This function sets enemy ships speed of movement and game music
        if (player.killed == 49) {
            this.moveSpeed = 50;
            AUDIO_GAME2.pause();
            AUDIO_GAME3.play();
        }
        if (player.killed > 46 && player.killed < 49) {
            this.moveSpeed = 110;
            AUDIO_GAME1.pause();
            AUDIO_GAME2.play();
        }
        if (player.killed > 35 && player.killed < 46) {
            this.moveSpeed = 180;
            AUDIO_GAME.pause();
            AUDIO_GAME1.play();
        }
        if (player.killed > 15 && player.killed < 35) this.moveSpeed = 250;
    }
    EnemyArmyConstructor.prototype.movementSystem = function () {
        let position = undefined;
        let ship;
         let width = $('.game__board').width();
        for (i=0; i<this.allEnemyShips.length; i++) { //Every ship perform the specified movement
            if (!this.switchMove && !this.allEnemyShips[i].dead) this.allEnemyShips[i].move(0, 0);
            if (this.switchMove && !this.allEnemyShips[i].dead) this.allEnemyShips[i].move(1, 0);
        }
        var move = (() => {
            for (i=0; i<this.lines.length; i++) {
                //If that.switchMove === true, ships will be move to the right; fasle=left
                //If taht.switchMove is equal to true, script choose the last vertical row of ships (right); input k == 9; !switchMove input j == 0 (first row of ships)
                this.switchMove ? ship = this.verticalLines[this.k][i] : ship = this.verticalLines[this.j][i];
                if (!ship.dead) position = ship.getPosition(1); //If ship is alive, overwrite position variable at their .left value
                if ((position < width*0.05 && !this.switchMove) || (position > width*0.9 && this.switchMove)) { //If ship from left or right vertical row touch the edge, we call function changeLine to change worth horizontal lines
                //Ships slide down
                    for (i=0; i<this.allEnemyShips.length; i++) {
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
    }
    EnemyArmyConstructor.prototype.randomShoot = function() { //This function determines 
        if (enemyArmy.shootShips.length<2) return;
        let number = Math.floor(Math.random() * enemyArmy.shootShips.length); 
        enemyArmy.shootShips[number].attack(); //Random ship from shootShips array can will be shoot
        setTimeout(() => this.randomShoot(), 750);
    }

    return EnemyArmyConstructor;
}();


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
        $(this.ship).css('left', enemyArmy.spaceL + '%');
        $(this.ship).css('bottom', enemyArmy.spaceT + 'vh');

        this.setAnimation();
        this.animation();
    };
    setShoot() { 
        enemyArmy.shootShips.push(this); //Add ship to shootShips array
        this.shoot = true; //Can shoot - true
    };
    slideDown() { 
        let position = $(this.ship).position();
        $(this.ship).css('top', (position.top + $('.game__board').height()*0.05) + 'px');
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
    }
    animation() {
        if (this.dead && !startGame) return;
        $(this.ship).css('background-image', this.currentAnimation);
        if (this.currentAnimation == this.animation1) this.currentAnimation = this.animation2;
        else this.currentAnimation = this.animation1;
        setTimeout(() => this.animation(), enemyArmy.moveSpeed);
    }
    attack() {
        if(this.dead) return;
        let s = new EnemyBullet(1, this.ship);
        s.create();
    };
    destroyShip() { //This method is call when, ship will be shoot
        let id = parseInt(this.identifier);
        if (id < 40 && this.shoot) {
            let inArray = enemyArmy.shootShips.indexOf(this);
            enemyArmy.shootShips.splice(inArray, 1);
            this.shoot = false; //We change this dead ship that he can`t shoot
            let ship = enemyArmy.allEnemyShips[id+10]; //bierzemy statek nad zniszczonym statkiem
            this.grow = 10;
            if (ship.dead && id < 30) {
                this.grow +=10;
                ship = enemyArmy.allEnemyShips[id+this.grow];
                //If ship above current is not alive, we take ship abouve this dead ship
            }
            else if (ship.dead && id >= 40) return;
            ship.setShoot();
        }
        else { //If there is no ship higher
            let inArray = enemyArmy.shootShips.indexOf(this);
            if (inArray > -1) enemyArmy.shootShips.splice(inArray, 1);
            this.shoot = false; 
        }
        this.dead = true;
        AUDIO_INVADER_KILLED.play();
        $(this.ship).css('background-image', 'url("./images/destroyed.png")');
        setTimeout(() => $(this.ship).remove(), 200);
    };
    getPosition(type) {
        let position = $(this.ship).position();
        let positionL = position.left;
        let positionT = position.top;
        if (type == 0) { //.top
            return positionT;
        }
        else if (type == 1) { //.left
            return positionL;
        }
    };
    get identifier() { //Return id ship
        return this.ship.id;
    };
    get widthShip() { //Return width ship
        return $(this.ship).width();
    };
    get heightShip() { //Return height ship
        return $(this.ship).height();
    };
}


class MysteryShip extends Vehicle {
    constructor(style) {
        super(style);
        this.mysteryLine;
        this.dead = true;
    };
    setMysteryLine() { //Set line where is mystery ship 
        this.mysteryLine = $('body').height()*0.99 - $('body').width()*0.03;
    }
    destroy(animation) { //This method will destroy mystery ship when he will be shot down or he will be off the board
        this.dead = true;
        if (animation) {
           AUDIO_INVADER_KILLED.play();
            $(this.ship).css('background-image', 'url("./images/destroyedMystery.png")')
            setTimeout(() => $(this.ship).remove(), 250);
        }
        else $(this.ship).remove();
        AUDIO_MYSTERY_SHIP.pause();
    }
    checkShoot(bullet, playerBullet) { //This method checks whether mystery ships was shot down
        let position = $(this.ship).position();
        let pointA = position.left;
        let pointB = pointA + $(this.ship).width();

        if(playerBullet > pointA && playerBullet < pointB) {
            bullet.cassation();
            this.destroy(true);
            player.points += 200;
        }
    }
    movementSystem() {
        if (this.dead) return;
        let position = $(this.ship).position();
        if (position.left > $('.game__board').width() - $(this.ship).width() - 5) {
            this.destroy(false);
        }
        else {
            this.move(1);
            setTimeout(() => this.movementSystem(), 15);
        }
    }
    run() {
        if (!startGame) return;
        AUDIO_MYSTERY_SHIP.play();
        this.dead = false;
        mystery.createShip('mystery');
        mystery.movementSystem();
    }
}