import IUsersRepository from '../repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import "reflect-metadata";
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import AplicationError from '@shared/errors/AplicationError';

interface IRequest {
    email: string,
}

@injectable()
class SendForgotPasswordEmailService {

    constructor(

        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,
        
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository) { }

    public async execute({ email }: IRequest): Promise<void> {

        const user = await this.usersRepository.findByEmail(email);

        if(!user) {
            throw new AplicationError('User does not exists.')
        }

        await this.userTokensRepository.generate(user.id);

        const body = 'Pedido de recuperação de senha recebido.';
        this.mailProvider.sendMail(email, body);
    }
}

export default SendForgotPasswordEmailService