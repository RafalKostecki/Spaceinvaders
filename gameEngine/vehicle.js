class Vehicle {
    constructor (shipType) {
        switch (shipType) { //Style object choice
            case 0: //Player ship style
                this.style = 'ship ship__player';
            break;
            case 1: //Enemy ship style
                this.style = 'ship ship__enemy ship--bg';
            break;
            case 2: //Mystery ship style
                this.style = 'ship ship__mystery ship--bg';
            break;
        }
    }
    createShip(id) { //Create HTML object and add to game board
        this.ship = document.createElement('div');
        this.ship.className = this.style;
        this.ship.id = id;
        $(this.ship).appendTo('.game__board');
    }
    move(type, typeShip) {
        if (!startGame) return;
        let position = $(this.ship).position();
        let step = 5; //This determines how big is step
        if (typeShip == 0) step = $('.game__board').width()*0.02; //Enemy ship step
        if (type == 0 && position.left > 5) { //Left
            $(this.ship).css('left', position.left - step + 'px');
        }
        else if (type == 1 && position.left < $('.game__board').width() - $(this.ship).width() - 5) { //Move right
            $(this.ship).css('left', position.left + step + 'px');
        }
    }
}
