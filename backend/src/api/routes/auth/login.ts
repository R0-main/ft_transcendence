import crypto from 'crypto';
import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";
import { ReplyGenericInterface } from 'fastify/types/reply';
import { FastifyReply } from 'fastify';
import OAuthService from '../../../auth/oauth';

export default class GoogleAuthLoginRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/auth/login', 'GET', async (request, reply : FastifyReply) => {
            const state = OAuthService.generate_state();

            reply.setCookie('oauth_state', state, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 10, // 10 minutes
            });

            const authUrl = OAuthService.generate_google_link(state);

            return reply.redirect(authUrl);
        });
    }
}