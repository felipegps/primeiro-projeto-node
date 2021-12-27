import User from '@modules/users/infra/typeorm/entities/User';
import AplicationError from '@shared/errors/AplicationError';
import IUsersRepository from '../repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
    user_id: string,
}

@injectable()
class ShowProfileService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository) { }

    public async execute({ user_id }: IRequest): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AplicationError('User not found.', 401);
        }

        return user;
    }

}
export default ShowProfileService;