const character = document.getElementById('character');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
let isJumping = false;
let gravity = 0;
let score = 0;
let createObstacleInterval;
let obstaclesPassed = 0;

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

    // Randomize width and height
    const randomWidth = Math.floor(Math.random() * 30) + 20; // Width between 20px and 50px
    const randomHeight = Math.floor(Math.random() * 40) + 10; // Height between 20px and 70px
    obstacle.style.width = `${randomWidth}px`;
    obstacle.style.height = `${randomHeight}px`;

    obstacle.style.left = '100%'; // Start at the right edge
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
            obstaclePosition -= 5; // Move left
            obstacle.style.left = `${obstaclePosition}px`;

            // Check if the obstacle has passed the character and update score
            if (obstaclePosition < 50 && !obstacle.passed) {
                obstacle.passed = true;
                // Increment score if the character is above the obstacle
                if (isAboveObstacle(obstacle)) {
                    score++;
                    scoreDisplay.innerText = `Score: ${score}`;
                }
            }
        }

        // Detect collision
        if (detectCollision(obstacle)) {
            clearInterval(obstacleInterval);
            endGame();
        }
    }, 15);
}


function isAboveObstacle(obstacle) {
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    // Check if the character is above the obstacle (not colliding)
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
        closeGame();
    } else closeGame();
}

function closeGame() {
    // Clean up the game environment
    clearInterval(createObstacleInterval); // Stop any running intervals
    gameContainer.innerHTML = ""; // Remove all game elements
    scoreDisplay.innerText = ""; // Clear score display
    alert("Thank you for playing!"); // Show a final message
    document.removeEventListener('keydown', jump);
    window.close(); // Close the current window (works only for pop-ups)
}

function resetGame() {
    // Clear existing obstacles
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove());

    // Reset score and display
    score = 0; // Set the score back to 0
    scoreDisplay.innerText = `Score: ${score}`;

    // Stop obstacle generation
    clearInterval(createObstacleInterval);

    // Reinitialize the game
    createObstacle();
    startGame();
}


/* function randomizeObstacleInterval() {
    // Generate a random number between 2000 (2 seconds) and 5000 (5 seconds)
    return Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
}

let createObstacleInterval;

function createObstacle() {
    // Your logic to create an obstacle goes here

    // Clear the previous interval
    clearInterval(createObstacleInterval);
    // Set a new interval with a new random duration for the next obstacle
    createObstacleInterval = setInterval(() => {
        createObstacle(); // Create next obstacle after a randomized interval
    }, randomizeObstacleInterval());
}

function startGame() {
    // Ensure a clean start
    clearInterval(createObstacleInterval);
    createObstacle(); // Create the first obstacle immediately

    // Start the interval for the first new obstacle
    createObstacleInterval = setInterval(() => {
        createObstacle(); // Create next obstacle after a randomized interval
    }, randomizeObstacleInterval());
} */
// Math.floor(Math.random() * (max - min + 1)) + min
//const randomizeObstacleInterval = Math.floor(Math.random() * (3000 - 100 + 1) + 100)
/* function randomizeObstacleInterval(){
    return Math.floor(Math.random() * (5000 - 2000 + 1) + 2000) 
}; */

/* let createRandomObstacleInterval;
function createRandomizedObstacleInterval(){
    clearInterval(createRandomObstacleInterval)
    createRandomObstacleInterval = setInterval(() => {
        createObstacle();
    }, randomizeObstacleInterval())
} */
function startGame() {
    // Ensure a clean start
    clearInterval(createObstacleInterval);
    createObstacle();
    createObstacleInterval = setInterval(createObstacle, Math.floor(Math.random() * (5000 - 2000 + 1) + 2000) );
    /* createObstacleInterval = setInterval(() => {
        createObstacle(); // Create next obstacle after a randomized interval
    }, randomizeObstacleInterval()); */
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

startGame();
