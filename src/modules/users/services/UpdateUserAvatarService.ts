import User from '@modules/users/infra/typeorm/entities/User';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';
import AplicationError from '@shared/errors/AplicationError';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import {injectable, inject} from 'tsyringe';

interface IRequest {
    user_id: string,
    avatarFilename: string,
}

@injectable()
class UpdateUserAvatarService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        
        @inject('StorageProvider')
        private storageProvider: IStorageProvider
        ) { }

    public async execute({user_id, avatarFilename}: IRequest) : Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if(!user) {
            throw new AplicationError('Only authenticated users can change avatar.', 401);
        }

        if(user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const fileName = await this.storageProvider.saveFile(avatarFilename);

        user.avatar = fileName;

        await this.usersRepository.save(user);

        return user;
    }

}
export default UpdateUserAvatarService