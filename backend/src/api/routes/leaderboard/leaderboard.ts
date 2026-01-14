// leaderboard.ts - Routes pour le leaderboard (SQLite)

import { FastifyApp } from '../../../fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseManager } from '../../../database/database';

interface UpdateScoreBody {
    player_name: string;
    won: boolean;
}

export default class LeaderboardRoutes {
    constructor(app: FastifyApp) {
        this.registerRoutes(app);
    }

    private registerRoutes(app: FastifyApp) {
        const fastify = app.instance;
        const db = DatabaseManager.getInstance().getDatabase();

        // GET /api/leaderboard - Récupérer le Top 10
        fastify.get('/api/leaderboard', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const leaderboard = db.prepare(`
                    SELECT 
                        id,
                        player_name,
                        wins,
                        losses,
                        total_games,
                        ROUND(win_rate, 2) as win_rate
                    FROM leaderboard
                    ORDER BY wins DESC, win_rate DESC
                    LIMIT 10
                `).all();

                return reply.send({
                    success: true,
                    leaderboard: leaderboard
                });
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                return reply.status(500).send({
                    success: false,
                    error: 'Failed to fetch leaderboard'
                });
            }
        });

        // POST /api/leaderboard/update - Mettre à jour le score d'un joueur
        fastify.post<{ Body: UpdateScoreBody }>(
            '/api/leaderboard/update',
            async (request: FastifyRequest<{ Body: UpdateScoreBody }>, reply: FastifyReply) => {
                try {
                    const { player_name, won } = request.body;

                    if (!player_name) {
                        return reply.status(400).send({
                            success: false,
                            error: 'Player name is required'
                        });
                    }

                    // Vérifier si le joueur existe
                    const existingPlayer = db.prepare(
                        'SELECT * FROM leaderboard WHERE player_name = ?'
                    ).get(player_name);

                    if (!existingPlayer) {
                        // Créer un nouveau joueur
                        db.prepare(`
                            INSERT INTO leaderboard (player_name, wins, losses, total_games, win_rate)
                            VALUES (?, ?, ?, ?, ?)
                        `).run(
                            player_name,
                            won ? 1 : 0,
                            won ? 0 : 1,
                            1,
                            won ? 100.0 : 0.0
                        );
                    } else {
                        // Mettre à jour le joueur existant
                        const newWins = won ? (existingPlayer as any).wins + 1 : (existingPlayer as any).wins;
                        const newLosses = won ? (existingPlayer as any).losses : (existingPlayer as any).losses + 1;
                        const newTotalGames = newWins + newLosses;
                        const newWinRate = (newWins / newTotalGames) * 100;

                        db.prepare(`
                            UPDATE leaderboard 
                            SET wins = ?, 
                                losses = ?, 
                                total_games = ?, 
                                win_rate = ?,
                                updated_at = CURRENT_TIMESTAMP
                            WHERE player_name = ?
                        `).run(newWins, newLosses, newTotalGames, newWinRate, player_name);
                    }

                    // Récupérer les stats mises à jour
                    const updatedPlayer = db.prepare(
                        'SELECT * FROM leaderboard WHERE player_name = ?'
                    ).get(player_name);

                    return reply.send({
                        success: true,
                        player: updatedPlayer
                    });
                } catch (error) {
                    console.error('Error updating leaderboard:', error);
                    return reply.status(500).send({
                        success: false,
                        error: 'Failed to update leaderboard'
                    });
                }
            }
        );

        // GET /api/leaderboard/player/:name - Récupérer les stats d'un joueur
        fastify.get<{ Params: { name: string } }>(
            '/api/leaderboard/player/:name',
            async (request: FastifyRequest<{ Params: { name: string } }>, reply: FastifyReply) => {
                try {
                    const { name } = request.params;

                    const player = db.prepare(
                        'SELECT * FROM leaderboard WHERE player_name = ?'
                    ).get(name);

                    if (!player) {
                        return reply.status(404).send({
                            success: false,
                            error: 'Player not found'
                        });
                    }

                    return reply.send({
                        success: true,
                        player: player
                    });
                } catch (error) {
                    console.error('Error fetching player stats:', error);
                    return reply.status(500).send({
                        success: false,
                        error: 'Failed to fetch player stats'
                    });
                }
            }
        );
    }
}