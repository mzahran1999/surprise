document.addEventListener('DOMContentLoaded', function() {
    const startSnakeGameButton = document.getElementById('startSnakeGame');
    const resetSnakeGameButton = document.getElementById('resetSnakeGame');
    const snakeCanvas = document.getElementById('snakeCanvas');
    const snakeCtx = snakeCanvas.getContext('2d');

    const tileSize = 20;
    const initialSnakeLength = 3; // Initial length of the snake
    const canvasWidth = snakeCanvas.width;
    const canvasHeight = snakeCanvas.height;
    let snake = [];
    let food;
    let dx = tileSize;
    let dy = 0;
    let snakeInterval;
    let snakeGameOver = true;
    let foodEaten = 0; // Track number of food eaten

    // Start the Snake game
    startSnakeGameButton.addEventListener('click', startSnakeGame);

    // Reset the Snake game
    resetSnakeGameButton.addEventListener('click', startSnakeGame);

    function startSnakeGame() {
        snake = [];
        for (let i = initialSnakeLength - 1; i >= 0; i--) {
            snake.push({ x: tileSize * i, y: 0 });
        }
        createSnakeFood();
        dx = tileSize;
        dy = 0;
        snakeGameOver = false;
        foodEaten = 0; // Reset food eaten count

        if (snakeInterval) {
            clearInterval(snakeInterval);
        }
        snakeInterval = setInterval(moveSnake, 150); // Adjust speed as needed

        resetSnakeGameButton.style.display = 'none'; // Hide reset button
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

        // Check if snake hits wall
        if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight || checkSnakeCollision(head)) {
            clearInterval(snakeInterval);
            snakeGameOver = true;
            resetSnakeGameButton.style.display = 'inline'; // Show reset button
            return;
        }

        snake.unshift(head);

        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
            foodEaten++;
            createSnakeFood();

            // Check if snake has eaten 5 pieces of food
            if (foodEaten === 5) {
                clearInterval(snakeInterval);
                snakeGameOver = true;
                startPongGame(); // Start Pong game after Snake game
                return;
            }
        } else {
            snake.pop();
        }

        // Clear canvas and draw snake & food
        snakeCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawSnake();
        drawSnakeFood();

        // Draw borders around canvas
        snakeCtx.strokeStyle = '#ddd'; // Border color
        snakeCtx.strokeRect(0, 0, canvasWidth, canvasHeight);
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
        const maxX = canvasWidth - tileSize;
        const maxY = canvasHeight - tileSize;
        food = {
            x: Math.floor(Math.random() * (maxX / tileSize)) * tileSize,
            y: Math.floor(Math.random() * (maxY / tileSize)) * tileSize
        };
    }

    // Check if snake collides with itself or walls for Snake game
    function checkSnakeCollision(head) {
        const collision = snake.some(segment => segment.x === head.x && segment.y === head.y);
        return collision || (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight);
    }
});
