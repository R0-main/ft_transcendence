import type { WebSocket } from '@fastify/websocket';

export default class Player {
    public position: { x: number; y: number } = { x: 0, y: 0 };
    public controller: WebSocket | null = null;
    public direction: 'up' | 'down' | 'stop' = 'stop';
    public paddleSize: number = 50; // ← AJOUTER

    constructor(public id: number, controller: WebSocket | null, paddleSize: number = 50) {
        this.id = id;
        this.controller = controller;
        this.paddleSize = paddleSize; // ← AJOUTER
    }

    public getPosition() {
        return this.position;
    }

    public setDirection(direction: 'up' | 'down' | 'stop') {
        this.direction = direction;
    }

    public update(maxYOverride?: number) {
        const speed = 5;

        // P1 & P2 (Vertical)
        if (this.id === 1 || this.id === 2) {
            const minY = 0;
            const maxY = maxYOverride !== undefined ? maxYOverride : (400 - this.paddleSize); // ← UTILISER paddleSize

            if (this.direction === 'up') {
                this.position.y = Math.max(minY, this.position.y - speed);
            } else if (this.direction === 'down') {
                this.position.y = Math.min(maxY, this.position.y + speed);
            }
        } 
        // P3 & P4 (Horizontal)
        else if (this.id === 3 || this.id === 4) {
            const minX = 0;
            const maxX = 800 - this.paddleSize; // ← UTILISER paddleSize

            if (this.direction === 'up') { // Left
                this.position.x = Math.max(minX, this.position.x - speed);
            } else if (this.direction === 'down') { // Right
                this.position.x = Math.min(maxX, this.position.x + speed);
            }
        }
    }
}