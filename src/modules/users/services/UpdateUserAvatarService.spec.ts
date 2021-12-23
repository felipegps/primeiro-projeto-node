import AplicationError from "@shared/errors/AplicationError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    });

    it('should be able to upload a new avatar.', async () => {
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        await updateUserAvatar.execute({ user_id: user.id, avatarFilename: 'avatar.jpg' });
        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update from non existing user.', async () => {
        await expect(updateUserAvatar.execute({ user_id: 'non-existing-user', avatarFilename: 'avatar.jpg' })).rejects.toBeInstanceOf(AplicationError);
    });

    it('should delete old avatar when updating new one.', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        await updateUserAvatar.execute({ user_id: user.id, avatarFilename: 'avatar.jpg' });
        await updateUserAvatar.execute({ user_id: user.id, avatarFilename: 'avatar2.jpg' });
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});