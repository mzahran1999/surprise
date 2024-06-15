document.addEventListener('DOMContentLoaded', function() {
    const startSnakeGameButton = document.getElementById('startSnakeGame');
    const resetSnakeGameButton = document.getElementById('resetSnakeGame');
    const snakeCanvas = document.getElementById('snakeCanvas');
    const snakeCtx = snakeCanvas.getContext('2d');

    const initialSnakeX = 10;
    const initialSnakeY = 10;
    let snakeX = initialSnakeX;
    let snakeY = initialSnakeY;
    let snakeSpeedX = 1;
    let snakeSpeedY = 0;
    const snakeSize = 20;
    let snakeSegments = [{ x: initialSnakeX, y: initialSnakeY }];
    const snakeFoodSize = 10;
    let snakeFoodCount = 0;
    let score = 0;
    let gameRunning = false;

    startSnakeGameButton.addEventListener('click', startSnakeGame);

    function startSnakeGame() {
        if (!gameRunning) {
            gameRunning = true;
            resetSnake();
            drawSnake();
            spawnFood();
            document.addEventListener('keydown', changeSnakeDirection);
        }
    }

    function resetSnake() {
        snakeX = initialSnakeX;
        snakeY = initialSnakeY;
        snakeSpeedX = 1;
        snakeSpeedY = 0;
        snakeSegments = [{ x: initialSnakeX, y: initialSnakeY }]; // Reset snake segments
        snakeFoodCount = 0;
        score = 0;
        gameRunning = false;
        snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
        drawSnake();
        drawScore();
    }

    function drawSnake() {
        snakeX += snakeSpeedX * snakeSize;
        snakeY += snakeSpeedY * snakeSize;

        // Check if snake hits wall
        if (snakeX < 0 || snakeX >= snakeCanvas.width || snakeY < 0 || snakeY >= snakeCanvas.height) {
            gameOver();
            return;
        }

        // Check if snake hits itself
        for (let i = 1; i < snakeSegments.length; i++) {
            if (snakeX === snakeSegments[i].x && snakeY === snakeSegments[i].y) {
                gameOver();
                return;
            }
        }

        // Add new head to snake
        snakeSegments.unshift({ x: snakeX, y: snakeY });

        // Check if snake eats food
        if (snakeX === foodX && snakeY === foodY) {
            snakeFoodCount++;
            score++;
            snakeSegments.push({ x: snakeX, y: snakeY }); // Grow snake
            spawnFood();
        } else {
            // Remove tail segment if no food eaten
            snakeSegments.pop();
        }

        // Clear canvas and redraw snake
        snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
        drawScore();
        snakeSegments.forEach(segment => {
            snakeCtx.fillStyle = 'green';
            snakeCtx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
        });

        // Continue game loop
        if (snakeFoodCount < 10) {
            setTimeout(drawSnake, 100); // Adjust snake speed here (lower value for faster speed)
        } else {
            setTimeout(displayMessage, 500); // Display message after a delay
        }
    }

    function drawScore() {
        snakeCtx.fillStyle = 'black';
        snakeCtx.font = '16px Arial';
        snakeCtx.fillText('Score: ' + score, 10, 20);
    }

    function changeSnakeDirection(event) {
        // Prevent snake from reversing
        if (event.key === 'ArrowUp' && snakeSpeedY === 0) {
            snakeSpeedX = 0;
            snakeSpeedY = -1;
        } else if (event.key === 'ArrowDown' && snakeSpeedY === 0) {
            snakeSpeedX = 0;
            snakeSpeedY = 1;
        } else if (event.key === 'ArrowLeft' && snakeSpeedX === 0) {
            snakeSpeedX = -1;
            snakeSpeedY = 0;
        } else if (event.key === 'ArrowRight' && snakeSpeedX === 0) {
            snakeSpeedX = 1;
            snakeSpeedY = 0;
        }
    }

    function spawnFood() {
        foodX = Math.floor(Math.random() * (snakeCanvas.width / snakeSize)) * snakeSize;
        foodY = Math.floor(Math.random() * (snakeCanvas.height / snakeSize)) * snakeSize;
        snakeCtx.fillStyle = 'red';
        snakeCtx.fillRect(foodX, foodY, snakeFoodSize, snakeFoodSize);
    }

    function displayMessage() {
        const message = document.createElement('div');
        message.textContent = "Will you go to the DPR Ian concert with me? ❤️";
        message.style.fontSize = '24px';
        message.style.marginTop = '20px';
        document.body.appendChild(message);
    }

    function gameOver() {
        gameRunning = false;
        snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
        resetSnake();
    }

    resetSnakeGameButton.addEventListener('click', resetSnake);

});
