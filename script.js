const character = document.getElementById('character');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
let isJumping = false;
let score = 0;
let createObstacleInterval;


alert('Welcome to Mr Pac-Jump');


function jump() {
    if (isJumping) return;
    isJumping = true;
    let jumpHeight = 0;

    const jumpInterval = setInterval(() => {
        if (jumpHeight >= 100) {
            clearInterval(jumpInterval);
            const downInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                }
                jumpHeight -= 4;
                character.style.bottom = `${20 + jumpHeight}px`;
            }, 20);
        }
        jumpHeight += 4;
        character.style.bottom = `${20 + jumpHeight}px`;
    }, 10);
}


function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    
    const randomWidth = Math.floor(Math.random() * 30) + 20; // Width between 20px and 50px
    const randomHeight = Math.floor(Math.random() * 40) + 10; // Height between 20px and 70px
    obstacle.style.width = `${randomWidth}px`;
    obstacle.style.height = `${randomHeight}px`;

    obstacle.style.left = '100%'; 
    gameContainer.appendChild(obstacle);

    moveObstacle(obstacle);
}


function moveObstacle(obstacle) {
    let obstaclePosition = gameContainer.clientWidth;

    const obstacleInterval = setInterval(() => {
        if (obstaclePosition < -20) {
            clearInterval(obstacleInterval);
            obstacle.remove();
        } else {
            obstaclePosition -= 5; 
            obstacle.style.left = `${obstaclePosition}px`;

           
            if (obstaclePosition < 50 && !obstacle.passed) {
                obstacle.passed = true;
                
                if (isAboveObstacle(obstacle)) {
                    score++;
                    scoreDisplay.innerText = `Score: ${score}`;
                }
            }
        }

        
        if (detectCollision(obstacle)) {
            clearInterval(obstacleInterval);
            endGame();
        }
    }, 15);
}

function randomizeObstacleInterval() {
    
    return Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;
}


function isAboveObstacle(obstacle) {
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

   
    return characterRect.top + characterRect.height <= obstacleRect.top;
}


function detectCollision(obstacle) {
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return !(
        characterRect.top + characterRect.height < obstacleRect.top ||
        characterRect.top > obstacleRect.top + obstacleRect.height ||
        characterRect.left + characterRect.width < obstacleRect.left ||
        characterRect.left > obstacleRect.left + obstacleRect.width
    );
}


function endGame() {
    clearInterval(createObstacleInterval);
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove());
    const playAgain = confirm(`Game Over! Your final score is: ${score}\nDo you want to play again?`);
    if (playAgain) {
        resetGame();
    } else if (!playAgain || null){
        alert("Do you want to close the game?");
        window.close();
    }
}


function closeGame() {
    clearInterval(createObstacleInterval); 
    gameContainer.innerHTML = ""; 
    scoreDisplay.innerText = ""; 
    alert("Thank you for playing!"); 
    document.removeEventListener('keydown', jump);
}


function resetGame() {
    
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove());

    
    score = 0; 
    scoreDisplay.innerText = `Score: ${score}`;

    
    clearInterval(createObstacleInterval);

    
    startGame();
}


function startGame() {
    
    clearInterval(createObstacleInterval);
    createObstacle(); 
    const createNewObstacle = () => {
        createObstacle(); 
        
        createObstacleInterval = setTimeout(createNewObstacle, randomizeObstacleInterval());
    };

    createNewObstacle(); 
}


document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});


startGame();
