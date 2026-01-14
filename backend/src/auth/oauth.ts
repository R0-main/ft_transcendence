import crypto from 'crypto';

export type GoogleUserData = {
    sub: string; 
    email: string; 
    name: string; 
    picture: string;
}

export type GitHubUserData = {
    id: number;
    login: string;
    email: string;
    name: string;
    avatar_url: string;
}

export default abstract class OAuthService {
    // ===== GOOGLE OAuth =====
    public static generate_state(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    public static generate_google_link(state: string) {
        const params = new URLSearchParams({
            client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI || '',
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            state: state,
        });
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        return authUrl;
    }

    public static async get_google_token(code: string): Promise<string> {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: code,
                client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
                client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
                redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI || '',
                grant_type: 'authorization_code',
            }).toString(),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json() as { access_token: string };
        return tokenData.access_token;
    }

    public static async get_google_userinfo(access_token: string): Promise<GoogleUserData> {
        const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user info');
        }

        const userData = await userResponse.json() as GoogleUserData;
        return userData;
    }

    // ===== GITHUB OAuth =====
    public static generate_github_link(state: string) {
        const params = new URLSearchParams({
            client_id: process.env.GITHUB_OAUTH_CLIENT_ID || '',
            redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URI || '',
            scope: 'read:user user:email',
            state: state,
        });
        const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
        return authUrl;
    }

    public static async get_github_token(code: string): Promise<string> {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_OAUTH_CLIENT_ID || '',
                client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET || '',
                code: code,
                redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URI || '',
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json() as { access_token: string };
        return tokenData.access_token;
    }

    public static async get_github_userinfo(access_token: string): Promise<GitHubUserData> {
        // Get user profile
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Accept': 'application/json',
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user info');
        }

        const userData = await userResponse.json() as GitHubUserData;

        // Get user email if not public
        if (!userData.email) {
            const emailResponse = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Accept': 'application/json',
                },
            });

            if (emailResponse.ok) {
                const emails = await emailResponse.json() as Array<{ email: string; primary: boolean; verified: boolean }>;
                const primaryEmail = emails.find(e => e.primary && e.verified);
                if (primaryEmail) {
                    userData.email = primaryEmail.email;
                }
            }
        }

        return userData;
    }
}