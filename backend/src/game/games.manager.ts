import { FastifyApp } from "../fastify";
import { Game } from "./game";
import { TwoPlayersGame } from "./modes/twoPlayersGame";
import { ThreePlayersGame } from "./modes/threePlayersGame";
import { FourPlayersGame } from "./modes/fourPlayersGame";

// AJOUTER CETTE INTERFACE
export interface GameSettings {
    paddleSize: number;
    ballSpeed: number;
    winScore: number;
    players?: Array<{
        username: string;
        userId: number | null;
    }>;
}

export default class GamesManager {
    private instances: Map<string, Game> = new Map();

    // AJOUTER LE PARAMÈTRE settings
    public createGame(app: any, gameId: string, mode: string, settings: GameSettings): Game {
        let game: Game;

        switch (mode) {
            case '2players':
                game = new TwoPlayersGame(app, gameId, settings);
                break;
            case '3players':
                game = new ThreePlayersGame(app, gameId, settings);
                break;
            case '4players':
                game = new FourPlayersGame(app, gameId, settings);
                break;
            default:
                throw new Error("Invalid game mode");
        }

        this.instances.set(gameId, game);
        return game;
    }

    public getGame(gameId: string): Game | undefined {
        return this.instances.get(gameId);
    }

    public deleteGame(gameId: string): boolean {
        this.instances.get(gameId)?.destroy();
        return this.instances.delete(gameId);
    }
}