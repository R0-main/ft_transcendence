import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import websocketPlugin from '@fastify/websocket';
import { ApiRoutes, WebsocketRoutes } from './api/routes';
import path from 'path';
import { fileURLToPath } from 'url';
import {Game} from './game/game';
import GamesManager from './game/games.manager';
import { DatabaseManager } from './database/database';
import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import cookie from '@fastify/cookie';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FastifyApp {

    public static readonly PORT = 4000;
    public static readonly HOST = '0.0.0.0';

    public current_games: Map<string, Game> = new Map();

    public games_manager: GamesManager = new GamesManager();

    public instance =  Fastify({ 
      logger: true 
    });

    constructor ()
    {
    }

    async initialize()
    {
        DatabaseManager.getInstance();
        
        // Register cookie plugin FIRST
        this.instance.register(cookie, {
            secret: process.env.COOKIE_SECRET,
            hook: 'onRequest',
            parseOptions: {} 
        });

        // Then register CORS with proper credentials handling
        await this.instance.register(cors, {
            origin: process.env.FRONTEND_URL || 'https://localhost:8443',
            credentials: true
        });
        await this.instance.register(Swagger);
        await this.instance.register(SwaggerUI);

        await this.instance.register(websocketPlugin);
        // await this.instance.register(staticPlugin, {
        //     root: path.join(__dirname, '../static')
        // });
        
        await ApiRoutes.registerAll(this);
        await WebsocketRoutes.registerAll(this);

        await this.instance.ready()
        this.instance.swagger()
    }

    async listen()
    {
        await this.instance.listen({ port: FastifyApp.PORT, host: FastifyApp.HOST });
        console.log(`🚀 Backend running on port ${FastifyApp.PORT}`);
    }
}