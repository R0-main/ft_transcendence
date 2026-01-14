// Variables globales
let startScreen, gameScreen, startBtn, lobbyInfo, canvasContainer, canvas, ctx, pauseOverlay;
let settingsScreen, createGameBtn, pauseMenu;

let gameId = null;
let ws = null;
let playersConnected = {};
let gameState = null;
let currentMode = '2players';
let totalPlayers = 2;
let currentPaddleSize = 50; // Stocker la taille actuelle du paddle
let isPaused = false;

// Game Settings
let gameSettings = {
    paddleSize: 80,  // valeur par defaut
    ballSpeed: 3,
    winScore: 11
};

// Particle System
let particles = [];
let isGameOver = false;
let winnerId = null;
let animationFrameId = null;

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
        this.gravity = 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
        return this.alpha > 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.random() * 4 + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function renderGameOver() {
    if (!isGameOver) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.update());
    particles.forEach(p => p.draw(ctx));

    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 60px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#667eea';
    ctx.shadowBlur = 20;
    ctx.fillText(`PLAYER ${winnerId} WINS!`, canvas.width / 2, canvas.height / 2);
    ctx.restore();

    animationFrameId = requestAnimationFrame(renderGameOver);
}

// ===== fonctions appelee par game.js =====
function initGameElements() {
    // Recup tous les elements
    startScreen = document.getElementById('startScreen');
    gameScreen = document.getElementById('gameScreen');
    startBtn = document.getElementById('startBtn');
    lobbyInfo = document.getElementById('lobbyInfo');
    canvasContainer = document.getElementById('canvasContainer');
    canvas = document.getElementById('gameCanvas');
    pauseOverlay = document.getElementById('pauseOverlay');
    settingsScreen = document.getElementById('settingsScreen');
    createGameBtn = document.getElementById('createGameBtn');
    pauseMenu = document.getElementById('pauseMenu');

    if (canvas) {
        ctx = canvas.getContext('2d');
    }

    // Attacher l'event listener
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }

    if (createGameBtn) {
        createGameBtn.addEventListener('click', () => createGame(currentMode));
    }

    // ESC pour pause
    document.addEventListener('keydown', handleEscapeKey);
}

// Gerer la touche ESC
function handleEscapeKey(e) {
    if (e.key === 'Escape' && canvasContainer && !canvasContainer.classList.contains('hidden')) {
        togglePause();
    }
}

// Toggle pause
function togglePause() {
    isPaused = !isPaused;
    if (pauseMenu) {
        if (isPaused) {
            pauseMenu.classList.remove('hidden');
        } else {
            pauseMenu.classList.add('hidden');
            closePauseSettings(); // Fermer les settings si ouverts
        }
    }
}

// Show pause settings
function showPauseSettings() {
    const pauseSettingsOverlay = document.getElementById('pauseSettingsOverlay');
    if (pauseSettingsOverlay) {
        // Initialiser les sliders
        const pausePaddleSize = document.getElementById('pausePaddleSize');
        const pauseBallSpeed = document.getElementById('pauseBallSpeed');
        const pauseWinScore = document.getElementById('pauseWinScore');
        
        if (pausePaddleSize) pausePaddleSize.value = gameSettings.paddleSize;
        if (pauseBallSpeed) pauseBallSpeed.value = gameSettings.ballSpeed;
        if (pauseWinScore) pauseWinScore.value = gameSettings.winScore;
        
        // Mettre a jour les affichages
        updatePauseSettingsDisplay();
        
        // Attacher les listeners
        initPauseSettingsSliders();
        
        pauseSettingsOverlay.classList.remove('hidden');
    }
}

// Close pause settings
function closePauseSettings() {
    const pauseSettingsOverlay = document.getElementById('pauseSettingsOverlay');
    if (pauseSettingsOverlay) {
        pauseSettingsOverlay.classList.add('hidden');
    }
}

