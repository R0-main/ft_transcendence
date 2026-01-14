import { FastifyReply } from "fastify";
import { FastifyApp } from "../../../fastify.js";
import ApiRoute from "../../api.js";
import { UserModel } from "../../../database/models/user_model.js";
import { AuthenticatedRequest, authenticateJWT } from "../../../auth/middleware.js";
import { TwoFactorService } from "../../../auth/twofa.service.js";

export default class TwoFactorDisableRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/2fa/disable', 'POST', async (request: AuthenticatedRequest, reply: FastifyReply) => {
            await authenticateJWT(request, reply);
            if (reply.sent) return;

            const { token } = request.body as { token: string };

            if (!token) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Verification token is required',
                    timestamp: new Date().toISOString(),
                });
            }

            const userId = request.user!.userId;
            const userModel = new UserModel();
            const user = userModel.findById(userId);

            if (!user || !user.two_factor_enabled || !user.two_factor_secret) {
                return reply.status(400).send({
                    status: 'error',
                    message: '2FA is not enabled',
                    timestamp: new Date().toISOString(),
                });
            }

            const isValid = TwoFactorService.verifyToken(token, user.two_factor_secret);
            if (!isValid) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Invalid verification code',
                    timestamp: new Date().toISOString(),
                });
            }

            const success = userModel.disable2FA(userId);

            if (!success) {
                return reply.status(500).send({
                    status: 'error',
                    message: 'Failed to disable 2FA',
                    timestamp: new Date().toISOString(),
                });
            }

            return {
                status: 'success',
                message: '2FA disabled successfully',
                timestamp: new Date().toISOString(),
            };
        }, {
            description: 'Disable Two-Factor Authentication',
            tags: ['auth', '2fa']
        });
    }
}