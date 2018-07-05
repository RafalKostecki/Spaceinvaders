//Sounds
const audioInvaderKilled = new Audio('./music/invaderkilled.wav');
const audioMysteryShip = new Audio('./music/mysteryShip.wav'); //Mystery ship music
const audioShot = new Audio('./music/shoot.wav'); //Player shoot audio
const audioExplosion = new Audio('./music/explosion.wav');
const audioGame = new Audio('./music/fastinvader4.wav'); //Game music, slow step: 4
const audioGame1 = new Audio('./music/fastinvader3.wav'); //Game music, slow step: 3
const audioGame2 = new Audio('./music/fastinvader2.wav'); //Game music, slow step: 2
const audioGame3 = new Audio('./music/fastinvader1.wav'); //Game music, slow step: 1
audioMysteryShip.loop = true;
audioGame.loop = true;
audioGame1.loop = true;
audioGame2.loop = true;
audioGame3.loop = true;

player = undefined;
enemyArmy = undefined;
mystery = undefined;
let startGame = false;

$.fn.extend({
  disableSelection: function() {
    this.each(function() {
      this.onselectstart = function() {
        return false;
      };
      this.unselectable = "on";
      $(this).css('-moz-user-select', 'none');
      $(this).css('-webkit-user-select', 'none');
    });
  }
});
$(function(){
  $(this).disableSelection();
});

const initGame = {
  board: 1,
  bullets: 0,
  accuracy: 0,

  startGame: function() {
    if (window.innerWidth < 600) {
       alert('Your screen is too small to run game! :<');
       return;
    }
    if (startGame) return;
      startGame = true;
      document.getElementById('interfaceBoard').innerHTML = this.board;
      document.getElementById('interfaceBullets').innerHTML = this.bullets;
      player = new PlayerShip(0);
      this.createArmy();
      player.createShip('player');
      player.createPlayerLine();
      audioGame.play();
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
    for (let i=1; i<6; i++) { //Restart players lifes (interface)
      const lifes = document.getElementById('lifesId');
      let y = document.getElementById('life'+i);
      if(y===null) {
        let x = document.createElement('div');
        x.className = 'life__box life--icon';
        x.id = 'life'+i;
        lifes.appendChild(x);
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
      audioGame.play();
    }, 1000)
  },

  createArmy: function() {
    enemyArmy = new EnemyArmy();
    mystery = new MysteryShip(2);

    enemyArmy.createArmy();
    mystery.setMysteryLine();
    const number = Math.floor(Math.random() * 17000);
    setTimeout(() => mystery.run(), number);
  },

  deleteBullets: function() {
    const bullets = document.querySelectorAll('.bullet');
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
    audioGame.pause();
    audioGame1.pause();
    audioGame2.pause();
    audioGame3.pause();
    audioMysteryShip.pause();
  }
}
