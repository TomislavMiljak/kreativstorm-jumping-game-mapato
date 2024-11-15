const character = document.getElementById('character');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
let isJumping = false;
let gravity = 0;
let score = 0;
let createObstacleInterval;

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
    }, 20);
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
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
            score++;
            scoreDisplay.innerText = `Score: ${score}`;
        } else if (detectCollision(obstacle)) {
            clearInterval(obstacleInterval);
            endGame();
        } else {
            obstaclePosition -= 5;
            obstacle.style.left = `${obstaclePosition}px`;
        }
    }, 20);
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
    } else {
        closeGame();
    }
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
