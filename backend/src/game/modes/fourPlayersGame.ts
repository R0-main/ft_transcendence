import { FastifyApp } from "../../fastify";
import Player from "../player";
import { Game, GameSettings } from "../game";

export class FourPlayersGame extends Game {
    // MODIFIER LE CONSTRUCTEUR pour accepter settings
    constructor(app: FastifyApp, gameId: string, settings?: GameSettings) {
        super(app, gameId, settings);  // ← PASSER settings au parent
        
        this.players = [
            new Player(1, null, this.settings.paddleSize), 
            new Player(2, null, this.settings.paddleSize), 
            new Player(3, null, this.settings.paddleSize), 
            new Player(4, null, this.settings.paddleSize)
        ];
        this.state.players_position = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
        this.state.score = [0, 0, 0, 0];
    }

    protected initializeGame() {
        this.state.score = [0, 0, 0, 0];
        
        // APPLIQUER LA VITESSE DE LA BALLE selon settings
        this.ball.resetBall(this.settings.ballSpeed);
        
        this.players[0].position = { x: 0, y: 800 / 2 - 25 }; // Left
        this.players[1].position = { x: 800, y: 800 / 2 - 25 }; // Right
        this.players[2].position = { x: 800 / 2 - 25, y: 0 }; // Top
        this.players[3].position = { x: 800 / 2 - 25, y: 800 }; // Bottom
        
        this.ball.position = { x: 400, y: 400 };
    }
    
    protected updatePhysics() {
        for (const player of this.players) {
            player.update(750);
        }
        
        const ball = this.ball;
        ball.position.x += ball.velocity.x;
        ball.position.y += ball.velocity.y;
        
        let missedPlayerId = -1;

        if (ball.position.x < 0) {
            if (this.ball.lastTouchedBy === null) {
                ball.velocity.x = -ball.velocity.x;
                ball.position.x = 7;
            } else {
                missedPlayerId = 1;
            }
        }      
        else if (ball.position.x > 800) {
            if (this.ball.lastTouchedBy === null) {
                ball.velocity.x = -ball.velocity.x;
                ball.position.x = 793;
            } else {
                missedPlayerId = 2;
            }
        } 
        else if (ball.position.y < 0) {
            if (this.ball.lastTouchedBy === null) {
                ball.velocity.y = -ball.velocity.y;
                ball.position.y = 7;
            } else {
                missedPlayerId = 3;
            }
        }   
        else if (ball.position.y > 800) {
            if (this.ball.lastTouchedBy === null) {
                ball.velocity.y = -ball.velocity.y;
                ball.position.y = 793;
            } else {
                missedPlayerId = 4;
            }
        } 

        if (missedPlayerId !== -1) {
            // Only score if someone touched the ball
            if (this.ball.lastTouchedBy !== null) {
                // Score goes to the last player who touched the ball
                const scorerIndex = this.ball.lastTouchedBy - 1;
                if (scorerIndex >= 0 && scorerIndex < 4) {
                    this.state.score[scorerIndex]++;
                }
                
                // UTILISER settings.winScore au lieu de 5
                const maxScore = Math.max(...this.state.score);
                if (maxScore >= this.settings.winScore) {
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
        // P1 & P2
        this.ball.checkPaddleCollision(this.players[0].position.x, this.players[0].position.y, 1, this.settings.paddleSize);
        this.ball.checkPaddleCollision(this.players[1].position.x - 10, this.players[1].position.y, 2, this.settings.paddleSize);
        
        // P3 (Top) - UTILISER paddleSize
        const p3 = this.players[2];
        if (ball.position.y - 7 <= p3.position.y + 10 && 
            ball.position.y + 7 >= p3.position.y &&
            ball.position.x + 7 >= p3.position.x &&
            ball.position.x - 7 <= p3.position.x + this.settings.paddleSize) {
             
             this.ball.lastTouchedBy = 3;
             ball.velocity.y = -ball.velocity.y * 1.05;
             ball.position.y = p3.position.y + 10 + 7;
        }
        
        // P4 (Bottom) - UTILISER paddleSize
        const p4 = this.players[3];
        if (ball.position.y + 7 >= p4.position.y && 
            ball.position.y - 7 <= p4.position.y + 10 &&
            ball.position.x + 7 >= p4.position.x &&
            ball.position.x - 7 <= p4.position.x + this.settings.paddleSize) {
             
             this.ball.lastTouchedBy = 4;
             ball.velocity.y = -ball.velocity.y * 1.05;
             ball.position.y = p4.position.y - 7;
        }
    }
}