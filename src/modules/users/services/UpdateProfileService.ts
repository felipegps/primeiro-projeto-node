import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import AplicationError from '@shared/errors/AplicationError';
import IUsersRepository from '../repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
    user_id: string,
    name: string,
    email: string,
    old_password?: string,
    password?: string
}

@injectable()
class UpdateProfileService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider) { }

    public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AplicationError('User not found.', 401);
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

        if (userWithUpdatedEmail && userWithUpdatedEmail.id != user.email) {
            throw new AplicationError('E-mail already in use.')
        }

        user.name = name;
        user.email = email;

        if (password && !old_password) {
            throw new AplicationError('You need to inform the old password to set a new password.')
        }

        if (password && old_password) {
            const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

            if(!checkOldPassword){
                throw new AplicationError('Old password does not match.')
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }

}
export default UpdateProfileService