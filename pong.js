document.addEventListener('DOMContentLoaded', function() {
    const pongCanvas = document.getElementById('pongCanvas');
    const pongCtx = pongCanvas.getContext('2d');

    const canvasWidth = pongCanvas.width;
    const canvasHeight = pongCanvas.height;
    const paddleWidth = 10;
    const paddleHeight = 100;
    const paddleSpeed = 5;
    let leftPaddleY = canvasHeight / 2 - paddleHeight / 2;
    let rightPaddleY = canvasHeight / 2 - paddleHeight / 2;
    const ballSize = 10;
    let ballX = canvasWidth / 2;
    let ballY = canvasHeight / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    let leftPlayerScore = 0;
    let rightPlayerScore = 0;
    const winningScore = 5;

    function drawPaddle(x, y) {
        pongCtx.fillStyle = '#fff';
        pongCtx.fillRect(x, y, paddleWidth, paddleHeight);
    }

    function drawBall(x, y) {
        pongCtx.fillStyle = '#fff';
        pongCtx.beginPath();
        pongCtx.arc(x, y, ballSize, 0, Math.PI * 2);
        pongCtx.fill();
    }

    function drawScores() {
        pongCtx.fillStyle = '#fff';
        pongCtx.font = '30px Arial';
        pongCtx.fillText(leftPlayerScore, 100, 50);
        pongCtx.fillText(rightPlayerScore, canvasWidth - 100, 50);
    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Check collision with top and bottom walls
        if (ballY + ballSize > canvasHeight || ballY - ballSize < 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Check collision with paddles
        if (ballX - ballSize < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }
        if (ballX + ballSize > canvasWidth - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }

        // Check if ball goes out of bounds
        if (ballX - ballSize < 0) {
            rightPlayerScore++;
            resetBall();
        }
        if (ballX + ballSize > canvasWidth) {
            leftPlayerScore++;
            resetBall();
        }

        // Check winning condition
        if (leftPlayerScore >= winningScore || rightPlayerScore >= winningScore) {
            showEndMessage();
        }
    }

    function resetBall() {
        ballX = canvasWidth / 2;
        ballY = canvasHeight / 2;
        ballSpeedX = -ballSpeedX;
    }

    function showEndMessage() {
        pongCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        pongCtx.fillStyle = '#fff';
        pongCtx.font = '30px Arial';
        pongCtx.fillText('Game Over!', canvasWidth / 2 - 100, canvasHeight / 2 - 30);
        pongCtx.fillText('Refresh to play again.', canvasWidth / 2 - 150, canvasHeight / 2 + 30);
    }

    function draw() {
        pongCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawPaddle(0, leftPaddleY);
        drawPaddle(canvasWidth - paddleWidth, rightPaddleY);
        drawBall(ballX, ballY);
        drawScores();
    }

    function update() {
        moveBall();
        draw();
    }

    // Keyboard controls for paddles
    document.addEventListener('keydown', function(e) {
        if (e.key === 'w' && leftPaddleY > 0) {
            leftPaddleY -= paddleSpeed;
        }
        if (e.key === 's' && leftPaddleY < canvasHeight - paddleHeight) {
            leftPaddleY += paddleSpeed;
        }
        if (e.key === 'ArrowUp' && rightPaddleY > 0) {
            rightPaddleY -= paddleSpeed;
        }
        if (e.key === 'ArrowDown' && rightPaddleY < canvasHeight - paddleHeight) {
            rightPaddleY += paddleSpeed;
        }
    });

    // Game loop11212
    setInterval(update, 1000 / 60); // 60 frames per second
});
