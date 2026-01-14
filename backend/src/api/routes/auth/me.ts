import { FastifyReply } from "fastify";
import { FastifyApp } from "../../../fastify.js";
import ApiRoute from "../../api.js";
import { UserModel } from "../../../database/models/user_model.js";
import { AuthenticatedRequest, authenticateJWT } from "../../../auth/middleware.js";

export default class MeRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/me', 'GET', async (request: AuthenticatedRequest, reply: FastifyReply) => {
            await authenticateJWT(request, reply);
            if (reply.sent) return;

            const userId = request.user!.userId;
            const userModel = new UserModel();
            const user = userModel.findById(userId);

            if (!user) {
                return reply.status(404).send({
                    status: 'error',
                    message: 'User not found',
                    authenticated: false,
                    timestamp: new Date().toISOString(),
                });
            }

            return {
                status: 'success',
                authenticated: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar_url: user.avatar_url,
                    two_factor_enabled: !!user.two_factor_enabled,
                    created_at: user.created_at,
                },
                timestamp: new Date().toISOString(),
            };
        }, {
            description: 'Get current authenticated user',
            tags: ['auth']
        });
    }
}