document.addEventListener('DOMContentLoaded', function() {
    const startGameButton = document.getElementById('startGame');
    const gameSection = document.getElementById('game');
    const messageSection = document.getElementById('message');
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');

    const tileSize = 20;
    const initialSnakeLength = 3; // Initial length of the snake
    let snake;
    let food;
    let gameInterval;
    let dx = tileSize;
    let dy = 0;
    let gameOver = false;

    // Start the game
    startGameButton.addEventListener('click', startGame);

    function startGame() {
        snake = [];
        for (let i = initialSnakeLength - 1; i >= 0; i--) {
            snake.push({ x: tileSize * i, y: 0 });
        }
        createFood();
        dx = tileSize;
        dy = 0;
        gameOver = false;
        startGameButton.disabled = true;

        if (gameInterval) {
            clearInterval(gameInterval);
        }
        gameInterval = setInterval(moveSnake, 150); // Adjust speed as needed
    }

    // Handle keyboard controls
    document.addEventListener('keydown', changeDirection);

    function changeDirection(e) {
        if (gameOver) return;

        if (e.key === 'ArrowUp' && dy === 0) {
            dx = 0;
            dy = -tileSize;
        }
        if (e.key === 'ArrowDown' && dy === 0) {
            dx = 0;
            dy = tileSize;
        }
        if (e.key === 'ArrowLeft' && dx === 0) {
            dx = -tileSize;
            dy = 0;
        }
        if (e.key === 'ArrowRight' && dx === 0) {
            dx = tileSize;
            dy = 0;
        }
    }

    // Main game loop
    function moveSnake() {
        if (gameOver) return;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
            createFood();
        } else {
            snake.pop();
        }

        // Check if snake hits wall or itself
        if (head.x < 0 || head.x >= gameCanvas.width || head.y < 0 || head.y >= gameCanvas.height || checkCollision()) {
            gameOver = true;
            clearInterval(gameInterval);
            endGame();
        }

        // Clear canvas and draw snake & food
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawSnake();
        drawFood();
    }

    // Draw snake on canvas
    function drawSnake() {
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#007bff' : '#1a73e8'; // Head and body color
            ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
        });
    }

    // Create food at random position
    function createFood() {
        const maxX = gameCanvas.width - tileSize;
        const maxY = gameCanvas.height - tileSize;
        food = {
            x: Math.floor(Math.random() * (maxX / tileSize)) * tileSize,
            y: Math.floor(Math.random() * (maxY / tileSize)) * tileSize
        };
    }

    // Draw food on canvas
    function drawFood() {
        ctx.fillStyle = '#28a745';
        ctx.fillRect(food.x, food.y, tileSize, tileSize);
    }

    // Check if snake collides with itself
    function checkCollision() {
        const [head, ...body] = snake;
        return body.some(segment => segment.x === head.x && segment.y === head.y);
    }

    // Game over function
    function endGame() {
        gameSection.style.display = 'none';
        messageSection.style.display = 'block';
    }
});
