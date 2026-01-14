import { FastifyReply } from "fastify";
import { FastifyApp } from "../../../fastify.js";
import ApiRoute from "../../api.js";
import { UserModel } from "../../../database/models/user_model.js";
import { AuthenticatedRequest, authenticateJWT } from "../../../auth/middleware.js";
import crypto from 'crypto';

export default class LogoutRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/logout', 'POST', async (request: AuthenticatedRequest, reply: FastifyReply) => {
            await authenticateJWT(request, reply);
            if (reply.sent) return;

            const { refreshToken, allDevices } = request.body as { refreshToken?: string; allDevices?: boolean };
            const userId = request.user!.userId;

            const userModel = new UserModel();

            if (allDevices) {
                // Logout from all devices - delete all user's refresh tokens
                userModel.deleteAllUserRefreshTokens(userId);
                return {
                    status: 'success',
                    message: 'Logged out from all devices',
                    timestamp: new Date().toISOString(),
                };
            } else if (refreshToken) {
                // Logout from specific device - delete specific refresh token
                const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
                userModel.deleteRefreshToken(tokenHash);
                return {
                    status: 'success',
                    message: 'Logged out successfully',
                    timestamp: new Date().toISOString(),
                };
            } else {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Refresh token or allDevices flag required',
                    timestamp: new Date().toISOString(),
                });
            }
        }, {
            description: 'Logout user and invalidate refresh tokens',
            tags: ['auth']
        });
    }
}