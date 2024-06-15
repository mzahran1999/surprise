document.addEventListener('DOMContentLoaded', function() {
    const startSnakeGameButton = document.getElementById('startSnakeGame');
    const snakeGameSection = document.getElementById('snake-game');
    const snakeCanvas = document.getElementById('snakeCanvas');
    const snakeCtx = snakeCanvas.getContext('2d');

    const tileSize = 20;
    const initialSnakeLength = 3; // Initial length of the snake
    let snake;
    let food;
    let snakeInterval;
    let dx = tileSize;
    let dy = 0;
    let snakeGameOver = true;

    // Start the Snake game
    startSnakeGameButton.addEventListener('click', startSnakeGame);

    function startSnakeGame() {
        snake = [];
        for (let i = initialSnakeLength - 1; i >= 0; i--) {
            snake.push({ x: tileSize * i, y: 0 });
        }
        createSnakeFood();
        dx = tileSize;
        dy = 0;
        snakeGameOver = false;

        if (snakeInterval) {
            clearInterval(snakeInterval);
        }
        snakeInterval = setInterval(moveSnake, 150); // Adjust speed as needed
    }

    // Handle keyboard controls for Snake game
    document.addEventListener('keydown', changeSnakeDirection);

    function changeSnakeDirection(e) {
        if (snakeGameOver) return;

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

    // Main loop for Snake game
    function moveSnake() {
        if (snakeGameOver) return;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
            createSnakeFood();
        } else {
            snake.pop();
        }

        // Check if snake hits wall or itself
        if (head.x < 0 || head.x >= snakeCanvas.width || head.y < 0 || head.y >= snakeCanvas.height || checkSnakeCollision()) {
            clearInterval(snakeInterval);
            snakeGameOver = true;
            snakeGameSection.style.display = 'none';
            messageSection.style.display = 'block';
        }

        // Clear canvas and draw snake & food
        snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
        drawSnake();
        drawSnakeFood();
    }

    // Draw snake on canvas for Snake game
    function drawSnake() {
        snake.forEach((segment, index) => {
            snakeCtx.fillStyle = index === 0 ? '#007bff' : '#1a73e8'; // Head and body color
            snakeCtx.fillRect(segment.x, segment.y, tileSize, tileSize);
        });
    }

    // Create food at random position for Snake game
    function createSnakeFood() {
        const maxX = snakeCanvas.width - tileSize;
        const maxY = snakeCanvas.height - tileSize;
        food = {
            x: Math.floor(Math.random() * (maxX / tileSize)) * tileSize,
            y: Math.floor(Math.random() * (maxY / tileSize)) * tileSize
        };
    }

    // Draw food on canvas for Snake game
    function drawSnakeFood() {
        snakeCtx.fillStyle = '#28a745';
        snakeCtx.fillRect(food.x, food.y, tileSize, tileSize);
    }

    // Check if snake collides with itself for Snake game
    function checkSnakeCollision() {
        const [head, ...body] = snake;
        return body.some(segment => segment.x === head.x && segment.y === head.y);
    }
});
