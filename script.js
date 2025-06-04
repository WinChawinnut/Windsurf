const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');

// Game settings
canvas.width = 400;
canvas.height = 400;
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Snake properties
let snake = [
    {x: 10, y: 10}
];
let dx = 0;
let dy = 0;
let food = {x: 5, y: 5};
let score = 0;
let gameRunning = false;

// Draw functions
function drawGame() {
    clearCanvas();
    drawSnake();
    drawFood();
    drawScore();
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
    }
    
    if (checkFoodCollision()) {
        eatFood();
    }
}

function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Snake movement
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    if (!checkFoodCollision()) {
        snake.pop();
    }
}

function turn(dx, dy) {
    if (gameRunning && 
        (snake[0].x + dx < 0 || snake[0].x + dx >= tileCount || 
         snake[0].y + dy < 0 || snake[0].y + dy >= tileCount)) {
        return;
    }
    
    this.dx = dx;
    this.dy = dy;
}

// Collision detection
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function eatFood() {
    score++;
    scoreElement.textContent = score;
    
    // Generate new food position
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

// Game control
function startGame() {
    if (!gameRunning) {
        snake = [{x: 10, y: 10}];
        dx = 1;
        dy = 0;
        score = 0;
        scoreElement.textContent = score;
        gameRunning = true;
        
        // Start game loop (even slower speed)
        setInterval(drawGame, 400); // Changed from 200 to 400 for even slower speed
        
        // Add keyboard controls (WASD and Arrow keys)
        document.addEventListener('keydown', handleKeyDown);
        
        // Add mouse control
        canvas.addEventListener('click', handleMouseClick);
    }
}

// Handle keyboard input
function handleKeyDown(e) {
    const key = e.key.toLowerCase();
    
    // WASD controls
    if (key === 'w' || key === 'arrowup') {
        if (dy === 0) turn(0, -1);
    } 
    else if (key === 's' || key === 'arrowdown') {
        if (dy === 0) turn(0, 1);
    } 
    else if (key === 'a' || key === 'arrowleft') {
        if (dx === 0) turn(-1, 0);
    } 
    else if (key === 'd' || key === 'arrowright') {
        if (dx === 0) turn(1, 0);
    }
}

// Handle mouse clicks
function handleMouseClick(e) {
    if (!gameRunning) return;
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Get snake head position
    const headX = snake[0].x * gridSize + gridSize / 2;
    const headY = snake[0].y * gridSize + gridSize / 2;
    
    // Calculate direction vector
    const dirX = mouseX - headX;
    const dirY = mouseY - headY;
    
    // Determine which direction to move based on the larger component
    if (Math.abs(dirX) > Math.abs(dirY)) {
        // Move horizontally
        if (dirX > 0 && dx === 0) {
            turn(1, 0); // Right
        } else if (dirX < 0 && dx === 0) {
            turn(-1, 0); // Left
        }
    } else {
        // Move vertically
        if (dirY > 0 && dy === 0) {
            turn(0, 1); // Down
        } else if (dirY < 0 && dy === 0) {
            turn(0, -1); // Up
        }
    }
}

function gameOver() {
    gameRunning = false;
    alert(`Game Over! Your score: ${score}`);
}

// Event listeners
startButton.addEventListener('click', startGame);
