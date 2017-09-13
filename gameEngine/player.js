class PlayerShip extends Vehicle {
    constructor(style) {
        super(style);
        this.lives = 5;
        this.killed = 0;
        this.points = 0;
        this.canShoot = true;
    };
    
    shoot() {
        if (!this.canShoot || !startGame) return;
        this.canShoot = false;
        AUDIO_SHOOT.play();
        let s = new PlayerBullet(0, this.ship);
        s.create();
        initGame.bullets++;
        document.getElementById('interfaceBullets').innerHTML = initGame.bullets;
        player.accuracy;
        setTimeout(() => this.canShoot = true, 450); //How fast player can shoot
    }
    createPlayerLine() { //this create line where is player, where is he can be hit by enemy ship
        let position = $('.ship__player').position();
        this.gamerLine = $('.game__board').height() - position.top;
    }
    get accuracy() { //The accuracy of the player
        let accuracy = (player.killed / initGame.bullets) * 100;
        document.getElementById('interfaceAccuracy').innerHTML = accuracy.toFixed(2) + '%';
    }
}