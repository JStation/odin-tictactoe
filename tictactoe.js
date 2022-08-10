console.log("tictactoe.js loaded")

/* 
Note from project page:
Minimize global code by using modules and factories
If there is one of something use a module
If there are multiples create them with factories
*/

// IIFE - Immediately Invoked Function Expression
// Module pattern carves namespace for gameBoard operations/data
const Gameboard = (() => {
    const board = new Array(9).fill(null);

    const getBoard = () => board;

    // for TESTING
    const randomizeBoard = () => {
        for (let i=0;i<board.length;i++) {
            let roll = Math.random();
            if (roll < .4) {
                board[i] = "X";
            } else if (roll < .8) {
                board[i] = "O";
            } else {
                board[i] = null;
            }
        }
    }

    // return exposed functions and data (public)
    return {
        getBoard,
        randomizeBoard,
    };
})();

// Player object attaches a name to a mark
// Factory generates player objects at beginning of game
const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark; // "X" or "O"

    return {getName, getMark};
};

// Display concerns classes and marks in the grid
// relies on data-index for mapping to gameboard
const DisplayController = (() => {
    const grid = document.querySelector(".grid-container");
    const cells = [];

    const createGridCells = () => {
        for (let i = 0;i<9;i++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.index = i;
            grid.appendChild(cell);
            cells.push(cell);
        }
    };

    const drawCell = (index) => {
        // update class and mark on specified cell
        let board = Gameboard.getBoard();
        let state = board[index];
        console.log({state});
        if (state == "X") {
            // update class on cell
            cells[index].classList.add("filled");
            // draw mark
            cells[index].innerText = "X";
            console.log("Draw X")
        } else if (state == "O") {
            // update class on cell
            cells[index].classList.add("filled");
            // draw mark
            cells[index].innerText = "O";
            console.log("Draw O");
        } else {
            // update class on cell
            cells[index].classList.remove("filled");
            // remove marks
            cells[index].innerText = "";
            console.log("Clear cell");
        }
    };

    const drawAllCells = () => {
        for (let i = 0;i < cells.length;i++) {
            drawCell(i);
        }
    };

    return {
        createGridCells,
        drawCell,
        drawAllCells,
    };
})();

// Build board
DisplayController.createGridCells();

const Game = (() => {
    let isPlayerOneTurn = true;

    return {
        isPlayerOneTurn,
    }
})();