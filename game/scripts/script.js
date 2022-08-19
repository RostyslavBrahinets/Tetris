const main = document.querySelector(".main");
const score = document.querySelector("#score");
const level = document.querySelector("#level");

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

let fieldOfGame = [
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let scoreCounter = 0;
let currentLevel = 1;
let parametersOfGame = {
    scorePerLine: 10,
    speed: 400,
    nextLevelScore: 50
};

let activeFigure = {
    x: 0,
    y: 0,
    shape: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
};

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
    }
}

function getNewRandomFigure() {
    const randomIndex = Math.floor(Math.random() * figures.length);
    return figures[randomIndex];
}

function moveFigureDown() {
    activeFigure.y += 1;
    if (hasCollisions()) {
        activeFigure.y -= 1;
        fixFigure();
        activeFigure.shape = getNewRandomFigure();
        activeFigure.x = Math.floor((lengthOfField - activeFigure.shape[0].length) / 2);
        activeFigure.y = 0;
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

document.onkeydown = (event) => {
    if (event.keyCode === 37) {
        moveFigureLeft();
    } else if (event.keyCode === 38) {
        rotateActiveFigure();
    } else if (event.keyCode === 39) {
        moveFigureRight();
    } else if (event.keyCode === 40) {
        moveFigureDown();
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
