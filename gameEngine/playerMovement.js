const playerMovement = {
  typeKey: null,
  loopOperator: true,
  startKey: null,

  keyDown: function(event) {
    startKey = true;
    if (event.keyCode == 65 || event.keyCode == 37) this.move(0, 1); //Left
    else this.move(1, 1); //Right
    this.typeKey = event.keyCode;
  },

  keyUp: function() { //If player pressed key of wasd or arrows on keyboard, the move will be stopped
    startKey = false;
  },

  operator: function(type) {
    this.loopOperator = true;
    this.move(type, 1);
  },

  move: function(type) {
    if (this.loopOperator && startKey && type != undefined && startGame) {
      this.loopOperator = false;
      player.move(type); //Do step
      setTimeout(() => this.operator(type), 10); //Do next step after 0.01 sec
    }
  }
}


document.addEventListener('keydown', (event) => {
  if (!startGame) return;

  const keyMove = [65, 37, 68, 39];
  if (keyMove.indexOf(event.keyCode) > -1) playerMovement.keyDown(event); //If player pressed key of wasd or arraows on keyboard
  if(event.keyCode == 32) player.shoot(); //If player press space button, player ship will shoot
});

document.addEventListener('keyup', (event) => {
  const keyMove = [65, 37, 68, 39];
  if (keyMove.indexOf(event.keyCode) > -1) playerMovement.keyUp(event);
});
