import { FastifyApp } from "../../fastify";
import Player from "../player";
import { Game, GameSettings } from "../game";

export class ThreePlayersGame extends Game {
    // MODIFIER LE CONSTRUCTEUR pour accepter settings
    constructor(app: FastifyApp, gameId: string, settings?: GameSettings) {
        super(app, gameId, settings);  // ← PASSER settings au parent
        
    this.players = [
        new Player(1, null, this.settings.paddleSize), 
        new Player(2, null, this.settings.paddleSize), 
        new Player(3, null, this.settings.paddleSize)
    ];
    }

    protected initializeGame() {
        this.state.score = [0, 0, 0];
        
        // APPLIQUER LA VITESSE DE LA BALLE selon settings
        this.ball.resetBall(this.settings.ballSpeed);
        
        this.players[0].position = { x: 0, y: 800 / 2 - 25 }; // Left, Centered in 800h
        this.players[1].position = { x: 800, y: 800 / 2 - 25 }; // Right
        this.players[2].position = { x: 800 / 2 - 25, y: 0 }; // Top
        
        // Manual override for ball reset to center of 800x800
        this.ball.position = { x: 400, y: 400 };
    }
    
    protected updatePhysics() {
        // Custom physics loop for 3 players (Squared 800x800)
        
        for (const player of this.players) {
            // Pass 750 as maxY override for P1/P2 on 800h map
            player.update(750);
        }
        
        // Custom Ball Update for Square Map
        
        const ball = this.ball;
        ball.position.x += ball.velocity.x;
        ball.position.y += ball.velocity.y;

        // Wall Collisions
        // P3 is Top (y=0). P4 is Bottom (y=800).
        // 3-Player: Bottom is Wall. Top is P3.
        
        // Bottom Wall (Bounce) - In 3 player game, bottom is a safe wall
        if (ball.position.y + 7 >= 800) {
            ball.velocity.y = -ball.velocity.y;
            ball.position.y = 793;
        }
        
        // Scoring Logic
        let missedPlayerId = -1;

        // Top (P3 Missed)
        if (ball.position.y < 0) {
             if (this.ball.lastTouchedBy === null) {
                 ball.velocity.y = -ball.velocity.y;
                 ball.position.y = 7;
             } else {
                 missedPlayerId = 3;
             }
        }
        // Left (P1 Missed)
        else if (ball.position.x < 0) { 
             if (this.ball.lastTouchedBy === null) {
                 ball.velocity.x = -ball.velocity.x;
                 ball.position.x = 7;
             } else {
                 missedPlayerId = 1;
             }
        } 
        // Right (P2 Missed)
        else if (ball.position.x > 800) { 
             if (this.ball.lastTouchedBy === null) {
                 ball.velocity.x = -ball.velocity.x;
                 ball.position.x = 793;
             } else {
                 missedPlayerId = 2;
             }
        }

        if (missedPlayerId !== -1) {
            // Only score if someone touched the ball
            if (this.ball.lastTouchedBy !== null) {
                // Score goes to the last player who touched the ball
                const scorerIndex = this.ball.lastTouchedBy - 1;
                if (scorerIndex >= 0 && scorerIndex < 3) {
                    this.state.score[scorerIndex]++;
                }
                
                // UTILISER settings.winScore au lieu de 5
                const maxScore = Math.max(...this.state.score);
                if (maxScore >= this.settings.winScore) {
                     // Winner is the one with max score
                     const winnerIndex = this.state.score.indexOf(maxScore);
                     this.stop();
                     this.broadcast({ type: 'game_over', winnerId: winnerIndex + 1 });
                     return;
                }
            }

            this.ball.position = { x: 400, y: 400 };
            this.ball.resetBall(this.settings.ballSpeed); 
        }

        // Paddles - PASSER paddleSize
        // P1 (Left)
        this.ball.checkPaddleCollision(this.players[0].position.x, this.players[0].position.y, 1, this.settings.paddleSize);
        // P2 (Right)
        this.ball.checkPaddleCollision(this.players[1].position.x - 10, this.players[1].position.y, 2, this.settings.paddleSize);
        
        // P3 (Top - Horizontal) - UTILISER paddleSize
        const p3 = this.players[2];
        if (ball.position.y - 7 <= p3.position.y + 10 && 
            ball.position.y + 7 >= p3.position.y &&
            ball.position.x + 7 >= p3.position.x &&
            ball.position.x - 7 <= p3.position.x + this.settings.paddleSize) {
             
             this.ball.lastTouchedBy = 3;
             ball.velocity.y = -ball.velocity.y * 1.05;
             ball.position.y = p3.position.y + 10 + 7;
        }
    }
}