import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";
import { UserModel } from "../../../database/models/user_model";
import { AuthenticatedRequest, authenticateJWT } from "../../../auth/middleware";

export default class DeleteUserRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/users/me', 'DELETE', async (request: AuthenticatedRequest, reply) => {
            await authenticateJWT(request, reply);
            
            if (!request.user) {
                return;
            }

            const userModel = new UserModel();
            const user = userModel.findById(request.user.userId);
            
            if (!user) {
                reply.code(404).send({
                    success: false,
                    error: 'Utilisateur non trouvé'
                });
                return;
            }

            const deleted = userModel.deleteAccount(user.id!);
            
            if (deleted) {
                reply.clearCookie('user_id');
                
                return {
                    success: true,
                    message: 'Compte supprimé avec succès'
                };
            } else {
                reply.code(500).send({
                    success: false,
                    error: 'Erreur lors de la suppression'
                });
            }
        }, {
            description: 'GDPR: Supprimer définitivement son compte',
            tags: ['users', 'gdpr']
        });
    }
}