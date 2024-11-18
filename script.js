

const character = document.getElementById('character');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
let isJumping = false;
let score = 0;
let createObstacleInterval;

// Start the game with an alert
alert('Welcome to Mr Pac-Jump');

// Function to handle jumping
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

// Function to create an obstacle
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

// Function to move the obstacle
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

// Function to generate a random interval
function randomizeObstacleInterval() {
    // Generate a random number between 1000 (1 second) and 4000 (3 seconds)
    return Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;
}

// Function to check if the character is above the obstacle
function isAboveObstacle(obstacle) {
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    // Check if the character is above the obstacle (not colliding)
    return characterRect.top + characterRect.height <= obstacleRect.top;
}

// Function to detect collision between character and obstacle
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

// Function to handle game over
function endGame() {
    clearInterval(createObstacleInterval);
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove());
    const playAgain = confirm(`Game Over! Your final score is: ${score}\nDo you want to play again?`);
    if (playAgain) {
        resetGame();
    } else if (!playAgain || null){
        closeGame();
    }
}

// Function to close the game
function closeGame() {
    clearInterval(createObstacleInterval); // Stop any running intervals
    gameContainer.innerHTML = ""; // Remove all game elements
    scoreDisplay.innerText = ""; // Clear score display
    alert("Thank you for playing!"); // Show a final message
    document.removeEventListener('keydown', jump);
}

// Function to reset the game
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
    startGame();
}

// Function to start the game
function startGame() {
    // Ensure a clean start
    clearInterval(createObstacleInterval);
    createObstacle(); // Create the first obstacle immediately

    const createNewObstacle = () => {
        createObstacle(); // Create a new obstacle
        // Schedule the next obstacle creation with a new random interval
        createObstacleInterval = setTimeout(createNewObstacle, randomizeObstacleInterval());
    };

    createNewObstacle(); // Start the first obstacle creation
}

// Event listener for jumping
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

// Start the game
startGame();