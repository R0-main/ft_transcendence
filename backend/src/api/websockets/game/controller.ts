import { FastifyApp } from "../../../fastify";
import WebsocketRoute from "../../websocket";

export default class GameControllerWebsocketRoute extends WebsocketRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/game/:gameId/:playerId/controller_socket', async (connection, request) => {
            const gameId = (request.params as any).gameId;
            const playerId = parseInt((request.params as any).playerId);
            
            const game = app.games_manager.getGame(gameId);
            if (!game) {
                console.log(`Game ${gameId} not found`);
                connection.close(1008, 'Game not found');
                return;
            }

            const playerIndex = playerId - 1;

            if (!game.players[playerIndex]) {
                console.log(`Player ${playerId} does not exist in game ${gameId}`);
                connection.close(1008, 'Player not found');
                return;
            }
            
            if (game.players[playerIndex].controller) {
                console.log(`Player ${playerId} controller already connected to game ${gameId}`);
                connection.close(1008, `Player ${playerId} controller already connected`);
                return;
            }
            
            // Connect controller
            game.players[playerIndex].controller = connection;
            game.notifyPlayerConnection(playerId, true);
            
            console.log(`Client controller connected to game ${gameId} as Player ${playerId}`);
            connection.send(`Connected to the game ${gameId} WebSocket server!`);
            
            connection.on('message', (message: any) => {
                const data = JSON.parse(message.toString());
                if (data.type === 'controller')
                {
                    game.broadcast({ type: 'message', message: `Received command from player ${playerId}: ${data.command}` });
                    if (game.players[playerIndex])
                    {
                        game.players[playerIndex].setDirection(data.command);
                    }
                }
            });

            connection.on('close', () => {
                if (game.players[playerIndex])
                {
                    game.players[playerIndex].controller = null;
                    game.notifyPlayerConnection(playerId, false);
                }
            });
        }, {
            description: 'WebSocket endpoint for player controller input',
            tags: ['websocket'],
            params: {
                type: 'object',
                properties: {
                    gameId: { type: 'string', description: 'The game ID' },
                    playerId: { type: 'string', description: 'The player ID (1-based)' }
                }
            }
        });
    }
}