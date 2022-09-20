const main = document.querySelector(".main");
const score = document.querySelector("#score");
const level = document.querySelector("#level");
const figure = document.querySelector("#next-figure");

const lengthOfField = 10;

const figures = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
];

let fieldOfGame = Array(20).fill(Array(10)).fill(0);

let scoreCounter = 0;
let currentLevel = 1;
let parametersOfGame = {
    scorePerLine: 10,
    speed: 400,
    nextLevelScore: 50
};

let activeFigure = getNewRandomFigure();
let nextFigure = getNewRandomFigure();

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

function drawNextFigure() {
    let nextFigureInnerHTML = "";
    for (let y = 0; y < nextFigure.shape.length; y++) {
        for (let x = 0; x < nextFigure.shape[y].length; x++) {
            if (nextFigure.shape[y][x] === 1) {
                nextFigureInnerHTML += "<div class='cell movingCell'></div>";
            } else {
                nextFigureInnerHTML += "<div class='cell'></div>";
            }
        }
        nextFigureInnerHTML += "<br/>"
    }
    figure.innerHTML = nextFigureInnerHTML;
}

function hasCollisions() {
    for (let y = 0; y < activeFigure.shape.length; y++) {
        for (let x = 0; x < activeFigure.shape[y].length; x++) {
            if (
                activeFigure.shape[y][x]
                && (fieldOfGame[activeFigure.y + y] === undefined
                    || fieldOfGame[activeFigure.y + y][activeFigure.x + x] === undefined
                    || fieldOfGame[activeFigure.y + y][activeFigure.x + x] === -1)

            ) {
                return true;
            }
        }
    }

    return false;
}

function removePreviousActiveFigure() {
    for (let y = 0; y < fieldOfGame.length; y++) {
        for (let x = 0; x < fieldOfGame[y].length; x++) {
            if (fieldOfGame[y][x] === 1) {
                fieldOfGame[y][x] = 0;
            }
        }
    }
}

function addActiveFigure() {
    removePreviousActiveFigure();

    for (let y = 0; y < activeFigure.shape.length; y++) {
        for (let x = 0; x < activeFigure.shape[y].length; x++) {
            if (activeFigure.shape[y][x] === 1) {
                fieldOfGame[activeFigure.y + y][activeFigure.x + x] =
                    activeFigure.shape[y][x];
            }
        }
    }
}

function rotateActiveFigure() {
    const previousFigureState = activeFigure.shape;

    activeFigure.shape = activeFigure.shape[0].map(
        (val, index) =>
            activeFigure.shape.map(
                row => row[index]
            ).reverse()
    );

    if (hasCollisions()) {
        activeFigure.shape = previousFigureState;
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
}

function removeFullLines() {
    let canRemoveLine = true;
    let removedLines = 0;

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
            removedLines += 1;
        }

        canRemoveLine = true;
    }

    let bonus = 0;
    switch (removedLines) {
        case 1:
            bonus = 1;
            break;
        case 2:
            bonus = 3;
            break;
        case 3:
            bonus = 6;
            break;
        case 4:
            bonus = 12;
            break;
    }

    scoreCounter += parametersOfGame.scorePerLine * bonus;
    score.innerHTML = scoreCounter;

    if (scoreCounter >= parametersOfGame.nextLevelScore) {
        currentLevel++;
        level.innerHTML = currentLevel;
        parametersOfGame.scorePerLine += 5;
        parametersOfGame.speed -= 50;
        parametersOfGame.nextLevelScore *= 2;
    }
}

function getNewRandomFigure() {
    const randomIndex = Math.floor(Math.random() * figures.length);
    const figure = figures[randomIndex];

    return {
        x: Math.floor((lengthOfField - figure[0].length) / 2),
        y: 0,
        shape: figure
    };
}

function moveFigureDown() {
    activeFigure.y += 1;
    if (hasCollisions()) {
        activeFigure.y -= 1;
        fixFigure();
        activeFigure = nextFigure;
        nextFigure = getNewRandomFigure();
        drawNextFigure();
    }
}

function moveFigureLeft() {
    activeFigure.x -= 1;
    if (hasCollisions()) {
        activeFigure.x += 1;
    }
}

function moveFigureRight() {
    activeFigure.x += 1;
    if (hasCollisions()) {
        activeFigure.x -= 1;
    }
}

function dropFigure() {
    for (let y = activeFigure.y; y < fieldOfGame.length; y++) {
        activeFigure.y += 1;
        if (hasCollisions()) {
            activeFigure.y -= 1;
            break;
        }
    }
}

document.onkeydown = (event) => {
    if (event.keyCode === 37) {
        moveFigureLeft();
    } else if (event.keyCode === 38) {
        rotateActiveFigure();
    } else if (event.keyCode === 39) {
        moveFigureRight();
    } else if (event.keyCode === 40) {
        moveFigureDown();
    } else if (event.keyCode === 32) {
        dropFigure();
    }

    addActiveFigure();
    drawField();
}

function startGame() {
    moveFigureDown();
    addActiveFigure();
    drawField();
    setTimeout(startGame, parametersOfGame.speed);
}

addActiveFigure();
drawField();
setTimeout(startGame, parametersOfGame.speed);
