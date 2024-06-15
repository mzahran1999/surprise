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
    let snakeAttempts = 0; // Track number of attempts

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
        snakeAttempts++; // Increment attempt count

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
            if (snakeAttempts === 5) {
                startPongGame(); // Start Pong game after 5 attempts
            }
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
        const maxX = (canvasWidth / tileSize) - 1;
        const maxY = (canvasHeight / tileSize) - 1;
        food = {
            x: Math.floor(Math.random() * maxX) * tileSize,
            y: Math.floor(Math.random() * maxY) * tileSize
        };

        // Ensure food does not spawn on the snake's body
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            createSnakeFood(); // Recursively call function until food position is valid
        }
    }

    // Draw food on canvas for Snake game
    function drawSnakeFood() {
        snakeCtx.fillStyle = '#ff6347'; // Food color
        snakeCtx.fillRect(food.x, food.y, tileSize, tileSize);
    }

    // Check if snake collides with itself or walls for Snake game
    function checkSnakeCollision(head) {
        const collision = snake.some(segment => segment.x === head.x && segment.y === head.y);
        return collision || (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight);
    }

    // Start Pong game
    function startPongGame() {
        // Clear Snake canvas and hide it
        snakeCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakeCanvas.style.display = 'none';

        // Create Pong canvas
        const pongCanvas = document.createElement('canvas');
        pongCanvas.id = 'pongCanvas';
        pongCanvas.width = 600;
        pongCanvas.height = 400;
        document.body.appendChild(pongCanvas);

        const pongCtx = pongCanvas.getContext('2d');

        let leftPaddleY = pongCanvas.height / 2 - 50;
        let rightPaddleY = pongCanvas.height / 2 - 50;
        let ballX = pongCanvas.width / 2;
        let ballY = pongCanvas.height / 2;
        let ballSpeedX = 5;
        let ballSpeedY = 5;
        let leftPlayerScore = 0;
        let rightPlayerScore = 0;
        const winningScore = 5;

        function drawPaddle(x, y) {
            pongCtx.fillStyle = '#fff';
            pongCtx.fillRect(x, y, 10, 100);
        }

        function drawBall() {
            pongCtx.fillStyle = '#fff';
            pongCtx.beginPath();
            pongCtx.arc(ballX, ballY, 10, 0, Math.PI * 2, false);
            pongCtx.fill();
        }

        function drawScores() {
            pongCtx.fillStyle = '#fff';
            pongCtx.font = '30px Arial';
            pongCtx.fillText(leftPlayerScore, 100, 50);
            pongCtx.fillText(rightPlayerScore, pongCanvas.width - 100, 50);
        }

        function moveBall() {
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Ball collision with top and bottom walls
            if (ballY - 10 < 0 || ballY + 10 > pongCanvas.height) {
                ballSpeedY = -ballSpeedY;
            }

            // Ball collision with paddles
            if (ballX - 10 < 10 && ballY > leftPaddleY && ballY < leftPaddleY + 100) {
                ballSpeedX = -ballSpeedX;
            }
            if (ballX + 10 > pongCanvas.width - 10 && ballY > rightPaddleY && ballY < rightPaddleY + 100) {
                ballSpeedX = -ballSpeedX;
            }

            // Scoring
            if (ballX + 10 > pongCanvas.width) {
                leftPlayerScore++;
                resetBall();
            }
            if (ballX - 10 < 0) {
                rightPlayerScore++;
                resetBall();
            }

            // Check winning condition
            if (leftPlayerScore >= winningScore || rightPlayerScore >= winningScore) {
                showEndMessage();
            }
        }

        function resetBall() {
            ballX = pongCanvas.width / 2;
            ballY = pongCanvas.height / 2;
            ballSpeedX = -ballSpeedX;
        }

        function showEndMessage() {
            pongCtx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
            pongCtx.fillStyle = '#fff';
            pongCtx.font = '30px Arial';
            pongCtx.fillText('Game Over!', pongCanvas.width / 2 - 100, pongCanvas.height / 2 - 30);
            pongCtx.fillText('Refresh to play again.', pongCanvas.width / 2 - 150, pongCanvas.height / 2 + 30);
            pongCtx.fillText('Will you go to the DPR Ian concert with me? <3', pongCanvas.width / 2 - 250, pongCanvas.height / 2 + 90);
        }

        function draw() {
            pongCtx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
            drawPaddle(0, leftPaddleY);
            drawPaddle(pongCanvas.width - 10, rightPaddleY);
            drawBall();
            drawScores();
        }

        function update() {
            moveBall();
            draw();
        }

        // Keyboard controls for paddles
        document.addEventListener('keydown', function(e) {
            if (e.key === 'w' &&
