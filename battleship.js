const gameData = {
    ships: [
        { name: 'ship1', orientation: 'vertical', size: 4, coords: [2, 3] },
        { name: 'ship2', orientation: 'horizontal', size: 3, coords: [3, 3] },
        { name: 'ship3', orientation: 'vertical', size: 2, coords: [6, 5] }
    ]
};

// Ship class to represent each ship
class Ship {
    constructor(name, orientation, size, coords) {
        this.name = name;
        this.orientation = orientation;
        this.size = size;
        this.coords = this.getCoordinates(coords);
        this.hits = [];
    }

    // Calculates all coordinates occupied by the ship
    getCoordinates(start) {
        let [col, row] = start;
        let coordinates = [];
        for (let i = 0; i < this.size; i++) {
            if (this.orientation === 'horizontal') {
                coordinates.push([col + i, row]);
            } else {
                coordinates.push([col, row + i]);
            }
        }
        return coordinates;
    }

    // Checks if a coordinate is a hit
    hit(coord) {
        this.hits.push(coord.toString());
        return this.isSunk();
    }

    // Determines if the ship is completely sunk
    isSunk() {
        return this.hits.length === this.size;
    }
}

// Board class to represent the game board
class Board {
    constructor(size) {
        this.size = size;
        this.ships = [];
        this.guesses = [];
    }

    // Initializes the board
    buildBoard() {
        this.ships = [];
        this.guesses = [];
    }

    // Places ships on the board using data from gameData
    placeShips(shipData) {
        this.ships = shipData.map(ship => new Ship(ship.name, ship.orientation, ship.size, ship.coords));
    }

    // Checks if a guess is a hit or a miss
    checkHit(coord) {
        for (let ship of this.ships) {
            for (let position of ship.coords) {
                if (position.toString() === coord.toString()) {
                    let sunk = ship.hit(coord);
                    return sunk ? 'sunk' : 'hit';
                }
            }
        }
        return 'miss';
    }
}

// Game class to manage the gameplay
class Game {
    constructor() {
        this.board = new Board(6);
        this.board.buildBoard();
        this.board.placeShips(gameData.ships);
        this.remainingGuesses = 20;
        this.createBoard();
    }

    // Creates the 6x6 grid and attaches event listeners
    createBoard() {
        const grid = document.getElementById("grid");
        grid.innerHTML = "";
        for (let r = 1; r <= 6; r++) {
            for (let c = 1; c <= 6; c++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.coord = `${c},${r}`;
                cell.addEventListener("click", (e) => this.handleGuess(e));
                grid.appendChild(cell);
            }
        }
    }

    // Handles user guesses
    handleGuess(event) {
        if (this.remainingGuesses <= 0) return;

        let coord = event.target.dataset.coord.split(",").map(Number);
        if (this.board.guesses.includes(coord.toString())) return;

        this.board.guesses.push(coord.toString());
        this.remainingGuesses--;
        let result = this.board.checkHit(coord);

        event.target.classList.add(result);
        if (this.isGameOver()) this.revealShips();
    }

    // Checks if the game is over
    isGameOver() {
        return this.board.ships.every(ship => ship.isSunk()) || this.remainingGuesses <= 0;
    }

    // Reveals the locations of the ships when the game is over
    revealShips() {
        this.board.ships.forEach(ship => {
            ship.coords.forEach(([c, r]) => {
                document.querySelector(`[data-coord='${c},${r}']`).classList.add("ship");
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => new Game());
