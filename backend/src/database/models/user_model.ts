import Database from 'better-sqlite3';
import { DatabaseManager } from '../database.js';
import crypto from 'crypto';

export interface User {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    access_token?: string;
    avatar_url?: string;
    two_factor_secret?: string;
    two_factor_enabled?: number;
    two_factor_backup_codes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserStats {
    user_id: number;
    games_played: number;
    games_won: number;
    games_lost: number;
    total_score: number;
}

export interface RefreshToken {
    id?: number;
    user_id: number;
    token_hash: string;
    expires_at: string;
    created_at?: string;
}

export class UserModel {
    private db: Database.Database;

    constructor() {
        this.db = DatabaseManager.getInstance().getDatabase();
    }

    create(user: User): User {
        const statement = this.db.prepare(`
            INSERT INTO users (username, email, access_token, avatar_url)
            VALUES (?, ?, ?, ?)
        `);

        const result = statement.run(
            user.username,
            user.email,
            user.access_token || user.password_hash || '',
            user.avatar_url || null,
        );

        const statsStatement = this.db.prepare(`
            INSERT INTO user_stats (user_id) VALUES (?)
        `);
        statsStatement.run(result.lastInsertRowid);

        return this.findById(result.lastInsertRowid as number)!;
    }

    findById(id: number): User | undefined {
        const statement = this.db.prepare(`SELECT * FROM users WHERE id = ?`);
        return statement.get(id) as User | undefined;
    }

    findByUsername(username: string): User | undefined {
        const statement = this.db.prepare(`SELECT * FROM users WHERE username = ?`);
        return statement.get(username) as User | undefined;
    }

    findByEmail(email: string): User | undefined {
        const statement = this.db.prepare(`SELECT * FROM users WHERE email = ?`);
        return statement.get(email) as User | undefined;
    }

    findByOAuthState(oauthState: string): User | undefined {
        // OAuth state is a temporary session identifier that maps to a user
        // This would typically be stored in a sessions table or cache
        // For now, this is a placeholder - implement based on your session management
        const statement = this.db.prepare(`SELECT * FROM users WHERE oauth_state = ?`);
        return statement.get(oauthState) as User | undefined;
    }

    findAll(): User[] {
        const statement = this.db.prepare(`SELECT * FROM users ORDER BY created_at DESC`);
        return statement.all() as User[];
    }

    getStats(userId: number): UserStats | undefined {
        const statement = this.db.prepare(`SELECT * FROM user_stats WHERE user_id = ?`);
        return statement.get(userId) as UserStats | undefined;
    }

    // ===== 2FA Methods =====
    
    enable2FA(userId: number, secret: string, backupCodes: string[]): boolean {
        const hashedCodes = backupCodes.map(code => 
            crypto.createHash('sha256').update(code).digest('hex')
        );
        
        const statement = this.db.prepare(`
            UPDATE users 
            SET two_factor_secret = ?,
                two_factor_enabled = 1,
                two_factor_backup_codes = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        
        const result = statement.run(secret, JSON.stringify(hashedCodes), userId);
        return result.changes > 0;
    }

    disable2FA(userId: number): boolean {
        const statement = this.db.prepare(`
            UPDATE users 
            SET two_factor_secret = NULL,
                two_factor_enabled = 0,
                two_factor_backup_codes = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        
        const result = statement.run(userId);
        return result.changes > 0;
    }

    getBackupCodes(userId: number): string[] {
        const user = this.findById(userId);
        if (!user || !user.two_factor_backup_codes) {
            return [];
        }
        return JSON.parse(user.two_factor_backup_codes);
    }

    removeBackupCode(userId: number, hashedCode: string): boolean {
        const codes = this.getBackupCodes(userId);
        const newCodes = codes.filter(code => code !== hashedCode);
        
        const statement = this.db.prepare(`
            UPDATE users 
            SET two_factor_backup_codes = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        
        const result = statement.run(JSON.stringify(newCodes), userId);
        return result.changes > 0;
    }

    // ===== Refresh Token Methods =====
    
    saveRefreshToken(userId: number, tokenHash: string, expiresAt: Date): void {
        const statement = this.db.prepare(`
            INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
            VALUES (?, ?, ?)
        `);
        statement.run(userId, tokenHash, expiresAt.toISOString());
    }

    findRefreshToken(tokenHash: string): RefreshToken | undefined {
        const statement = this.db.prepare(`
            SELECT * FROM refresh_tokens 
            WHERE token_hash = ? AND expires_at > datetime('now')
        `);
        return statement.get(tokenHash) as RefreshToken | undefined;
    }

    deleteRefreshToken(tokenHash: string): boolean {
        const statement = this.db.prepare(`
            DELETE FROM refresh_tokens WHERE token_hash = ?
        `);
        const result = statement.run(tokenHash);
        return result.changes > 0;
    }

    deleteAllUserRefreshTokens(userId: number): boolean {
        const statement = this.db.prepare(`
            DELETE FROM refresh_tokens WHERE user_id = ?
        `);
        const result = statement.run(userId);
        return result.changes > 0;
    }

    cleanExpiredTokens(): void {
        const statement = this.db.prepare(`
            DELETE FROM refresh_tokens WHERE expires_at <= datetime('now')
        `);
        statement.run();
    }

    // ===== Data Privacy Methods =====

    anonymize(userId: number): boolean {
        const user = this.findById(userId);
        if (!user) return false;
        
        const anonymizedUsername = `deleted_user_${userId}`;
        const anonymizedEmail = `deleted_${userId}@anonymized.local`;
        
        const statement = this.db.prepare(`
            UPDATE users 
            SET username = ?,
                email = ?,
                access_token = '',
                avatar_url = NULL,
                two_factor_secret = NULL,
                two_factor_enabled = 0,
                two_factor_backup_codes = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        statement.run(anonymizedUsername, anonymizedEmail, userId);
        
        this.deleteAllUserRefreshTokens(userId);
        
        const leaderboardStatement = this.db.prepare(`
            UPDATE leaderboard 
            SET player_name = ?
            WHERE player_name = ?
        `);
        leaderboardStatement.run(anonymizedUsername, user.username);
        
        return true;
    }

    deleteAccount(userId: number): boolean {
        const statement = this.db.prepare(`DELETE FROM users WHERE id = ?`);
        const result = statement.run(userId);
        return result.changes > 0;
    }

    exportUserData(userId: number): any {
        const user = this.findById(userId);
        if (!user) return null;

        const stats = this.getStats(userId);

        return {
            personal_data: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar_url: user.avatar_url,
                two_factor_enabled: !!user.two_factor_enabled,
                created_at: user.created_at,
                updated_at: user.updated_at,
            },
            statistics: stats,
            export_date: new Date().toISOString()
        };
    }

    isAnonymized(userId: number): boolean {
        const user = this.findById(userId);
        return user ? user.username.startsWith('deleted_user_') : false; 
    }
}