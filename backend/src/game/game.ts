import { FastifyApp } from "../fastify";
import type { WebSocket } from '@fastify/websocket';
import Player from "./player";
import Ball from "./ball";

export type Vector2 = { x: number; y: number; };

export type GameState = {
    players_position: Vector2[];
    ball_position: Vector2;
    ball_velocity: Vector2;
    score: number[];
};

// AJOUTER L'INTERFACE GameSettings
export interface GameSettings {
    paddleSize: number;
    ballSpeed: number;
    winScore: number;
}

export abstract class Game {

    public players : Player[] = [];
    public ball: Ball = new Ball();

    // AJOUTER les settings
    public settings: GameSettings;

    public state: GameState = {
        players_position: [],
        ball_position: { x: 0, y: 0 },
        ball_velocity: { x: 0, y: 0 },
        score: [],
    };

    protected gameLoop: NodeJS.Timeout | null = null;
    protected websocket: WebSocket | null = null;
    public isActive: boolean = false;

    protected lastFrameTime: number = 0;
    protected accumulator: number = 0;
    protected readonly TARGET_FPS = 80;
    protected readonly TIME_STEP = 1000 / this.TARGET_FPS; 

    protected timeSinceLastBroadcast: number = 0;
    protected readonly NETWORK_FPS = 30; 
    protected readonly NETWORK_TICK = 1000 / this.NETWORK_FPS;

    // MODIFIER LE CONSTRUCTEUR pour accepter settings
    constructor(protected app: FastifyApp, public gameId: string, settings?: GameSettings) {
        console.log(`Game ${this.gameId} created`);
        
        // Valeurs par défaut si pas de settings
        this.settings = settings || {
            paddleSize: 50,
            ballSpeed: 3,
            winScore: 11
        };

        console.log(`Game settings:`, this.settings);
    }

    public setWebsocket(websocket: WebSocket) {
        this.websocket = websocket;
    }

    public getWebsocket() {
        return this.websocket;
    }

    public notifyPlayerConnection(playerId: number, connected: boolean) {
        this.broadcast({ type: 'player_connection', playerId, connected });
        
        if (this.isActive) {
            if (connected) {
                // If all players with controllers are connected, resume the game
                const allConnected = this.players.every(p => p.controller);
                if (allConnected) {
                    console.log("Resuming game...");
                    this.startGameLoop();
                    this.broadcast({ type: 'game_resumed' });
                }
            } else {
                // If any player disconnects, pause the game
                console.log("Pausing game...");
                this.stopGameLoop();
                this.broadcast({ type: 'game_paused' });
            }
        }
    }

    public broadcast(message: any) {
        if (!this.websocket) return;
        if (this.websocket.readyState === 1) {
            this.websocket.send(JSON.stringify(message));
        }
    }

    public update_game_state(state: GameState) {
        this.state = state;
        this.updateGameState();
    }

    public destroy() {
        this.websocket?.close();
        for (const player of this.players) {
            player.controller?.close();
        }
        this.stopGameLoop();
        console.log(`Game ${this.gameId} destroyed`);
    }

    public start() {
        if (!this.isActive) {
            this.isActive = true;
            this.initializeGame();
            this.startGameLoop();
            console.log('Game started');
            this.broadcast({ type: 'game_started' });
        }
    }

    public stop() {
        this.isActive = false;
        console.log('Game stopped');
        this.stopGameLoop();
        this.broadcast({ type: 'game_stopped' });
    }

    protected startGameLoop() {
        if (this.gameLoop) return;

        this.lastFrameTime = performance.now();
        this.accumulator = 0;
        this.timeSinceLastBroadcast = 0;

        this.gameLoop = setInterval(() => {
            this.tick();
        }, 1000 / this.TARGET_FPS); 
    }

    protected stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    protected tick() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;

        this.accumulator += deltaTime;

        if (this.accumulator > 200) {
            this.accumulator = 200;
        }

        while (this.accumulator >= this.TIME_STEP) {
            this.updatePhysics();
            this.accumulator -= this.TIME_STEP;
        }

        this.timeSinceLastBroadcast += deltaTime;
        if (this.timeSinceLastBroadcast >= this.NETWORK_TICK) {
            this.updateGameState();
            this.timeSinceLastBroadcast = 0;
        }
    }

    protected updateGameState() {
        this.state.ball_position = this.ball.getPosition();
        this.state.ball_velocity = this.ball.getVelocity();
        // Players position updates are handled by concrete classes or general logic if uniform
        for (let i = 0; i < this.players.length; i++) {
             if (this.players[i]) {
                 this.state.players_position[i] = this.players[i].getPosition();
             }
        }
        
        // ENVOYER paddleSize au frontend
        this.broadcast({ 
            type: 'game_state_update', 
            state: this.state,
            paddleSize: this.settings.paddleSize
        });
    }

    protected updatePhysics() {
        // Update players
        for (const player of this.players) {
            player.update();
        }

        // Update ball
        const scorer = this.ball.update();
        if (scorer !== 0) {
            // Only score if someone touched the ball
            if (this.ball.lastTouchedBy !== null) {
                if (scorer === 1) this.state.score[0]++;
                else if (scorer === 2) this.state.score[1]++;

                // UTILISER settings.winScore au lieu de 5
                if (this.state.score[0] >= this.settings.winScore || this.state.score[1] >= this.settings.winScore) {
                    this.stop();
                    this.broadcast({ type: 'game_over', winnerId: this.state.score[0] >= this.settings.winScore ? 1 : 2 });
                    return;
                }
            }
            this.ball.resetBall(this.settings.ballSpeed);
        }

        // Check paddle collisions - generic for 2 players for now, can be overridden
        if (this.players.length >= 2) {
             this.ball.checkPaddleCollision(this.players[0].position.x, this.players[0].position.y, 1, this.settings.paddleSize);
             this.ball.checkPaddleCollision(this.players[1].position.x - 10, this.players[1].position.y, 2, this.settings.paddleSize);
        }
    }

    // Abstract methods to be implemented by specific game types
    protected abstract initializeGame(): void;
}