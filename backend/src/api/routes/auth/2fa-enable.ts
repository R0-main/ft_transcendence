import { FastifyReply } from "fastify";
import { FastifyApp } from "../../../fastify.js";
import ApiRoute from "../../api.js";
import { UserModel } from "../../../database/models/user_model.js";
import { AuthenticatedRequest, authenticateJWT } from "../../../auth/middleware.js";
import { TwoFactorService } from "../../../auth/twofa.service.js";

export default class TwoFactorEnableRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/2fa/enable', 'POST', async (request: AuthenticatedRequest, reply: FastifyReply) => {
            await authenticateJWT(request, reply);
            if (reply.sent) return;

            const { secret, token, backupCodes } = request.body as { 
                secret: string; 
                token: string;
                backupCodes: string[];
            };

            console.log('Enabling 2FA with secret:', secret, 'token:', token, 'backupCodes:', backupCodes);

            if (!secret || !token || !backupCodes) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Secret, token, and backup codes are required',
                    timestamp: new Date().toISOString(),
                });
            }

            // Verify the TOTP token
            const isValid = TwoFactorService.verifyToken(token, secret);
            if (!isValid) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Invalid verification code',
                    timestamp: new Date().toISOString(),
                });
            }

            const userId = request.user!.userId;
            const userModel = new UserModel();

            // Enable 2FA for the user
            const success = userModel.enable2FA(userId, secret, backupCodes);

            if (!success) {
                return reply.status(500).send({
                    status: 'error',
                    message: 'Failed to enable 2FA',
                    timestamp: new Date().toISOString(),
                });
            }

            return {
                status: 'success',
                message: '2FA enabled successfully',
                timestamp: new Date().toISOString(),
            };
        }, {
            description: 'Enable Two-Factor Authentication after verification',
            tags: ['auth', '2fa']
        });
    }
}