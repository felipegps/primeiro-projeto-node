import AplicationError from "@shared/errors/AplicationError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateProfileService from "./UpdateProfileService";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;
let fakeHashProvider: FakeHashProvider

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });

    it('should be able update the profile.', async () => {
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });

        const updatedUser = await updateProfile.execute({ user_id: user.id, name: 'João Felipe', email: 'newEmail@gmail.com' });

        expect(updatedUser.name).toBe('João Felipe');
        expect(updatedUser.email).toBe('newEmail@gmail.com');
    });

    it('should not be able to change to another user email.', async () => {
        await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });

        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe2@gmail.com', password: '1234' });

        await expect(updateProfile.execute({ user_id: user.id, name: 'Felipe', email: 'felipe@gmail.com' })).rejects.toBeInstanceOf(AplicationError);
    });

    it('should be able update the password.', async () => {
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        const updatedUser = await updateProfile.execute({ user_id: user.id, name: 'João Felipe', email: 'newEmail@gmail.com', password: '12345', old_password: '1234' });
        expect(updatedUser.password).toBe('12345');
    });

    it('should not be able update the password without old password.', async () => {
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        await expect(updateProfile.execute({ user_id: user.id, name: 'João Felipe', email: 'newEmail@gmail.com', password: '12345'})).rejects.toBeInstanceOf(AplicationError);
    });

    it('should not be able update the password with wrong old password.', async () => {
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        await expect(updateProfile.execute({ user_id: user.id, name: 'João Felipe', email: 'newEmail@gmail.com', password: '12345', old_password: '123456'})).rejects.toBeInstanceOf(AplicationError);
    });
});