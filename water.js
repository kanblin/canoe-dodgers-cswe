//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

//ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = (tileSize * columns) / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight,
};

let shipImg;
let shipVelocityX = tileSize; //ship moving speed

//rocks
let rockArray = [];
let rockWidth = tileSize * 2;
let rockHeight = tileSize;
let rockX = tileSize;
let rockY = tileSize;
let rockImg;

// let rockRows = ;
// let rockColumns = 3;
let rockCount = 0; //number of rocks to defeat
let rockVelocityY = 1; //rock moving speed

let score = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //used for drawing on the board

    //draw initial ship
    // context.fillStyle="green";
    // context.fillRect(ship.x, ship.y, ship.width, ship.height);

    //load images
    shipImg = new Image();
    shipImg.src = "./canoe.png";
    shipImg.onload = function () {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    };

    rockImg = new Image();
    rockImg.src = "./rock.png";
    createRocks();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
};

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "blue";
    context.fillRect(0, 0, board.width, board.height);
    //ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //rock
    for (let i = 0; i < rockArray.length; i++) {
        let rock = rockArray[i];
        if (rock.alive) {
            // rock.x += rockVelocityX;
            rockArray[i].y += rockVelocityY;
            //if rock touches the borders

            context.drawImage(rockImg, rock.x, rock.y, rock.width, rock.height);

            if (rock.y >= ship.y) {
                rock.alive = false;
                createRocks();
            }
        }
    }

    //score
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}

function moveShip(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; //move left one tile
    } else if (
        e.code == "ArrowRight" &&
        ship.x + shipVelocityX + ship.width <= board.width
    ) {
        ship.x += shipVelocityX; //move right one tile
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function createRocks() {
    let rockStartColumns = getRandomInt(columns / 3);
    let rockEndColumns = getRandomArbitrary(rockStartColumns + 1, columns);
    let rockRows = getRandomInt(columns / 5);
    for (let c = rockStartColumns; c < rockEndColumns; c++) {
        for (let r = 0; r < rockRows; r++) {
            let rock = {
                img: rockImg,
                x: rockX + c * rockWidth,
                y: rockY + r * rockHeight,
                width: rockWidth,
                height: rockHeight,
                alive: true,
            };
            rockArray.push(rock);
        }
    }
    rockCount = rockArray.length;
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x && //a's top right corner passes b's top left corner
        a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y
    ); //a's bottom left corner passes b's top left corner
}
