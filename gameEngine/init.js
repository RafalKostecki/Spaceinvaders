//Sounds
const AUDIO_INVADER_KILLED = new Audio('./music/invaderkilled.wav'); 
const AUDIO_MYSTERY_SHIP = new Audio('./music/mysteryShip.wav'); //Mystery ship music
const AUDIO_SHOOT = new Audio('./music/shoot.wav'); //Player shoot audio
const AUDIO_EXPLOSION = new Audio('./music/explosion.wav'); 
const AUDIO_GAME = new Audio('./music/fastinvader4.wav'); //Game music, slow step: 4
const AUDIO_GAME1 = new Audio('./music/fastinvader3.wav'); //Game music, slow step: 3
const AUDIO_GAME2 = new Audio('./music/fastinvader2.wav'); //Game music, slow step: 2
const AUDIO_GAME3 = new Audio('./music/fastinvader1.wav'); //Game music, slow step: 1
AUDIO_MYSTERY_SHIP.loop = true;
AUDIO_GAME.loop = true;
AUDIO_GAME1.loop = true;
AUDIO_GAME2.loop = true;
AUDIO_GAME3.loop = true;

player = undefined;
enemyArmy = undefined;
mystery = undefined;
var startGame = false;
$(function () { //We create events for buttons
    let startButton = document.querySelector('.interface__startGame');
    startButton.addEventListener('click', () => initGame.startGame());
    let leftButton = document.querySelector('.movement--left');
    leftButton.addEventListener('mousedown', () => manualMovement.keyDown(0));
    leftButton.addEventListener('mouseup', () => manualMovement.keyUp());
    let rightButton = document.querySelector('.movement--right');
    rightButton.addEventListener('mousedown', () => manualMovement.keyDown(1));
    rightButton.addEventListener('mouseup', () => manualMovement.keyUp());
});

$(document).keydown((b) => { 
    initGame.keyDown(b);
    if(b.keyCode == 32 && startGame) player.shoot(); //If player press space button, player ship will shoot
});
$(document).keyup((a) => { //When key up, this stop loop
    initGame.keyUp(a);
});

var initGame = {
    _typeKey: null,
    _loopOperator: true,
    _startKey: null,
    _keyMove: [65, 37, 68, 39], //This is key code of buttons which determines move player
    board: 1,
    bullets: 0,
    accuracy: 0,

    startGame: function() {
        if ($(window).width() < 600) {
           alert('Zbyt mała rozdzielczość urządzenia by uruchomić grę!');
           return;
        }
        startGame = true;
        document.getElementById('interfaceBoard').innerHTML = this.board;
        document.getElementById('interfaceBullets').innerHTML = this.bullets;
        player = new PlayerShip(0);
        this.createArmy();
        player.createShip('player');
        player.createPlayerLine();
        AUDIO_GAME.play();
        let attackButton = document.querySelector('.movement__attack');
        attackButton.addEventListener('click', () => player.shoot());
    },
    clearGame: function() { //Clear all game attrigutes, switches, etc.
        startGame = false;
        document.getElementById('interfaceBoard').innerHTML = '';
        document.getElementById('interfaceBullets').innerHTML = '';
        this.board = 1;
        this.bullets = 0;
        this.accuracy = 0;
        player.points = 0;
        this.deleteBullets();
        this.deleteArmy();
        delete player;
        $('.ship__player').remove();
        this.clearSounds();
        for (let i=1; i<6; i++) { //Restart players lives (interface)
            let y = document.getElementById('live'+i);
            if(y===null) {
                let x = document.createElement('div');
                x.className = 'lives__box lives--icon';
                x.id = 'live'+i;
                $(x).appendTo('.lives');
            }
        }
    },
    nextLevel: function() {
        startGame = false;
        this.board++;
        this.bullets = 0;
        document.getElementById('interfaceBullets').innerHTML = this.bullets;
        document.getElementById('interfaceBoard').innerHTML = this.board;
        this.deleteBullets();
        this.clearSounds();
        setTimeout(() => {
            this.deleteArmy();
            player.killed = 0;
            startGame = true;
            this.createArmy();
            AUDIO_GAME.play();
        }, 1000)
    },
    createArmy: function() {
        enemyArmy = new EnemyArmy();
        enemyArmy.createArmy();
        mystery = new MysteryShip(2);
        mystery.setMysteryLine();
        let number = Math.floor(Math.random() * 17000); 
        setTimeout(() => mystery.run(), number);
    },
    deleteBullets: function() {
        let bullets = document.querySelectorAll('.bullet');
        for (i=0; i<bullets.length; i++) {
            bullets[i].remove();
        }
    },
    deleteArmy: function() {
        for(i=0; i<enemyArmy.allEnemyShips.length; i++) {
            enemyArmy.allEnemyShips[i].ship.remove();
           delete  enemyArmy.allEnemyShips[i];
           
        }
        $('.ship__mystery').remove();
        enemyArmy.allEnemyShips = [];
        delete enemyArmy;
        delete mystery;
    },
    clearSounds: function() {
        AUDIO_GAME.pause();
        AUDIO_GAME1.pause();
        AUDIO_GAME2.pause();
        AUDIO_GAME3.pause();
        AUDIO_MYSTERY_SHIP.pause();
    },
    keyDown: function(b) {
        if (!(this._keyMove.indexOf(b.keyCode) > -1) || !startGame) return; //If player pressed key of wasd or arraows on keyboard
        _startKey = true;
        if (b.keyCode == 65 || b.keyCode == 37) this.move(0, 1); //Left; Run inside move function
        else this.move(1, 1); //Right
       
        this._typeKey = b.keyCode;
    },
    keyUp: function(a) { ///If player pressed key of wasd or arraows on keyboard, the move will be stopped
        if (!(this._keyMove.indexOf(a.keyCode) > -1)) return;
        _startKey = false;
    },
    operator: function(type) {
        this._loopOperator = true;
        this.move(type, 1);
    },
    move: function(type) {
        if (this._loopOperator && _startKey && type != undefined && startGame) {
            this._loopOperator = false;
            player.move(type); //Do step
            setTimeout(() => this.operator(type), 10); //Do next step after 0.01 sec
        }
    }
};

var manualMovement = {
    _timeMove: 10,
    _canMove: false,
    _cantDoubleMove: true,

    keyDown: function(type) { //0-left, 1-right
        if (!startGame) return;
        _canMove = true;
        this.moveLoop(type)
    },
    keyUp: function() {
        if (!startGame) return;
        _canMove = false;
    },
    helper: function() {
        setTimeout(() => this._cantDoubleMove = true, this._timeMove)
    },
    moveLoop: function(type) {
        if(!_canMove || !this._cantDoubleMove || player===undefined) return;
        player.move(type);
        this._cantDoubleMove = false;
        this.helper();
        setTimeout(() => this.moveLoop(type), this._timeMove);
    },
}
