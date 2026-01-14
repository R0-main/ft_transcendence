import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTService } from './jwt.service.js';

export interface AuthenticatedRequest extends FastifyRequest {
    user?: {
        userId: number;
        email: string;
        username: string;
        twoFactorAuthenticated?: boolean;
    };
}

/**
 * Middleware to verify JWT access token
 */
export async function authenticateJWT(
    request: AuthenticatedRequest,
    reply: FastifyReply
): Promise<void> {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({
                status: 'error',
                message: 'No token provided',
                timestamp: new Date().toISOString(),
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const payload = JWTService.verifyAccessToken(token);

        if (!payload) {
            return reply.status(401).send({
                status: 'error',
                message: 'Invalid or expired token',
                timestamp: new Date().toISOString(),
            });
        }

        // Attach user info to request
        request.user = {
            userId: payload.userId,
            email: payload.email,
            username: payload.username,
            twoFactorAuthenticated: payload.twoFactorAuthenticated,
        };
    } catch (error) {
        return reply.status(401).send({
            status: 'error',
            message: 'Authentication failed',
            timestamp: new Date().toISOString(),
        });
    }
}

/**
 * Middleware to verify 2FA is completed (if enabled)
 */
export async function require2FA(
    request: AuthenticatedRequest,
    reply: FastifyReply
): Promise<void> {
    if (!request.user?.twoFactorAuthenticated) {
        return reply.status(403).send({
            status: 'error',
            message: '2FA verification required',
            timestamp: new Date().toISOString(),
        });
    }
}