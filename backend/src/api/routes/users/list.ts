import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";
import { UserModel } from "../../../database/models/user_model";

export default class ListUsersRoute extends ApiRoute {
  constructor(app: FastifyApp) {
    super(app, '/api/users', 'GET', async (request, reply) => {
      const userModel = new UserModel();
      const users = userModel.findAll();
      
      const sanitizedUsers = users.map(({ password_hash, ...user }) => user);
      
      return { success: true, users: sanitizedUsers };
    }, {
      description: 'List all users',
      tags: ['users']
    });
  }
}
