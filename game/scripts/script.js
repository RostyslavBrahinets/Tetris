let main = document.querySelector(".main");

let fieldOfGame = [
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, -1, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, -1, -1, 0, 0, 0, 0]
];

let gameSpeed = 400;

function drawField() {
    let mainInnerHTML = "";
    for (let y = 0; y < fieldOfGame.length; y++) {
        for (let x = 0; x < fieldOfGame[y].length; x++) {
            if (fieldOfGame[y][x] === 1) {
                mainInnerHTML += "<div class='cell movingCell'></div>";
            } else if (fieldOfGame[y][x] === -1) {
                mainInnerHTML += "<div class='cell fixedCell'></div>";
            } else {
                mainInnerHTML += "<div class='cell'></div>";
            }
        }
    }
    main.innerHTML = mainInnerHTML;
}

function canFigureMoveLeft() {
    for (let y = 0; y < fieldOfGame.length; y++) {
        for (let x = 0; x < fieldOfGame[y].length; x++) {
            if (fieldOfGame[y][x] === 1) {
                if (x === 0 || fieldOfGame[y][x - 1] === -1) {
                    return false;
                }
            }
        }
    }

    return true;
}

function moveFigureLeft() {
    if (canFigureMoveLeft()) {
        for (let y = fieldOfGame.length - 1; y >= 0; y--) {
            for (let x = 0; x < fieldOfGame[y].length; x++) {
                if (fieldOfGame[y][x] === 1) {
                    fieldOfGame[y][x - 1] = 1;
                    fieldOfGame[y][x] = 0;
                }
            }
        }
    }
}

function canFigureMoveRight() {
    for (let y = 0; y < fieldOfGame.length; y++) {
        for (let x = 0; x < fieldOfGame[y].length; x++) {
            if (fieldOfGame[y][x] === 1) {
                if (x === fieldOfGame[y].length - 1 || fieldOfGame[y][x + 1] === -1) {
                    return false;
                }
            }
        }
    }

    return true;
}

function moveFigureRight() {
    if (canFigureMoveRight()) {
        for (let y = fieldOfGame.length - 1; y >= 0; y--) {
            for (let x = fieldOfGame[y].length - 1; x >= 0; x--) {
                if (fieldOfGame[y][x] === 1) {
                    fieldOfGame[y][x + 1] = 1;
                    fieldOfGame[y][x] = 0;
                }
            }
        }
    }
}

function canFigureMoveDown() {
    for (let y = 0; y < fieldOfGame.length; y++) {
        for (let x = 0; x < fieldOfGame[y].length; x++) {
            if (fieldOfGame[y][x] === 1) {
                if (y === fieldOfGame.length - 1 || fieldOfGame[y + 1][x] === -1) {
                    return false;
                }
            }
        }
    }

    return true;
}

function moveFigureDown() {
    if (canFigureMoveDown()) {
        for (let y = fieldOfGame.length - 1; y >= 0; y--) {
            for (let x = 0; x < fieldOfGame[y].length; x++) {
                if (fieldOfGame[y][x] === 1) {
                    fieldOfGame[y + 1][x] = 1;
                    fieldOfGame[y][x] = 0;
                }
            }
        }
    } else {
        fixFigure();
    }
}

function fixFigure() {
    for (let y = 0; y < fieldOfGame.length; y++) {
        for (let x = 0; x < fieldOfGame[y].length; x++) {
            if (fieldOfGame[y][x] === 1) {
                fieldOfGame[y][x] = -1;
            }
        }
    }

    removeFullLines();

    fieldOfGame[0] = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
    fieldOfGame[1] = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
}

function removeFullLines() {
    let canRemoveLine = true;

    for (let y = 0; y < fieldOfGame.length; y++) {
        for (let x = 0; x < fieldOfGame[y].length; x++) {
            if (fieldOfGame[y][x] !== -1) {
                canRemoveLine = false;
                break;
            }
        }

        if (canRemoveLine) {
            fieldOfGame.splice(y, 1);
            fieldOfGame.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }

        canRemoveLine = true;
    }
}

function startGame() {
    moveFigureDown()
    drawField()
    setTimeout(startGame, gameSpeed);
}

document.onkeydown = (event) => {
    if (event.keyCode === 37) {
        moveFigureLeft();
    } else if (event.keyCode === 39) {
        moveFigureRight();
    } else if (event.keyCode === 40) {
        moveFigureDown();
    }

    drawField();
}

drawField();
setTimeout(startGame, gameSpeed);
