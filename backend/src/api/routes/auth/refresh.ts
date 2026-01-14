import { FastifyReply } from "fastify";
import { FastifyApp } from "../../../fastify.js";
import ApiRoute from "../../api.js";
import { UserModel } from "../../../database/models/user_model.js";
import { JWTService } from "../../../auth/jwt.service.js";
import crypto from 'crypto';

export default class RefreshTokenRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/refresh', 'POST', async (request, reply: FastifyReply) => {
            const { refreshToken } = request.body as { refreshToken: string };

            if (!refreshToken) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Refresh token is required',
                    timestamp: new Date().toISOString(),
                });
            }
            
            const payload = JWTService.verifyRefreshToken(refreshToken);
            if (!payload) {
                return reply.status(401).send({
                    status: 'error',
                    message: 'Invalid or expired refresh token',
                    timestamp: new Date().toISOString(),
                });
            }

            const userModel = new UserModel();
            
            const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
            const storedToken = userModel.findRefreshToken(tokenHash);

            if (!storedToken) {
                return reply.status(401).send({
                    status: 'error',
                    message: 'Refresh token not found or expired',
                    timestamp: new Date().toISOString(),
                });
            }

            const user = userModel.findById(payload.userId);
            if (!user) {
                return reply.status(404).send({
                    status: 'error',
                    message: 'User not found',
                    timestamp: new Date().toISOString(),
                });
            }

            const tokens = JWTService.generateTokenPair({
                userId: user.id!,
                email: user.email,
                username: user.username,
                twoFactorAuthenticated: user.two_factor_enabled === 1,
            });

            // Delete old refresh token and save new one
            userModel.deleteRefreshToken(tokenHash);
            const newTokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            userModel.saveRefreshToken(user.id!, newTokenHash, expiresAt);

            return {
                status: 'success',
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
                timestamp: new Date().toISOString(),
            };
        }, {
            description: 'Refresh access token using refresh token',
            tags: ['auth']
        });
    }
}