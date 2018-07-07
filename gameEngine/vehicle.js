class Vehicle {
  constructor (shipType) {
    switch (shipType) {
      case 0: //Player ship
        this.style = 'ship ship__player';
      break;
      case 1: //Enemy ship
        this.style = 'ship ship__enemy ship--bg';
      break;
      case 2: //Mystery ship
        this.style = 'ship ship__mystery ship--bg';
      break;
    }
  };


  createShip(id) { //Create HTML object and add to game board
    const gameBoard = document.getElementById('gameBoard');

    this.ship = document.createElement('div');
    this.ship.className = this.style;
    this.ship.id = id;
    gameBoard.appendChild(this.ship);
  };

  move(type, typeShip) {
    if (!startGame) return;

    const gameBoard = document.getElementById('gameBoard');
    const x = window.getComputedStyle(this.ship, null).getPropertyValue('left');
    const left = this.ship.style.left === '' ? x : this.ship.style.left;
    const lastChar = left.substr(left.length - 1);
    const leftSpace = lastChar === '%' ? gameBoard.clientWidth*(parseInt(left)/100) : parseInt(left); //We have to define leftSpace from percentage to px
    let step; //This determines how big is step

    if (typeShip == 0) step = gameBoard.clientWidth*0.03; //Enemy ship step
    else step = 5;

    if (type == 0 && leftSpace > 5) { //Left
      this.ship.style.left = leftSpace - step + 'px';
    }
    else if (type == 1 && leftSpace < gameBoard.clientWidth - this.ship.clientWidth - 5) { //Right
      this.ship.style.left = leftSpace + step + 'px';
    }

  };

}
