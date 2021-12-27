import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;

// Todas as rotas de perfil não são acessíveis sem estiver logado e também os que são acessíveis ele vai obter o id do usuário logado
// através da request.user_id