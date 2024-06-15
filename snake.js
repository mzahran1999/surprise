document.addEventListener('DOMContentLoaded', function() {
    const startSnakeGameButton = document.getElementById('startSnakeGame');
    const resetSnakeGameButton = document.getElementById('resetSnakeGame');
    const snakeCanvas = document.getElementById('snakeCanvas');
    const snakeCtx = snakeCanvas.getContext('2d');

    const tileSize = 20;
    const canvasWidth = snakeCanvas.width;
    const canvasHeight = snakeCanvas.height;
    let snake = [];
    let food;
    let dx = tileSize;
    let dy = 0;
    let snakeInterval;
    let snakeGameOver = true;
    let foodEaten = 0;
    let snakeAttempts = 0;

    // Start the Snake game
    startSnakeGameButton.addEventListener('click', startSnakeGame);

    // Reset the Snake game
    resetSnakeGameButton.addEventListener('click', startSnakeGame);

    function startSnakeGame() {
        snake = [];
        for (let i = 3; i >= 0; i--) {
            snake.push({ x: tileSize * i, y: 0 });
        }
        createSnakeFood();
        dx = tileSize;
        dy = 0;
        snakeGameOver = false;
        foodEaten = 0;
        snakeAttempts++;

        if (snakeInterval) {
            clearInterval(snakeInterval);
        }
        snakeInterval = setInterval(moveSnake, 150);

        resetSnakeGameButton.style.display = 'none';
    }

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

    document.addEventListener('keydown', changeSnakeDirection);

    function moveSnake() {
        if (snakeGameOver) return;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight || checkSnakeCollision(head)) {
            clearInterval(snakeInterval);
            snakeGameOver = true;
            resetSnakeGameButton.style.display = 'inline';
            if (snakeAttempts === 5) {
                startPongGame();
            }
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            foodEaten++;
            createSnakeFood();

            if (foodEaten === 5) {
                clearInterval(snakeInterval);
                snakeGameOver = true;
                startPongGame();
                return;
            }
        } else {
            snake.pop();
        }

        snakeCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawSnake();
        drawSnakeFood();
    }

    function drawSnake() {
        snake.forEach((segment, index) => {
            snakeCtx.fillStyle = index === 0 ? '#007bff' : '#1a73e8';
            snakeCtx.fillRect(segment.x, segment.y, tileSize, tileSize);
        });
    }

    function createSnakeFood() {
        const maxX = (canvasWidth / tileSize) - 1;
        const maxY = (canvasHeight / tileSize) - 1;
        food = {
            x: Math.floor(Math.random() * maxX) * tileSize,
            y: Math.floor(Math.random() * maxY) * tileSize
        };

        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            createSnakeFood();
        }
    }

    function drawSnakeFood() {
        snakeCtx.fillStyle = '#ff6347';
        snakeCtx.fillRect(food.x, food.y, tileSize, tileSize);
    }

    function checkSnakeCollision(head) {
        const collision = snake.some(segment => segment.x === head.x && segment.y === head.y);
        return collision || (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight);
    }

    function startPongGame() {
        snakeCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakeCanvas.style.display = 'none';

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

            if (ballY - 10 < 0 || ballY + 10 > pongCanvas.height) {
                ballSpeedY = -ballSpeedY;
            }

            if (ballX - 10 < 10 && ballY > leftPaddleY && ballY < leftPaddleY + 100) {
                ballSpeedX = -ballSpeedX;
            }
            if (ballX + 10 > pongCanvas.width - 10 && ballY > rightPaddleY && ballY < rightPaddleY + 100) {
                ballSpeedX = -ballSpeedX;
            }

            if (ballX + 10 > pongCanvas.width) {
                leftPlayerScore++;
                resetBall();
            }
            if (ballX - 10 < 0) {
                rightPlayerScore++;
                resetBall();
            }

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

        document.addEventListener('keydown', function(e) {
            if (e.key === 'w' && leftPaddleY > 0) {
                leftPaddleY -= 20;
            } else if (e.key === 's' && leftPaddleY < pongCanvas.height - 100) {
                leftPaddleY += 20;
            }

            if (e.key === 'ArrowUp' && rightPaddleY > 0) {
                rightPaddleY -= 20;
            } else if (e.key === 'ArrowDown' && rightPaddleY < pongCanvas.height - 100) {
                rightPaddleY += 20;
            }
        });

        setInterval(update, 1000 / 60);
    }
});
