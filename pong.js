document.addEventListener('DOMContentLoaded', function() {
    const pongCanvas = document.getElementById('pongCanvas');
    const pongCtx = pongCanvas.getContext('2d');

    const paddleWidth = 10;
    const paddleHeight = 70;
    const ballSize = 10;
    let paddle1Y = (pongCanvas.height - paddleHeight) / 2;
    let paddle2Y = (pongCanvas.height - paddleHeight) / 2;
    let ballX = pongCanvas.width / 2;
    let ballY = pongCanvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    let player1Score = 0;
    let player2Score = 0;
    let pongGameOver = true;

    // Start the Pong game
    function startPongGame() {
        pongCanvas.style.display = 'block'; // Show pong canvas
        pongGameOver = false;

        if (!pongGameOver) {
            requestAnimationFrame(drawPong);
        }
    }

    // Handle keyboard controls for Pong game
    document.addEventListener('keydown', movePaddle);

    function movePaddle(e) {
        if (pongGameOver) return;

        if (e.key === 'w' && paddle1Y > 0) {
            paddle1Y -= 10;
        }
        if (e.key === 's' && paddle1Y < pongCanvas.height - paddleHeight) {
            paddle1Y += 10;
        }
    }

    // Main loop for Pong game
    function drawPong() {
        if (pongGameOver) return;

        pongCtx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
        drawPaddles();
        drawBall();
        moveBall();
        drawScores();

        // Check game over condition
        if (player1Score === 5 || player2Score === 5) {
            pongGameOver = true;
            pongCanvas.style.display = 'none'; // Hide pong canvas
            showFinalMessage(); // Show final message after both games are completed
        } else {
            requestAnimationFrame(drawPong);
        }
    }

    // Draw paddles on canvas for Pong game
    function drawPaddles() {
        pongCtx.fillStyle = '#007bff';
        pongCtx.fillRect(10, paddle1Y, paddleWidth, paddleHeight);
        pongCtx.fillStyle = '#28a745';
        pongCtx.fillRect(pongCanvas.width - paddleWidth - 10, paddle2Y, paddleWidth, paddleHeight);
    }

    // Draw ball on canvas for Pong game
    function drawBall() {
        pongCtx.fillStyle = '#dc3545';
        pongCtx.beginPath();
        pongCtx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        pongCtx.fill();
    }

    // Move ball for Pong game
    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Ball collision with top/bottom walls
        if (ballY + ballSize >= pongCanvas.height || ballY - ballSize <= 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Ball collision with paddles
        if (ballX - ballSize <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }
        if (ballX + ballSize >= pongCanvas.width - paddleWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }

        // Ball goes past paddles
        if (ballX - ballSize <= 0) {
            player2Score++;
            resetBall();
        }
        if (ballX + ballSize >= pongCanvas.width) {
            player1Score++;
            resetBall();
        }
    }

    // Draw scores on canvas for Pong game
    function drawScores() {
        pongCtx.fillStyle = '#007bff';
        pongCtx.font = '24px Arial';
        pongCtx.fillText(`Player 1: ${player1Score}`, 50, 30);
        pongCtx.fillStyle = '#28a745';
        pongCtx.fillText(`Player 2: ${player2Score}`, pongCanvas.width - 150, 30);
    }

    // Reset ball position for Pong game
    function resetBall() {
        ballX = pongCanvas.width / 2;
        ballY = pongCanvas.height / 2;
        ballSpeedX = -ballSpeedX; // Serve ball towards the player who scored
    }

    // Function to show final message
    function showFinalMessage() {
        const messageSection = document.getElementById('message');
        messageSection.style.display = 'block';
    }

    // Start Pong game after Snake game completion
    window.startPongGame = startPongGame; // Expose startPongGame function globally
});
