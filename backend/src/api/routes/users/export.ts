import { FastifyApp } from "../../../fastify";
import ApiRoute from "../../api";
import { UserModel } from "../../../database/models/user_model";
import { AuthenticatedRequest, authenticateJWT } from "../../../auth/middleware";

export default class ExportUserDataRoute extends ApiRoute {
    constructor(app: FastifyApp) {
        super(app, '/api/users/me/export', 'GET', async (request: AuthenticatedRequest, reply) => {
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

            const userData = userModel.exportUserData(user.id!);
            
            if (!userData) {
                reply.code(404).send({
                    success: false,
                    error: 'Utilisateur non trouvé'
                });
                return;
            }

            reply.header('Content-Disposition', `attachment; filename="user_data_${user.id}.json"`);
            reply.header('Content-Type', 'application/json');
            
            return userData;
        }, {
            description: 'GDPR: Exporter toutes ses données personnelles',
            tags: ['users', 'gdpr']
        });
    }
}