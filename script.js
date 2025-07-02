// game constants and variables
let inputDir = { x: 0, y: 0 };
const moveSound = new Audio("move.mp3");
const foodeatSound = new Audio("foodeat.mp3");
const gameoverSound = new Audio("gameover.mp3");
document.addEventListener('touchstart', () => {
  moveSound.play().catch(() => {});
  foodeatSound.play().catch(() => {});
  gameoverSound.play().catch(() => {});
}, { once: true });

document.addEventListener('click', () => {
  moveSound.play().catch(() => {});
  foodeatSound.play().catch(() => {});
  gameoverSound.play().catch(() => {});
}, { once: true });
let speed = 9;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let score = 0;

const playArea = document.getElementById('playArea');

// NEW: Mobile touch variables
let touchStartX = 0;
let touchStartY = 0;

// NEW: Unified direction change function for both keyboard and touch
function changeDirection(direction) {
    
    switch (direction) {
        case 'up':
            if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case 'down':
            if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case 'left':
            if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case 'right':
            if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
    }
}

// NEW: Touch event handlers
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) changeDirection('right');
        else changeDirection('left');
    } else {
        if (dy > 0) changeDirection('down');
        else changeDirection('up');
    }
}, { passive: true });

// NEW: Prevent touch scrolling during game
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function collide(snake) {
    // if snake bump into itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // if bump to wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // updation of snake and food 
    if (collide(snakeArr)) {
        gameoverSound.play();
        inputDir = {x: 0, y: 0};
        // NEW: Better mobile-friendly game over alert
        setTimeout(() => {
            if (confirm("GAME OVER! Score: " + score + "\nTap OK to play again")) {
                snakeArr = [{x: 13, y: 15}];
                score = 0;
                scorebox.innerHTML = "Score: " + score;
            }
        }, 100);
        return;
    }

    // regeneration of food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodeatSound.play();
        score++;
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highscorebox.innerHTML = "Highscore: " + highscoreval;
        }
        scorebox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2, b = 16;
        food = {x: Math.round(a + (b-a) * Math.random()), y: Math.round(a + (b-a) * Math.random())};
    }

    // MOVE SNAKE
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i+1] = {...snakeArr[i]};
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display
    playArea.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.className = index === 0 ? 'head' : 'snake';
        playArea.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.className = 'food';
    playArea.appendChild(foodElement);
}

// main logic
let highscore = localStorage.getItem("highscore");
let highscoreval = 0;

if (highscore == null) {
    highscoreval = 0;
    localStorage.setItem("highscore", JSON.stringify(highscoreval));
} else {
    highscoreval = JSON.parse(highscore);
    highscorebox.innerHTML = "Highscore: " + highscoreval;
}

// NEW: Modified keyboard controls to use changeDirection()
window.addEventListener('keydown', e => {
    switch (e.key) {
        case "ArrowUp":
            changeDirection('up');
            break;
        case "ArrowDown":
            changeDirection('down');
            break;
        case "ArrowLeft":
            changeDirection('left');
            break;
        case "ArrowRight":
            changeDirection('right');
            break;
    }
});

window.requestAnimationFrame(main);

// NEW: Prevent context menu on mobile
document.addEventListener('contextmenu', e => {
    e.preventDefault();
});