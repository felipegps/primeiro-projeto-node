import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import AuthenticateUserService from "./AuthenticateUserService";
import AplicationError from "@shared/errors/AplicationError";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    });

    it('should be able to authenticate.', async () => {
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        const response = await authenticateUser.execute({ email: 'felipe@gmail.com', password: '1234' });
        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user.', async () => {
        await expect(authenticateUser.execute({ email: 'felipe@gmail.com', password: '1234' })).rejects.toBeInstanceOf(AplicationError);
    });

    it('should be able to authenticate with wrong password.', async () => {
        await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        await expect(authenticateUser.execute({ email: 'felipe@gmail.com', password: '12345' })).rejects.toBeInstanceOf(AplicationError);
    });
});