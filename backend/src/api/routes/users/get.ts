import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";
import { UserModel } from "../../../database/models/user_model";

export default class GetUserRoute extends ApiRoute {
  constructor(app: FastifyApp) {
    super(app, '/api/users/:id', 'GET', async (request, reply) => {
      const { id } = request.params as any;
      const userModel = new UserModel();
      
      const user = userModel.findById(parseInt(id));
      
      if (!user) {
        reply.code(404).send({
          success: false,
          error: 'Utilisateur non trouvé'
        });
        return;
      }

      const { password_hash, ...sanitizedUser } = user;
      return { success: true, user: sanitizedUser };
    }, {
      description: 'Get user by ID',
      tags: ['users']
    });
  }
}