import { HTTPMethods, RouteShorthandOptions } from "fastify";
import { FastifyApp } from "../fastify";

export interface WebsocketRouteOptions {
    description?: string;
    tags?: string[];
    params?: Record<string, any>;
}

export default class WebsocketRoute
{
    constructor(app: FastifyApp, path: string, callback: (connection: any, reply: any) => Promise<any>, options?: WebsocketRouteOptions)
    {
        app.instance.log.info(`Registering route [WS] ${path}`);
        
        // Register the actual WebSocket route
        app.instance.route({
            method: 'GET',
            url: path,
            websocket: true,
            handler: async (connection, reply) => {
                return callback(connection, reply);
            },
        });

        // Register a documentation-only route for Swagger
        // Using a different path suffix to avoid conflicts
        app.instance.route({
            method: 'GET',
            url: `${path}/docs`,
            schema: {
                description: `🔌 **WebSocket Endpoint**\n\n${options?.description || `Connect via WebSocket to: \`${path}\``}\n\n> ⚠️ This is a WebSocket endpoint. Use a WebSocket client to connect to \`${path}\``,
                tags: options?.tags ?? ['websocket'],
                params: options?.params,
                response: {
                    101: {
                        description: 'WebSocket connection upgraded',
                        type: 'null'
                    }
                }
            },
            handler: async (request, reply) => {
                return reply.status(400 as 101).send({ 
                    error: 'This is a WebSocket endpoint documentation. Connect via WebSocket to: ' + path 
                });
            },
        });
    }
}