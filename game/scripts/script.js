let main = document.querySelector(".main");

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

let gameSpeed = 400;

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
            if (activeFigure.shape[y][x]) {
                fieldOfGame[activeFigure.y + y][activeFigure.x + x] =
                    activeFigure.shape[y][x];
            }
        }
    }
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

document.onkeydown = (event) => {
    if (event.keyCode === 37) {
        activeFigure.x -= 1;
        if (hasCollisions()) {
            activeFigure.x += 1;
        }
    } else if (event.keyCode === 39) {
        activeFigure.x += 1;
        if (hasCollisions()) {
            activeFigure.x -= 1;
        }
    } else if (event.keyCode === 40) {
        activeFigure.y += 1;
        if (hasCollisions()) {
            activeFigure.y -= 1;
            fixFigure();
            activeFigure.y = 0;
        }
    }

    addActiveFigure();
    drawField();
}

addActiveFigure();
drawField();
