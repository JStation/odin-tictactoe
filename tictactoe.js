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

    const reset = () => {
        for (let i=0;i<board.length;i++) {
            board[i] = null;
        }
    }

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

    // for TESTING
    const checkBoard = () => {
        console.log(`checkBoardIsWon: ${checkBoardIsWon()}`);
        console.log(`checkBoardIsTied: ${checkBoardIsTied()}`);
    }

    // check board for winner
    // start with brute force -- scan rows columns and diagonals
    const checkBoardIsWon = () => {
        let b = board;
        // check rows
        if (b[0] == b[1] && b[1] == b[2] && b[2] != null) return true;
        if (b[3] == b[4] && b[4] == b[5] && b[5] != null) return true;
        if (b[6] == b[7] && b[7] == b[8] && b[8] != null) return true;

        // check columns
        if (b[0] == b[3] && b[3] == b[6] && b[6] != null) return true;
        if (b[1] == b[4] && b[4] == b[7] && b[7] != null) return true;
        if (b[2] == b[5] && b[5] == b[8] && b[8] != null) return true;

        // check diagonals
        if (b[0] == b[4] && b[4] == b[8] && b[8] != null) return true;
        if (b[2] == b[4] && b[4] == b[6] && b[6] != null) return true;

        // no winner found
        return false;
    }


    // check board for tie -- expects to already be checked for won condition
    const checkBoardIsTied = () => {
        // if the board is missing empty space; game is tied
        return !board.includes(null);
    }

    // check if cell is empty/legal for place
    const isValidMove = (index) => {
        return board[index] === null;
    }

    // mark cell in gameboard
    const setMarkOnCell = (index, mark) => {
        board[index] = mark;
    }

    // return exposed functions and data (public)
    return {
        getBoard,
        randomizeBoard,
        isValidMove,
        setMarkOnCell,
        checkBoard,
        checkBoardIsWon,
        checkBoardIsTied,
        reset,
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
            cell.addEventListener("click", Game.clickCell);
            grid.appendChild(cell);
            cells.push(cell);
        }
    };

    const drawCell = (index) => {
        // update class and mark on specified cell
        let board = Gameboard.getBoard();
        let state = board[index];
        if (state == "X") {
            // update class on cell
            cells[index].classList.add("filled");
            // draw mark
            cells[index].innerText = "X";
        } else if (state == "O") {
            // update class on cell
            cells[index].classList.add("filled");
            // draw mark
            cells[index].innerText = "O";
        } else {
            // update class on cell
            cells[index].classList.remove("filled");
            // remove marks
            cells[index].innerText = "";
        }
    };

    const drawAllCells = () => {
        for (let i = 0;i < cells.length;i++) {
            drawCell(i);
        }
    };

    const setInfoMessage = (msg) => {
        const info = document.querySelector(".info");
        info.innerText = msg;
    };

    return {
        createGridCells,
        drawCell,
        drawAllCells,
        setInfoMessage,
    };
})();

const Game = (() => {
    let isPlayerOneTurn = true;
    let gameOver = false;
    let playerOne = Player("P1", "X");
    let playerTwo = Player("P2", "O");

    const clickCell = (evt) => {
        let index = evt.currentTarget.dataset.index;
        // is game over? bail
        if (gameOver == true) return;
        // is move valid? bail if not
        if (!Gameboard.isValidMove(index)) return;
        // find activePlayer
        let player = getActivePlayer();
        // make move
        Gameboard.setMarkOnCell(index, player.getMark());
        // redraw cell
        DisplayController.drawCell(index);
        // check for win
        if (Gameboard.checkBoardIsWon()) {
            gameWon(); 
        // ...or a draw
        } else if (Gameboard.checkBoardIsTied()) {
            gameTied();
        // ...or keep playing
        } else {
            nextPlayer();
        }
    }

    const nextPlayer = () => {
        isPlayerOneTurn = !isPlayerOneTurn;
        let player = getActivePlayer();
        DisplayController.setInfoMessage(`${player.getName()}'s turn. Place an ${player.getMark()}`);
    }

    const gameWon = () => {
        gameOver = true;
        let player = getActivePlayer();
        DisplayController.setInfoMessage(`${player.getName()} Wins!`);
        endGame();

    }

    const gameTied = () => {
        gameOver = true;
        DisplayController.setInfoMessage("Tie Game!");
        endGame();
    }

    const endGame = () => {
        // TODO: blur board slightly? to indicate not active
        // create new game button below info box
        const body = document.body;
        const button = document.createElement("button");
        button.setAttribute("id", "newGameButton");
        button.innerText = "New Game";
        button.addEventListener("click", newGame);
        body.appendChild(button);
    }

    const newGame = () => {
        // reset board
        Gameboard.reset()
        // reset game variables
        isPlayerOneTurn = false; // rolled over by nextPlayer function
        gameOver = false;
        // remove newGame button
        const button = document.querySelector("#newGameButton");
        button.remove();
        // redraw board
        DisplayController.drawAllCells();
        // update message
        nextPlayer();
    }

    const getActivePlayer = () => {
        if (isPlayerOneTurn) {
            return playerOne;
        } else {
            return playerTwo;
        }
    }

    return {
        isPlayerOneTurn,
        clickCell,
    }
})();

// Build board
DisplayController.createGridCells();