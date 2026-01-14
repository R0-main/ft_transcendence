import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyApp } from "../../../fastify.js";
import ApiRoute from "../../api.js";
import { UserModel } from "../../../database/models/user_model.js";

export default class Disable2FADebugRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/disable-2fa-debug', 'POST', async (request: FastifyRequest, reply: FastifyReply) => {
            const { email } = request.body as { email: string };
            
            const userModel = new UserModel();
            const success = userModel.db.prepare('UPDATE users SET two_factor_enabled = 0 WHERE email = ?').run(email);
            
            return {
                status: 'success',
                message: '2FA disabled',
                email
            };
        });
    }
}