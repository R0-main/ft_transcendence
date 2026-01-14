import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";

export default class HealthRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/health', 'GET', async (request, reply) => {
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
            };
        });
    }
}