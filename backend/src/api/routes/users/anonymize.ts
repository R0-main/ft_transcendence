import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";
import { UserModel } from "../../../database/models/user_model";
import { AuthenticatedRequest, authenticateJWT } from "../../../auth/middleware";

export default class AnonymizeUserRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/users/me/anonymize', 'POST', async (request: AuthenticatedRequest, reply) => {
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

            const anonymized = userModel.anonymize(user.id!);
            
            if (anonymized) {
                reply.clearCookie('oauth_state');
                
                return {
                    success: true,
                    message: 'Compte anonymisé avec succès. Vos statistiques sont préservées.'
                };
            } else {
                reply.code(500).send({
                    success: false,
                    error: 'Erreur lors de l\'anonymisation'
                });
            }
        }, {
            description: 'GDPR: Anonymiser son compte (préserve les stats)',
            tags: ['users', 'gdpr']
        });
    }
}