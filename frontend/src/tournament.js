
const Tournament = {
        state: {
        players: [], // [name1, name2, name3, name4]
        matches: [], // [ {p1, p2, winner}, {p1, p2, winner}, {p1, p2, winner} ]
        currentMatchIndex: 0,
        gameActive: false,
        keys: {},
        ball: { x: 400, y: 200, dx: 4, dy: 4, radius: 6, speed: 4, touched: false },
        paddles: { 
            left: { x: 0, y: 160, width: 10, height: 80, score: 0 },
            right: { x: 790, y: 160, width: 10, height: 80, score: 0 }
        },
        animationId: null,
        winScore: 3
    },

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="view">
                <button class="back-btn" onclick="Router.navigate('home')">← Back to Home</button>
                <div class="game-header">
                    <h2>Tournament Mode</h2>
                </div>
                <div id="tournament-content">
                    ${this.getSetupHTML()}
                </div>
            </div>
        `;
        this.bindEvents();
    },

    getSetupHTML() {
        return `
            <div class="lobby-section">
                <h3 style="text-align: center; margin-bottom: 20px;">Enter Player Names</h3>
                
                <div style="text-align: center; margin-bottom: 30px; color: #aaa; font-size: 0.9rem; line-height: 1.6;">
                    <p>🏆 4-Player Local Tournament</p>
                    <p>⚡ Randomized Bracket • First to 3 Points Wins</p>
                    <p>🎮 P1: W/S • P2: Arrows</p>
                </div>

                <div class="settings-grid" style="max-width: 400px; margin: 0 auto;">
                    <input type="text" id="player1" placeholder="Player 1 Name" class="input-code" style="margin-bottom: 10px;">
                    <input type="text" id="player2" placeholder="Player 2 Name" class="input-code" style="margin-bottom: 10px;">
                    <input type="text" id="player3" placeholder="Player 3 Name" class="input-code" style="margin-bottom: 10px;">
                    <input type="text" id="player4" placeholder="Player 4 Name" class="input-code" style="margin-bottom: 10px;">
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button id="startTournamentBtn" class="start-game-btn">Start Tournament</button>
                </div>
            </div>
        `;
    },

    bindEvents() {
        const startBtn = document.getElementById('startTournamentBtn');
        if (startBtn) {
            startBtn.onclick = () => this.startTournament();
        }
    },

    startTournament() {
        const p1 = document.getElementById('player1').value || 'Player 1';
        const p2 = document.getElementById('player2').value || 'Player 2';
        const p3 = document.getElementById('player3').value || 'Player 3';
        const p4 = document.getElementById('player4').value || 'Player 4';

        // Shuffle players
        let players = [p1, p2, p3, p4];
        players = players.sort(() => Math.random() - 0.5);

        this.state.players = players;
        this.state.matches = [
            { p1: players[0], p2: players[1], winner: null }, // Semi 1
            { p1: players[2], p2: players[3], winner: null }, // Semi 2
            { p1: null, p2: null, winner: null }              // Final
        ];
        this.state.currentMatchIndex = 0;
        
        this.showMatchReady();
    },

    showMatchReady() {
        const content = document.getElementById('tournament-content');
        const match = this.state.matches[this.state.currentMatchIndex];
        let title = this.state.currentMatchIndex === 2 ? "FINAL MATCH" : `SEMI-FINAL ${this.state.currentMatchIndex + 1}`;

        // Get previous match result if available
        let previousMatchHtml = '';
        if (this.state.currentMatchIndex > 0) {
            const prevMatch = this.state.matches[this.state.currentMatchIndex - 1];
            previousMatchHtml = `
                <div style="margin-bottom: 40px; text-align: center; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                    <h4 style="color: #aaa; margin-bottom: 10px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Previous Match Result</h4>
                    <p style="font-size: 1.2rem; color: #fff;">
                        <span style="color: #667eea; font-weight: bold;">${prevMatch.winner}</span> defeated <span style="color: #ff6b6b;">${prevMatch.winner === prevMatch.p1 ? prevMatch.p2 : prevMatch.p1}</span>
                    </p>
                </div>
            `;
        }

        content.innerHTML = `
            <div class="lobby-section">
                ${previousMatchHtml}
                
                <h2 style="text-align: center; color: #667eea; margin-bottom: 30px; font-size: 2.5rem; text-transform: uppercase; letter-spacing: 2px;">${title}</h2>
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 30px; margin-bottom: 50px; flex-wrap: wrap;">
                    <!-- Player 1 -->
                    <div style="width: 320px; background: rgba(102, 126, 234, 0.1); border: 2px solid rgba(102, 126, 234, 0.3); border-radius: 15px; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);">
                        <div style="font-size: 4rem; margin-bottom: 15px;">👤</div>
                        <h3 style="font-size: 1.8rem; margin: 0 0 20px 0; color: #667eea; word-break: break-word; min-height: 60px; display: flex; align-items: center; justify-content: center;">${match.p1}</h3>
                        <div style="padding: 15px 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                            <p style="margin: 0; font-size: 0.9rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">Controls</p>
                            <p style="margin: 8px 0 0; font-weight: bold; color: #fff; font-size: 1.4rem;">W / S</p>
                        </div>
                    </div>

                    <div style="font-size: 3rem; font-weight: 900; color: rgba(255,255,255,0.1); font-style: italic; text-shadow: 0 0 10px rgba(255,255,255,0.1);">
                        VS
                    </div>

                    <!-- Player 2 -->
                    <div style="width: 320px; background: rgba(118, 75, 162, 0.1); border: 2px solid rgba(118, 75, 162, 0.3); border-radius: 15px; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(118, 75, 162, 0.2);">
                        <div style="font-size: 4rem; margin-bottom: 15px;">👤</div>
                        <h3 style="font-size: 1.8rem; margin: 0 0 20px 0; color: #764ba2; word-break: break-word; min-height: 60px; display: flex; align-items: center; justify-content: center;">${match.p2}</h3>
                        <div style="padding: 15px 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                            <p style="margin: 0; font-size: 0.9rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">Controls</p>
                            <p style="margin: 8px 0 0; font-weight: bold; color: #fff; font-size: 1.4rem;">↑ / ↓</p>
                        </div>
                    </div>
                </div>

                <div style="text-align: center;">
                    <button id="startMatchBtn" class="start-game-btn" style="padding: 18px 50px; font-size: 1.3rem; letter-spacing: 1px;">START MATCH</button>
                </div>
            </div>
        `;

        document.getElementById('startMatchBtn').onclick = () => this.startMatch();
    },

    startMatch() {
        const content = document.getElementById('tournament-content');
        content.innerHTML = `
            <div class="canvas-container">
                <canvas id="tourneyCanvas" width="800" height="400"></canvas>
                <div style="text-align: center; margin-top: 10px; color: #aaa;">
                    ${this.state.matches[this.state.currentMatchIndex].p1} (W/S) vs ${this.state.matches[this.state.currentMatchIndex].p2} (↑/↓)
                </div>
            </div>
        `;

        this.initGame();
    },

    initGame() {
        const canvas = document.getElementById('tourneyCanvas');
        this.ctx = canvas.getContext('2d');
        this.state.gameActive = true;
        
        // Reset Ball and Paddles
        this.state.ball = { x: 400, y: 200, dx: this.state.ball.speed * (Math.random() > 0.5 ? 1 : -1), dy: this.state.ball.speed * (Math.random() > 0.5 ? 1 : -1), radius: 6, speed: 5, touched: false };
        this.state.paddles.left.y = 160;
        this.state.paddles.right.y = 160;
        this.state.paddles.left.score = 0;
        this.state.paddles.right.score = 0;

        // Input listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);

        // Game Loop
        this.gameLoop();
    },

    handleKeyDown(e) {
        Tournament.state.keys[e.key] = true;
    },

    handleKeyUp(e) {
        Tournament.state.keys[e.key] = false;
    },

    gameLoop() {
        if (!Tournament.state.gameActive) return;

        Tournament.update();
        Tournament.draw();
        Tournament.state.animationId = requestAnimationFrame(Tournament.gameLoop);
    },

    update() {
        const s = this.state;
        const paddleSpeed = 6;

        // Paddle Movement
        if (s.keys['w'] || s.keys['W']) s.paddles.left.y -= paddleSpeed;
        if (s.keys['s'] || s.keys['S']) s.paddles.left.y += paddleSpeed;
        if (s.keys['ArrowUp']) s.paddles.right.y -= paddleSpeed;
        if (s.keys['ArrowDown']) s.paddles.right.y += paddleSpeed;

        // Clamp paddles
        s.paddles.left.y = Math.max(0, Math.min(400 - s.paddles.left.height, s.paddles.left.y));
        s.paddles.right.y = Math.max(0, Math.min(400 - s.paddles.right.height, s.paddles.right.y));

        // Ball Movement
        s.ball.x += s.ball.dx;
        s.ball.y += s.ball.dy;

        // Wall Collision (Top/Bottom)
        if (s.ball.y - s.ball.radius < 0 || s.ball.y + s.ball.radius > 400) {
            s.ball.dy *= -1;
        }

        // Paddle Collision
        // Left
        if (s.ball.x - s.ball.radius < s.paddles.left.x + s.paddles.left.width &&
            s.ball.y > s.paddles.left.y && s.ball.y < s.paddles.left.y + s.paddles.left.height) {
            s.ball.dx *= -1;
            s.ball.x = s.paddles.left.x + s.paddles.left.width + s.ball.radius;
            s.ball.speed += 0.2;
            s.ball.touched = true;
        }
        // Right
        if (s.ball.x + s.ball.radius > s.paddles.right.x &&
            s.ball.y > s.paddles.right.y && s.ball.y < s.paddles.right.y + s.paddles.right.height) {
            s.ball.dx *= -1;
            s.ball.x = s.paddles.right.x - s.ball.radius;
            s.ball.speed += 0.2;
            s.ball.touched = true;
        }

        // Scoring
        if (s.ball.x < 0) {
            if (s.ball.touched) {
                s.paddles.right.score++;
                this.resetBall();
            } else {
                s.ball.dx *= -1;
            }
        } else if (s.ball.x > 800) {
            if (s.ball.touched) {
                s.paddles.left.score++;
                this.resetBall();
            } else {
                s.ball.dx *= -1;
            }
        }

        // Win Condition
        if (s.paddles.left.score >= s.winScore || s.paddles.right.score >= s.winScore) {
            this.endMatch(s.paddles.left.score >= s.winScore ? 0 : 1); // 0 for left (p1), 1 for right (p2)
        }
    },

    resetBall() {
        this.state.ball.x = 400;
        this.state.ball.y = 200;
        this.state.ball.speed = 5;
        this.state.ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
        this.state.ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
        this.state.ball.touched = false;
    },

    draw() {
        const ctx = this.ctx;
        const s = this.state;

        // Clear
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 800, 400);

        // Net
        ctx.strokeStyle = '#333';
        ctx.setLineDash([10, 15]);
        ctx.beginPath();
        ctx.moveTo(400, 0);
        ctx.lineTo(400, 400);
        ctx.stroke();

        // Paddles
        ctx.fillStyle = '#667eea'; // Left
        ctx.fillRect(s.paddles.left.x, s.paddles.left.y, s.paddles.left.width, s.paddles.left.height);
        
        ctx.fillStyle = '#764ba2'; // Right
        ctx.fillRect(s.paddles.right.x, s.paddles.right.y, s.paddles.right.width, s.paddles.right.height);

        // Ball
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.ball.x, s.ball.y, s.ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Scores
        ctx.font = "bold 48px sans-serif";
        ctx.fillStyle = "rgba(102, 126, 234, 0.5)";
        ctx.fillText(s.paddles.left.score, 200, 60);
        ctx.fillStyle = "rgba(118, 75, 162, 0.5)";
        ctx.fillText(s.paddles.right.score, 600, 60);
    },

    endMatch(winnerIndex) {
        this.state.gameActive = false;
        cancelAnimationFrame(this.state.animationId);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);

        const currentMatch = this.state.matches[this.state.currentMatchIndex];
        const winnerName = winnerIndex === 0 ? currentMatch.p1 : currentMatch.p2;
        currentMatch.winner = winnerName;

        // Update Final bracket if needed
        if (this.state.currentMatchIndex === 0) {
            this.state.matches[2].p1 = winnerName;
        } else if (this.state.currentMatchIndex === 1) {
            this.state.matches[2].p2 = winnerName;
        }

        if (this.state.currentMatchIndex === 2) {
            this.showTournamentWinner();
        } else {
            this.showMatchResult(winnerName);
        }
    },

    showMatchResult(winnerName) {
        const content = document.getElementById('tournament-content');
        content.innerHTML = `
            <div class="lobby-section" style="text-align: center; padding: 50px 20px;">
                <div style="font-size: 5rem; margin-bottom: 20px; animation: pulse 2s infinite;">🏆</div>
                <h3 style="color: #aaa; letter-spacing: 3px; font-size: 1rem; margin-bottom: 15px; text-transform: uppercase;">Match Winner</h3>
                <h1 style="font-size: 4rem; margin: 0 0 50px 0; background: linear-gradient(135deg, #667eea, #764ba2, #4facfe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; line-height: 1.2;">
                    ${winnerName}
                </h1>
                
                <div>
                    <button id="nextMatchBtn" class="start-game-btn" style="font-size: 1.3rem; padding: 18px 50px;">
                        Next Match ➔
                    </button>
                </div>
            </div>
        `;
        document.getElementById('nextMatchBtn').onclick = () => this.nextStep();
    },

    nextStep() {
        this.state.currentMatchIndex++;
        if (this.state.currentMatchIndex < 3) {
            this.showMatchReady();
        } else {
            this.showTournamentWinner();
        }
    },

    showTournamentWinner() {
        const winner = this.state.matches[2].winner;
        const content = document.getElementById('tournament-content');
        content.innerHTML = `
            <div class="lobby-section">
                <h1 style="text-align: center; font-size: 3rem; color: #ffd700;">🏆 TOURNAMENT CHAMPION 🏆</h1>
                <h2 style="text-align: center; font-size: 2.5rem; margin: 20px 0;">${winner}</h2>
                <div style="text-align: center; margin-top: 40px;">
                    <button class="start-game-btn" onclick="Tournament.render()">New Tournament</button>
                    <button class="back-btn" onclick="Router.navigate('home')">← Back to Home</button>
                </div>
            </div>
        `;
    }
};
