// game constants and variable first 
let inputDir = { x: 0, y: 0 };
const moveSound = new Audio("move.mp3");
const foodeatSound = new Audio("foodeat.mp3");
const gameoverSound = new Audio("gameover.mp3");
let speed = 9;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let score=0;

const playArea = document.getElementById('playArea'); // ✅ REQUIRED FIX

// game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}


function collide(snake){
//if snake bump into itself

for (let i=1; i< snakeArr.length; i++){
    if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
        return true;
    }
}

//if bump to wall
   if (snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){
       return true;
   }
   return false;
}



function gameEngine() {
    //updation of snake and food 
if (collide(snakeArr)){
    gameoverSound.play();
    inputDir = {x:0, y:0};
    alert("GAME OVER :( Press ctrl + R to reload the game");
    snakeArr = [{x: 13, y: 15}];
    score=0;
}




    //regeneration of food
    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodeatSound.play();
        score++;
        if(score> highscoreval){
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval))
            highscorebox.innerHTML = "Highscore: " + highscoreval;

        }

        scorebox.innerHTML ="Score: " + score;

        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a=2, b=16;
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }

    //MOVE SNAKE
    for (let i= snakeArr.length-2 ; i>=0; i--){
        snakeArr[i+1] = {...snakeArr[i]};
    }
     
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;


    // Clear previous frame
    playArea.innerHTML = "";

    // Display snake
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        playArea.appendChild(snakeElement);
    });

    // Display food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');  
    playArea.appendChild(foodElement);
}

// main logic 

let highscore = localStorage.getItem("highscore");

if(highscore== null){
    highscoreval = 0;
    localStorage.setItem("highscore", JSON.stringify(highscoreval))}
    else{
        highscoreval=JSON.parse(highscore);
        highscorebox.innerHTML = "Highscore: " + highscore;
    }
    


window.requestAnimationFrame(main); // produces high quality animation 
window.addEventListener('keydown', e => {
    inputDir ={ x: 0, y:1};

    switch (e.key) {
        case "ArrowUp":
            console.log("Arrow Up");
            inputDir.x= 0;
            inputDir.y= -1;
            break;

        case "ArrowDown":
            console.log("Arrow Down");
              inputDir.x= 0;
            inputDir.y= 1;
            break;

        case "ArrowLeft":
            console.log("Arrow Left");
              inputDir.x= -1;
              inputDir.y= 0;
            break;

        case "ArrowRight":
            console.log("Arrow Right");
            inputDir.x= 1;
            inputDir.y= 0;
            break;

        default:
            break;
    }
});
