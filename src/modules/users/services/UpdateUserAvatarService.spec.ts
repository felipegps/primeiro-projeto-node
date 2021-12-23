import AplicationError from "@shared/errors/AplicationError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

describe('UpdateUserAvatar', () => {
    it('should be able to upload a new avatar.', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });

        await updateUserAvatar.execute({ user_id: user.id, avatarFilename: 'avatar.jpg' });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update from non existing user.', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        await expect(updateUserAvatar.execute({ user_id: 'non-existing-user', avatarFilename: 'avatar.jpg' })).rejects.toBeInstanceOf(AplicationError);
    });

    it('should delete old avatar when updating new one.', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });

        await updateUserAvatar.execute({ user_id: user.id, avatarFilename: 'avatar.jpg' });

        await updateUserAvatar.execute({ user_id: user.id, avatarFilename: 'avatar2.jpg' });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

        expect(user.avatar).toBe('avatar2.jpg');
    });
});