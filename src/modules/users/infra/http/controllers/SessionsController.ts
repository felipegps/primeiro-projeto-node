import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
    async create(request: Request, response: Response): Promise<Response> {

        const { email, password } = request.body;
        const authenticateUserService = container.resolve(AuthenticateUserService);
        const { user, token } = await authenticateUserService.execute({
            email, password
        });
        delete user.password;
        return response.json({ user, token });
    }
}