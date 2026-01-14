import { HTTPMethods } from "fastify";
import { FastifyApp } from "../fastify";

export interface ApiRouteOptions {
    description?: string;
    tags?: string[];
    params?: Record<string, any>;
}


export default class ApiRoute
{
    constructor(app: FastifyApp, path: string, method: HTTPMethods | HTTPMethods[], callback: (request: any, reply: any) => Promise<any>, options?: ApiRouteOptions)
    {
        app.instance.log.info(`Registering route [${method}] ${path}`);
        app.instance.route({
            method: method,
            url: path,
            handler: async (request, reply) => {
                return callback(request, reply);
            },
            schema: {
                description: options?.description,
                tags: options?.tags,
                params: options?.params
            }
        });
    }
}