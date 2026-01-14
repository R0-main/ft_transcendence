import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";

export default class CreateGameRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/game/create/:mode', 'POST', async (request, reply) => {
            const mode = (request.params as any).mode;
            const gameId = Math.random().toString(36).substring(2, 10);
            
            // Recup les settings + players du body
            const body = (request.body as any) || {};
            
            const gameSettings = {
                paddleSize: body.paddleSize || 50,
                ballSpeed: body.ballSpeed || 3,
                winScore: body.winScore || 11,
                players: body.players || []
            };
            
            console.log('🎮 Creating game with settings:', gameSettings);
            
            try {
                // Passer les settings au game manager
                app.games_manager.createGame(app, gameId, mode, gameSettings);
            } catch (e) {
                reply.code(404).send({ error: "Invalid game mode" });
                return;
            }
            
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                gameId,
                mode,
                settings: gameSettings
            };
        });
    }
}