// Apply pause settings
function applyPauseSettings() {
    const pausePaddleSize = document.getElementById('pausePaddleSize');
    const pauseBallSpeed = document.getElementById('pauseBallSpeed');
    const pauseWinScore = document.getElementById('pauseWinScore');
    
    if (pausePaddleSize) gameSettings.paddleSize = parseInt(pausePaddleSize.value);
    if (pauseBallSpeed) gameSettings.ballSpeed = parseInt(pauseBallSpeed.value);
    if (pauseWinScore) gameSettings.winScore = parseInt(pauseWinScore.value);
    
    // Mettre a jour currentPaddleSize pour le front
    currentPaddleSize = gameSettings.paddleSize;
    
    console.log('⚙️ Settings updated:', gameSettings);
    
    closePauseSettings();
    
    // Afficher une notif
    showNotification('Settings will apply next round!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 1rem;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize pause settings sliders
function initPauseSettingsSliders() {
    const pausePaddleSize = document.getElementById('pausePaddleSize');
    const pauseBallSpeed = document.getElementById('pauseBallSpeed');
    const pauseWinScore = document.getElementById('pauseWinScore');
    
    if (pausePaddleSize) {
        pausePaddleSize.removeEventListener('input', updatePauseSettingsDisplay);
        pausePaddleSize.addEventListener('input', updatePauseSettingsDisplay);
    }
    
    if (pauseBallSpeed) {
        pauseBallSpeed.removeEventListener('input', updatePauseSettingsDisplay);
        pauseBallSpeed.addEventListener('input', updatePauseSettingsDisplay);
    }
    
    if (pauseWinScore) {
        pauseWinScore.removeEventListener('input', updatePauseSettingsDisplay);
        pauseWinScore.addEventListener('input', updatePauseSettingsDisplay);
    }
}

// Update pause settings display
function updatePauseSettingsDisplay() {
    const pausePaddleSizeValue = document.getElementById('pausePaddleSizeValue');
    const pauseBallSpeedValue = document.getElementById('pauseBallSpeedValue');
    const pauseWinScoreValue = document.getElementById('pauseWinScoreValue');
    
    const pausePaddleSize = document.getElementById('pausePaddleSize');
    const pauseBallSpeed = document.getElementById('pauseBallSpeed');
    const pauseWinScore = document.getElementById('pauseWinScore');
    
    if (pausePaddleSizeValue && pausePaddleSize) {
        pausePaddleSizeValue.textContent = pausePaddleSize.value;
    }
    
    if (pauseBallSpeedValue && pauseBallSpeed) {
        const speedLabels = ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'];
        pauseBallSpeedValue.textContent = speedLabels[pauseBallSpeed.value - 1];
    }
    
    if (pauseWinScoreValue && pauseWinScore) {
        pauseWinScoreValue.textContent = pauseWinScore.value;
    }
}

// Initialize settings sliders
function initSettingsSliders() {
    const paddleSizeSlider = document.getElementById('paddleSize');
    const ballSpeedSlider = document.getElementById('ballSpeed');
    const winScoreSlider = document.getElementById('winScore');

    const paddleSizeValue = document.getElementById('paddleSizeValue');
    const ballSpeedValue = document.getElementById('ballSpeedValue');
    const winScoreValue = document.getElementById('winScoreValue');

    if (paddleSizeSlider && paddleSizeValue) {
        // Initialiser avec la valeur par defaut
        paddleSizeValue.textContent = paddleSizeSlider.value;
        
        paddleSizeSlider.addEventListener('input', (e) => {
            gameSettings.paddleSize = parseInt(e.target.value);
            paddleSizeValue.textContent = e.target.value;
        });
    }

    if (ballSpeedSlider && ballSpeedValue) {
        const speedLabels = ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast'];
        
        // Initialiser avec la valeur par defaut
        ballSpeedValue.textContent = speedLabels[ballSpeedSlider.value - 1];
        
        ballSpeedSlider.addEventListener('input', (e) => {
            gameSettings.ballSpeed = parseInt(e.target.value);
            ballSpeedValue.textContent = speedLabels[e.target.value - 1];
        });
    }

    if (winScoreSlider && winScoreValue) {
        // Initialiser avec la valeur par defaut
        winScoreValue.textContent = winScoreSlider.value;
        
        winScoreSlider.addEventListener('input', (e) => {
            gameSettings.winScore = parseInt(e.target.value);
            winScoreValue.textContent = e.target.value;
        });
    }
}

// Navigate to settings screen
function selectMode(mode) {
    currentMode = mode;
    
    if (mode === '2players') totalPlayers = 2;
    else if (mode === '3players') totalPlayers = 3;
    else if (mode === '4players') totalPlayers = 4;

    startScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
}

// Back to mode selection
function backToModeSelection() {
    settingsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

async function createGame(mode) {
    // Fermer l'ancien WebSocket s'il existe
    if (ws) {
        console.log('🔌 Closing old WebSocket...');
        ws.close();
        ws = null;
    }
    
    // Desactiver le bouton pour eviter doubles clics
    if (createGameBtn) {
        createGameBtn.disabled = true;
        createGameBtn.textContent = 'Creating...';
    }
    
    try {
        // Préparer les données avec les usernames
        const requestData = {
            ...gameSettings,
            players: []
        };
        
        // Ajouter les joueurs avec leurs usernames
        for (let i = 1; i <= totalPlayers; i++) {
            if (i === 1 && window.currentUser) {
            // Joueur 1 = utilisateur connecté
                requestData.players.push({
                    username: window.currentUser.username,
                    userId: window.currentUser.id
                });
            } else {
                // Autres joueurs = invités
                requestData.players.push({
                    username: `Player ${i}`,
                    userId: null
                });
            }
        }
        
        console.log('📤 Sending game data:', requestData);
        
        const res = await fetch(`${window.location.protocol}//${window.location.host}/api/game/create/${mode}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        const data = await res.json();

        if (data.status === 'ok') {
            gameId = data.gameId;
            currentMode = mode;
            
            console.log('✅ New game created with ID:', gameId);
            console.log('👥 Players:', requestData.players);

            if (totalPlayers > 2) {
                canvas.width = 800;
                canvas.height = 800;
            } else {
                canvas.width = 800;
                canvas.height = 400;
            }

            settingsScreen.classList.add('hidden');
            initLobby();
        }
    } catch (e) {
        console.error('Failed to create game:', e);
        alert('Error creating game');
        
        // Reactiver le bouton en cas d'erreur
        if (createGameBtn) {
            createGameBtn.disabled = false;
            createGameBtn.textContent = 'Create Game →';
        }
    }
}

function initLobby() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    lobbyInfo.innerHTML = '';
    playersConnected = {};

    for (let i = 1; i <= totalPlayers; i++) {
        playersConnected[i] = false;

            // DEBUG
        console.log('🔍 Player', i);
        console.log('   window.currentUser:', window.currentUser);
        console.log('   i === 1:', i === 1);

        const card = document.createElement('div');
        card.className = 'player-card';
        card.id = `p${i}Card`;

        // Déterminer le nom du joueur
        let playerName = `Player ${i}`;
        if (i === 1 && window.currentUser) {
            playerName = window.currentUser.username;
            console.log('   ✅ Using username:', playerName);
        } else {
            console.log('   ❌ Using default Player', i);
        }

        // Ajouter la position
        let position = '';
        if (i === 1) position = " (Left)";
        else if (i === 2 && totalPlayers >= 2) position = " (Right)";
        else if (i === 3) position = " (Top)";
        else if (i === 4) position = " (Bottom)";

        card.innerHTML = `
            <h3>${playerName}${position}</h3>
            <div id="qr-p${i}" class="qr-placeholder"></div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div class="status-badge" id="p${i}Status">Waiting for connection...</div>
                <div class="controls-hint">Scan to join</div>
            </div>
        `;
        lobbyInfo.appendChild(card);

        setTimeout(() => {
            generateQR(`qr-p${i}`, getControllerUrl(i));
        }, 0);
    }

    connectWebSocket();
}

function getControllerUrl(playerId) {
    const host = window.location.host;
    const protocol = window.location.protocol;
    return `${protocol}//${host}/controller.html?gameId=${gameId}&playerId=${playerId}`;
}

function generateQR(elementId, text) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = '';
    new QRCode(el, {
        text: text,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    el.style.cursor = 'pointer';
    el.onclick = () => window.open(text, '_blank', 'width=400,height=600');
}

function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/game/${gameId}/websocket`;

    ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            handleMessage(data);
        } catch (e) {

        }
    };
}

function handleMessage(data) {
    if (data.type === 'player_connection') {
        updatePlayerStatus(data.playerId, data.connected);
    }
    else if (data.type === 'game_started') {
        lobbyInfo.classList.add('hidden');
        startBtn.classList.add('hidden');
        canvasContainer.classList.remove('hidden');
        isGameOver = false;
        isPaused = false;
        // Initialiser paddleSize une seule fois
        currentPaddleSize = gameSettings.paddleSize;
        console.log('🏓 Game started! Paddle size:', currentPaddleSize);
        console.log('   Game ID:', gameId);
    }
    else if (data.type === 'game_paused') {
        pauseOverlay.classList.remove('hidden');
        lobbyInfo.classList.remove('hidden');
    }
    else if (data.type === 'game_resumed') {
        pauseOverlay.classList.add('hidden');
        lobbyInfo.classList.add('hidden');
    }
    else if (data.type === 'game_state_update') {
        if (!isGameOver && !isPaused) {
            gameState = data.state;
                        
            drawGame();
        }
    }
    else if (data.type === 'game_over') {
        winnerId = data.winnerId;
        isGameOver = true;

        // Utiliser le vrai username si disponible
        let winnerName = `Player ${winnerId}`;
        if (winnerId === 1 && window.currentUser) {
            winnerName = window.currentUser.username;
        }

        const loserIds = [];

        // Determiner les perdants
        for (let i = 1; i <= totalPlayers; i++) {
            if (i !== winnerId) {
                loserIds.push(i);
            }
        }

        // Enregistrer les scores dans le leaderboard
        updateLeaderboardScore(winnerName, true).then(() => {
            console.log(`✅ ${winnerName} victory recorded in leaderboard`);
        });

        loserIds.forEach(loserId => {
            let loserName = `Player ${loserId}`;
            if (loserId === 1 && window.currentUser) {
                loserName = window.currentUser.username;
            }
        
            updateLeaderboardScore(loserName, false).then(() => {
                console.log(`✅ ${loserName} defeat recorded in leaderboard`);
            });
        });

        const color = winnerId === 1 ? '#667eea' : '#764ba2';
        createExplosion(canvas.width / 2, canvas.height / 2, color);

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        renderGameOver();

        setTimeout(() => {
            isGameOver = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            canvasContainer.classList.add('hidden');
            lobbyInfo.classList.remove('hidden');
            startBtn.classList.remove('hidden');
            startBtn.disabled = false;
            startBtn.textContent = "START GAME";
            gameState = null;
            particles = [];

            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 5000);
    }
}

function updatePlayerStatus(playerId, connected) {
    playersConnected[playerId] = connected;

    const card = document.getElementById(`p${playerId}Card`);
    const status = document.getElementById(`p${playerId}Status`);

    if (card && status) {
        if (connected) {
            card.classList.add('connected');
            status.textContent = 'Ready!';
        } else {
            card.classList.remove('connected');
            status.textContent = 'Waiting...';
        }
    }

    let allConnected = true;
    for (let i = 1; i <= totalPlayers; i++) {
        if (!playersConnected[i]) {
            allConnected = false;
            break;
        }
    }

    if (allConnected) {
        startBtn.disabled = false;
        startBtn.textContent = "START GAME";
    } else {
        startBtn.disabled = true;
        startBtn.textContent = "Waiting for Players...";
    }
}

function startGame() {
    if (ws) {
        ws.send(JSON.stringify({ type: 'start_game' }));
    }
}

function drawGame() {
    if (!gameState || isPaused) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#333';
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // P1 (Left) - Paddle vertical
    ctx.fillStyle = '#667eea';
    if (gameState.players_position && gameState.players_position[0]) {
        ctx.fillRect(gameState.players_position[0].x, gameState.players_position[0].y, 10, currentPaddleSize);
    }

    // P2 (Right) - Paddle vertical
    ctx.fillStyle = '#764ba2';
    if (gameState.players_position && gameState.players_position[1]) {
        ctx.fillRect(gameState.players_position[1].x - 10, gameState.players_position[1].y, 10, currentPaddleSize);
    }

    // P3 (Top) - Paddle horizontal
    ctx.fillStyle = '#4caf50';
    if (gameState.players_position && gameState.players_position[2]) {
        ctx.fillRect(gameState.players_position[2].x, gameState.players_position[2].y, currentPaddleSize, 10);
    }

    // P4 (Bottom) - Paddle horizontal
    ctx.fillStyle = '#ff9800';
    if (gameState.players_position && gameState.players_position[3]) {
        ctx.fillRect(gameState.players_position[3].x, gameState.players_position[3].y - 10, currentPaddleSize, 10);
    }

    // Ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(gameState.ball_position.x, gameState.ball_position.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 10;
    ctx.shadowColor = "white";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Scores
    if (gameState.score) {
        ctx.font = "bold 48px sans-serif";
        ctx.textAlign = "center";

        if (gameState.score.length === 2) {
            ctx.fillStyle = "rgba(102, 126, 234, 0.5)";
            ctx.fillText(gameState.score[0], canvas.width / 4, 60);

            ctx.fillStyle = "rgba(118, 75, 162, 0.5)";
            ctx.fillText(gameState.score[1], (canvas.width / 4) * 3, 60);
        }
        else {
            ctx.font = "bold 32px sans-serif";

            ctx.fillStyle = "rgba(102, 126, 234, 0.7)";
            ctx.fillText(gameState.score[0], 40, canvas.height / 2);

            ctx.fillStyle = "rgba(118, 75, 162, 0.7)";
            ctx.fillText(gameState.score[1], canvas.width - 40, canvas.height / 2);

            if (gameState.score.length >= 3) {
                ctx.fillStyle = "rgba(76, 175, 80, 0.7)";
                ctx.fillText(gameState.score[2], canvas.width / 2, 40);
            }

            if (gameState.score.length >= 4) {
                ctx.fillStyle = "rgba(255, 152, 0, 0.7)";
                ctx.fillText(gameState.score[3], canvas.width / 2, canvas.height - 20);
            }
        }
    }
}