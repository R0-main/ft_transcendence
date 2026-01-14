import { FastifyReply } from "fastify";
import OAuthService from "../../../auth/oauth";
import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";

export default class GitHubAuthLoginRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/github/login', 'GET', async (request, reply: FastifyReply) => {
            const state = OAuthService.generate_state();
            
            reply.setCookie('oauth_state', state, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 600
            });

            const authUrl = OAuthService.generate_github_link(state);
            return reply.redirect(authUrl);
        }, {
            description: 'Initiate GitHub OAuth flow',
            tags: ['auth']
        });
    }
}