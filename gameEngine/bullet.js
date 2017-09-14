class Bullet {
    constructor(bulletType, ship) {
        this.gameWindowHeight = $('.game__board').height(); //Get height game window
        let position = $(ship).position();
        this.leftSpace = position.left + ($(ship).width() / 2);
        switch (bulletType) {
            case 0:
                this.style = 'bullet bullet--player';
                this.bottom = this.gameWindowHeight - position.top; //Height of the player ship is the start bottom 
            break;
            case 1:
                this.style = 'bullet bullet--enemy';
                this.bottom = this.gameWindowHeight - position.top - $(ship).height() - 10;
            break;
        };
    };
    create() {
        this.bulletDiv = document.createElement('div'); //Create new element
        this.bulletDiv.className = this.style;
        $(this.bulletDiv).css('left', this.leftSpace); //This determines left position bullet
        $(this.bulletDiv).appendTo('.game__board');
        this.move();
    };
    cassation() { //This method destroy bullet
        $(this.bulletDiv).remove();
    };
    get bulletPosition() { //Get position.left of bullet
        let position = $(this.bulletDiv).position();
        return position.left;
    };
}


class PlayerBullet extends Bullet {
    constructor (style, bottom, leftSpace) {
        super(style, bottom, leftSpace);
        this.bulletSpeed = $('.game__board').height()/55;
    };
    move() {
        if (!startGame) return;
        this.bottom += this.bulletSpeed; //How many will be rise spacing from bottom side
        $(this.bulletDiv).css('bottom', this.bottom);
        if (this.bottom >= enemyArmy.lines[0] && this.bottom <= enemyArmy.lines[enemyArmy.lines.length-1] + this.bulletSpeed) { //It eliminates
            //to eliminuje niepotrzebne sprawdzenia przed pierwszą linią i za ostatnią linią;
            this.checkLine();
        };
        if (!mystery.dead && this.bottom >= mystery.mysteryLine && this.bottom <= mystery.mysteryLine + this.bulletSpeed) mystery.checkShoot(this, this.bulletPosition);
    
        this.bottom >= this.gameWindowHeight ? this.cassation() : setTimeout(() => this.move(), 10);
    };
    checkLine() { //This method check according to which lines should be check
      let scopeLine = 0;
        for (i=0; i<enemyArmy.lines.length; i++) {
            if (this.bottom >= enemyArmy.lines[i] && this.bottom < enemyArmy.lines[i] + this.bulletSpeed) { //This mark space between line and line increased by bulletSpeed
                scopeLine = i * 10;
                this.checkShoot(scopeLine, scopeLine+10);
            }
        }
    };
    checkShoot(scopeLineA, scopeLineB) { //This check whether enemy ship was shot down
        for (i=scopeLineA; i<scopeLineB; i++) {
            let pointA = enemyArmy.allEnemyShips[i].getPosition(1);
            let pointB = pointA + enemyArmy.allEnemyShips[i].widthShip;

            if (this.bulletPosition > pointA && this.bulletPosition < pointB && !enemyArmy.allEnemyShips[i].dead) { //If yes, ship and bullet will be destroy
                enemyArmy.allEnemyShips[i].destroyShip();
                this.cassation();
                player.killed += 1;
                player.accuracy;
                enemyArmy.setMoveSpeed();
                if (i<20) player.points += 10; //Points
                if (i>19 && i<40) player.points += 20;
                if (i> 39 && i<50) player.points += 30;
                document.getElementById('interfacePoints').innerHTML = player.points;
                if(player.killed == enemyArmy.allEnemyShips.length) { //If player shot down all enemy ships
                    INIT_GAME.nextLevel();
                }
            }
        }
    };
}


class EnemyBullet extends Bullet {
    constructor (style, bottom, leftSpace) {
        super(style, bottom, leftSpace);
    };
    move() {
        if(!startGame) return;
        this.bottom -= 5;
        $(this.bulletDiv).css('bottom', this.bottom);
        if(this.bottom <= player.gamerLine && this.bottom >= player.gamerLine - 5) {
            this.checkAttack(); 
        }
        this.bottom <= 20 ? this.cassation() : setTimeout(() => this.move(), 20);
    };
    checkAttack() { //This method checks whether bullet is on player line
        let position = $('.ship__player').position();
        let pointA = position.left;
        let pointB = pointA + $('.ship__player').width();
        if(this.bulletPosition > pointA && this.bulletPosition < pointB) { //If is
            AUDIO_EXPLOSION.play();
            if (player.lives > 0) {
                this.cassation();
                $('#live'+player.lives).remove();
                player.lives--;
            }
            if (player.lives==0) INIT_GAME.clearGame();
        }
    };
}
