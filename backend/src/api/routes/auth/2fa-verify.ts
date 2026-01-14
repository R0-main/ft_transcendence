import { FastifyReply } from "fastify";
import { FastifyApp } from "../../../fastify.js";
import ApiRoute from "../../api.js";
import { UserModel } from "../../../database/models/user_model.js";
import { TwoFactorService } from "../../../auth/twofa.service.js";
import { JWTService } from "../../../auth/jwt.service.js";
import crypto from 'crypto';

export default class TwoFactorVerifyRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/2fa/verify', 'POST', async (request, reply: FastifyReply) => {
            const { tempToken, code } = request.body as { tempToken: string; code: string };

            if (!tempToken || !code) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Temporary token and code are required',
                    timestamp: new Date().toISOString(),
                });
            }

            const payload = JWTService.verifyAccessToken(tempToken);
            if (!payload || !(payload as any).twoFactorPending) {
                return reply.status(401).send({
                    status: 'error',
                    message: 'Invalid or expired temporary token',
                    timestamp: new Date().toISOString(),
                });
            }

            const userModel = new UserModel();
            const user = userModel.findById(payload.userId);

            if (!user || !user.two_factor_secret) {
                return reply.status(404).send({
                    status: 'error',
                    message: 'User not found or 2FA not configured',
                    timestamp: new Date().toISOString(),
                });
            }

            let isValid = TwoFactorService.verifyToken(code, user.two_factor_secret);
            let usedBackupCode = false;

            if (!isValid) {
                const backupCodes = userModel.getBackupCodes(user.id!);
                for (const hashedCode of backupCodes) {
                    if (TwoFactorService.verifyBackupCode(code, hashedCode)) {
                        isValid = true;
                        usedBackupCode = true;
                        userModel.removeBackupCode(user.id!, hashedCode);
                        break;
                    }
                }
            }

            if (!isValid) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Invalid verification code',
                    timestamp: new Date().toISOString(),
                });
            }

            // Generate final JWT tokens with 2FA flag
            const tokens = JWTService.generateTokenPair({
                userId: user.id!,
                email: user.email,
                username: user.username,
                twoFactorAuthenticated: true,
            });

            const tokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            userModel.saveRefreshToken(user.id!, tokenHash, expiresAt);

            return {
                status: 'success',
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        avatar_url: user.avatar_url,
                    },
                    usedBackupCode,
                },
                message: '2FA verification successful',
                timestamp: new Date().toISOString(),
            };
        }, {
            description: 'Verify 2FA code and complete authentication',
            tags: ['auth', '2fa']
        });
    }
}