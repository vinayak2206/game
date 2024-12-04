const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');

let playerName = '';
let highestScore = 0;
let currentScore = 0;
let basketX = canvas.width / 2 - 25;
const basketWidth = 50;
const basketHeight = 20;
let fallingObjects = [];
let gameOver = false;
let timeLeft = 120; // 2 minutes in seconds

// Load highest score from localStorage
if (localStorage.getItem('highestScore')) {
    const savedData = JSON.parse(localStorage.getItem('highestScore'));
    highestScore = savedData.score;
    playerName = savedData.name;
}

// Function to display the scoreboard
function displayScoreboard() {
    scoreboard.innerHTML = `Player: ${playerName || 'N/A'} | Highest Score: ${highestScore}`;
}

// Function to ask for player's name
function askForName() {
    playerName = prompt("Please enter your name:");
    if (playerName) {
        displayScoreboard();
    }
}

// Draw the basket
function drawBasket() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(basketX, canvas.height - basketHeight, basketWidth, basketHeight);
}

// Draw falling objects
function drawFallingObjects() {
    ctx.fillStyle = 'red';
    fallingObjects.forEach(obj => {
        ctx.fillRect(obj.x, obj.y, 20, 20);
    });
}

// Update falling objects
function updateFallingObjects() {
    fallingObjects.forEach((obj, index) => {
        obj.y += 2; // Falling speed
        if (obj.y > canvas.height) {
            fallingObjects.splice(index, 1); // Remove if it goes off screen
        }
        // Check for collision with basket
        if (obj.y + 20 >= canvas.height - basketHeight && obj.x > basketX && obj.x < basketX + basketWidth) {
            currentScore++;
            fallingObjects.splice(index, 1); // Remove caught object
        }
    });
}

// Spawn a new falling object
function spawnObject() {
    const x = Math.random() * (canvas.width - 20);
    fallingObjects.push({ x: x, y: 0 });
}

// Draw the current score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + currentScore, 10, 20);
}

// Draw the timer
function drawTimer() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Time Left: ' + Math.floor(timeLeft / 60) + ':' + (timeLeft % 60).toString().padStart(2, '0'), canvas.width - 150, 20);
}

// Game loop
function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawFallingObjects();
    drawScore();
    drawTimer();
    updateFallingObjects();
    requestAnimationFrame(gameLoop);
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && basketX > 0) {
        basketX -= 20;
    } else if (event.key === 'ArrowRight' && basketX < canvas.width - basketWidth) {
        basketX += 20;
    }
});

// Start the game
function startGame() {
    askForName();
    setInterval(spawnObject, 1000); // Spawn a new object every second
    gameLoop();
    startTimer();
}

// Start the countdown timer
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        } else {
            timeLeft--;
        }
    }, 1000);
}

// End the game and check for high score
function endGame() {
    gameOver = true;
    if (currentScore > highestScore) {
        highestScore = currentScore;
        localStorage.setItem('highestScore', JSON.stringify({ name: playerName, score: highestScore }));
        alert("Congratulations! You've set a new high score!");
    } else {
        alert("Game Over! Your score: " + currentScore);
    }
}

// Call startGame to begin
startGame();