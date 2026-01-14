import { authenticator } from 'otplib';
import crypto from 'crypto';

export interface TwoFactorSetup {
    secret: string;
    otpauthUrl: string;
    backupCodes: string[];
}

export class TwoFactorService {
    private static ISSUER = process.env.TWO_FA_ISSUER || 'ft_transcendence';
    private static APP_NAME = process.env.TWO_FA_APP_NAME || 'Transcendence';

    /**
     * Generate a new 2FA secret for user setup
     */
    public static generateSecret(username: string): TwoFactorSetup {
        const secret = authenticator.generateSecret();
        
        // Generate OTP Auth URL (le frontend va générer le QR)
        const otpauthUrl = authenticator.keyuri(
            username,
            this.APP_NAME,
            secret
        );

        // Generate backup codes
        const backupCodes = this.generateBackupCodes();

        return {
            secret,
            otpauthUrl,
            backupCodes,
        };
    }

    /**
     * Verify a TOTP token
     */
    public static verifyToken(token: string, secret: string): boolean {
        try {
            const cleanToken = token.replace(/[\s-]/g, '');
            console.log('Verifying token:', cleanToken, 'against secret:', secret);
            const result = authenticator.verify({ token: cleanToken, secret });
            console.log('Verification result:', result);
            return result;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    }

    /**
     * Generate backup codes for 2FA recovery
     */
    public static generateBackupCodes(count: number = 8): string[] {
        const codes: string[] = [];
        for (let i = 0; i < count; i++) {
            const code = crypto.randomBytes(4).toString('hex').toUpperCase();
            codes.push(code);
        }
        return codes;
    }

    /**
     * Hash backup codes for storage
     */
    public static hashBackupCode(code: string): string {
        return crypto.createHash('sha256').update(code).digest('hex');
    }

    /**
     * Verify backup code against hashed version
     */
    public static verifyBackupCode(code: string, hashedCode: string): boolean {
        const hash = this.hashBackupCode(code);
        return hash === hashedCode;
    }
}