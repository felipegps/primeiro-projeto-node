import AplicationError from "@shared/errors/AplicationError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    });

    it('should be able to create a new user.', async () => {
        const user = await createUser.execute({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        expect(user).toHaveProperty('id');
    });

    it('should not be able to create two users on the same email.', async () => {
        await createUser.execute({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        await expect(createUser.execute({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' }),).rejects.toBeInstanceOf(AplicationError);
    });

});