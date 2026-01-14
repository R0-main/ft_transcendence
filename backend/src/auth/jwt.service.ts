import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface JWTPayload {
    userId: number;
    email: string;
    username: string;
    twoFactorAuthenticated?: boolean;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export class JWTService {
    private static ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
    private static REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    private static ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
    private static REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

    public static generateTokenPair(payload: JWTPayload): TokenPair {
        const accessToken = jwt.sign(payload, this.ACCESS_SECRET, {
            expiresIn: this.ACCESS_EXPIRY,
            issuer: 'ft_transcendence',
        });

        const refreshToken = jwt.sign(
            { userId: payload.userId },
            this.REFRESH_SECRET,
            {
                expiresIn: this.REFRESH_EXPIRY,
                issuer: 'ft_transcendence',
            }
        );

        return { accessToken, refreshToken };
    }

    public static generateTwoFactorToken(userId: number, email: string, username: string): string {
        return jwt.sign(
            { userId, email, username, twoFactorPending: true },
            this.ACCESS_SECRET,
            {
                expiresIn: '5m',
                issuer: 'ft_transcendence',
            }
        );
    }

    public static verifyAccessToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.verify(token, this.ACCESS_SECRET, {
                issuer: 'ft_transcendence',
            }) as JWTPayload;
            return decoded;
        } catch (error) {
            return null;
        }
    }

    public static verifyRefreshToken(token: string): { userId: number } | null {
        try {
            const decoded = jwt.verify(token, this.REFRESH_SECRET, {
                issuer: 'ft_transcendence',
            }) as { userId: number };
            return decoded;
        } catch (error) {
            return null;
        }
    }

    public static generateRefreshTokenId(): string {
        return crypto.randomBytes(32).toString('hex');
    }
}