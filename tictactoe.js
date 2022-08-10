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

    // return exposed functions and data (public)
    return {
        getBoard,
    };
})();

const DisplayController = (() => {
    const grid = document.querySelector(".grid-container");

    const drawBoardElements = () => {
        for (let i = 0;i<9;i++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.index = i;
            grid.appendChild(cell);
        }

    };

    return {
        drawBoardElements,
    };
})();

// Build board
DisplayController.drawBoardElements();