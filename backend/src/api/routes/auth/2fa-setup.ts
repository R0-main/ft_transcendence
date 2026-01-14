import { FastifyReply } from "fastify";
import { FastifyApp } from "../../../fastify.js";
import ApiRoute from "../../api.js";
import { UserModel } from "../../../database/models/user_model.js";
import { AuthenticatedRequest, authenticateJWT } from "../../../auth/middleware.js";
import { TwoFactorService } from "../../../auth/twofa.service.js";

export default class TwoFactorSetupRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/2fa/setup', 'POST', async (request: AuthenticatedRequest, reply: FastifyReply) => {
            await authenticateJWT(request, reply);
            if (reply.sent) return;

            const userId = request.user!.userId;
            const userModel = new UserModel();
            const user = userModel.findById(userId);

            if (!user) {
                return reply.status(404).send({
                    status: 'error',
                    message: 'User not found',
                    timestamp: new Date().toISOString(),
                });
            }

            if (user.two_factor_enabled) {
                return reply.status(400).send({
                    status: 'error',
                    message: '2FA is already enabled',
                    timestamp: new Date().toISOString(),
                });
            }

            // Generate 2FA secret and otpauth URL
            const setup = TwoFactorService.generateSecret(user.username);

            return {
                status: 'success',
                data: {
                    secret: setup.secret,
                    otpauthUrl: setup.otpauthUrl,
                    backupCodes: setup.backupCodes,
                },
                message: 'Scan the QR code with your authenticator app',
                timestamp: new Date().toISOString(),
            };
        }, {
            description: 'Setup Two-Factor Authentication',
            tags: ['auth', '2fa']
        });
    }
}