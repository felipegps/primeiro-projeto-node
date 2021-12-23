import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import AplicationError from '@shared/errors/AplicationError';
import IUsersRepository from '../repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
    name: string,
    email: string,
    password: string
}

@injectable()
class CreateUserService {

    constructor(
        
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider) { }

    public async execute({ name, email, password }: IRequest): Promise<User> {

        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AplicationError('Email address alreay used');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name, email, password: hashedPassword
        });
        return user;
    }
}

export default CreateUserService