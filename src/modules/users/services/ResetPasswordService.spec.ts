import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUsersTokensRepository";
import AplicationError from "@shared/errors/AplicationError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import ResetPasswordService from "./ResetPasswordService";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResertPasswordService', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider);
    });

    it('should be able to reset the password.', async () => {
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({ token, password: '123456' });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123456');
        expect(updatedUser.password).toBe('123456');
    });

    it('should not be able to reset the password with non-existing token.', async () => {
        await expect(resetPasswordService.execute({ token: 'non-existing-token', password: '123456' })).rejects.toBeInstanceOf(AplicationError);
    });

    it('should not be able to reset the password with non-existing user.', async () => {
        const { token } = await fakeUserTokensRepository.generate('non-existing-user');

        await expect(resetPasswordService.execute({ token, password: '123456' })).rejects.toBeInstanceOf(AplicationError);
    });

    it('should not be able to reset the password after two hours.', async () => {
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });
        await expect(resetPasswordService.execute({ token, password: '123456' })).rejects.toBeInstanceOf(AplicationError);
    });

});