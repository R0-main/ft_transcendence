import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";
import { UserModel } from "../../../database/models/user_model";
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default class CreateUserRoute extends ApiRoute {
  constructor(app: FastifyApp) {
    super(app, '/api/users', 'POST', async (request, reply) => {
      const { username, email, password, avatar_url } = request.body as any;

      if (!username || !email || !password) {
        reply.code(400).send({
          success: false,
          error: 'Username, email et password sont requis'
        });
        return;
      }

      const userModel = new UserModel();

      if (userModel.findByUsername(username)) {
        reply.code(409).send({
          success: false,
          error: 'Ce nom d\'utilisateur existe déjà'
        });
        return;
      }

      try {
        const user = userModel.create({
          username,
          email,
          password_hash: hashPassword(password),
          avatar_url
        });

        const { password_hash, ...sanitizedUser } = user;
        return { success: true, user: sanitizedUser };
      } catch (error: any) {
        reply.code(500).send({
          success: false,
          error: error.message
        });
      }
    }, {
      description: 'Create a new user',
      tags: ['users']
    });
  }
}