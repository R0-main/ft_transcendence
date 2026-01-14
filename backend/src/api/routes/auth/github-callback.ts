import { FastifyReply } from "fastify";
import OAuthService from "../../../auth/oauth.js";
import { FastifyApp } from "../../../fastify.js";
import ApiRoute from "../../api.js";
import { UserModel } from "../../../database/models/user_model.js";
import { JWTService } from "../../../auth/jwt.service.js";
import crypto from 'crypto';

export default class GitHubAuthCallbackRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/github/callback', 'GET', async (request, reply: FastifyReply) => {
            const { code, state } = request.query as { code?: string; state?: string };
            const storedState = request.cookies.oauth_state;

            if (storedState !== state) {
                return reply.status(401).send({
                    status: 'error',
                    message: 'Invalid state parameter',
                    timestamp: new Date().toISOString(),
                });
            }

            if (!code) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Missing authorization code',
                    timestamp: new Date().toISOString(),
                });
            }

            try {
                const github_token = await OAuthService.get_github_token(code);
                const userData = await OAuthService.get_github_userinfo(github_token);

                reply.clearCookie('oauth_state');

                const userModel = new UserModel();
                let user = userModel.findByEmail(userData.email);

                if (!user) {
                    user = userModel.create({
                        username: userData.login,
                        email: userData.email,
                        password_hash: '',
                        access_token: github_token,
                        avatar_url: userData.avatar_url,
                    });
                    console.log('✅ New user created:', user);
                } else {
                    console.log('✅ User logged in:', user);
                }

                // Check if 2FA is enabled
                if (user.two_factor_enabled) {
                    // Generate temporary token for 2FA verification
                    const tempToken = JWTService.generateTwoFactorToken(
                        user.id!,
                        user.email,
                        user.username
                    );

                    return reply.type('text/html').send(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>2FA Required</title>
                        </head>
                        <body>
                            <script>
                                if (window.opener) {
                                    window.opener.postMessage({ 
                                        type: 'auth_2fa_required',
                                        tempToken: '${tempToken}',
                                        user: {
                                            username: '${user.username}',
                                            email: '${user.email}'
                                        }
                                    }, '${process.env.FRONTEND_URL}');
                                    window.close();
                                } else {
                                    window.location.href = '${process.env.FRONTEND_URL}?2fa=required&token=${tempToken}';
                                }
                            </script>
                            <p>2FA verification required. Redirecting...</p>
                        </body>
                        </html>
                    `);
                }

                // No 2FA - generate full JWT tokens
                const tokens = JWTService.generateTokenPair({
                    userId: user.id!,
                    email: user.email,
                    username: user.username,
                });

                // Save refresh token
                const tokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);
                userModel.saveRefreshToken(user.id!, tokenHash, expiresAt);

                return reply.type('text/html').send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Login Success</title>
                    </head>
                    <body>
                        <script>
                            const tokens = {
                                accessToken: '${tokens.accessToken}',
                                refreshToken: '${tokens.refreshToken}'
                            };
                            const user = {
                                id: ${user.id},
                                username: '${user.username.replace(/'/g, "\\'")}',
                                email: '${user.email}',
                                avatar_url: '${user.avatar_url || ''}'
                            };
                            if (window.opener) {
                                window.opener.postMessage({ 
                                    type: 'auth_success',
                                    tokens,
                                    user
                                }, '${process.env.FRONTEND_URL}');
                                window.close();
                            } else {
                                localStorage.setItem('accessToken', tokens.accessToken);
                                localStorage.setItem('refreshToken', tokens.refreshToken);
                                localStorage.setItem('user', JSON.stringify(user));
                                window.location.href = '${process.env.FRONTEND_URL}';
                            }
                        </script>
                        <p>Login successful! Redirecting...</p>
                    </body>
                    </html>
                `);
            } catch (error) {
                return reply.status(500).send({
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Authentication failed',
                    timestamp: new Date().toISOString(),
                });
            }
        });
    }
}