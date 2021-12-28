// import AplicationError from "@shared/errors/AplicationError";
// import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
// import ListProvidersService from "./ListProvidersService";
// import FakeCachProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

// let fakeUsersRepository: FakeUsersRepository;
// let fakeCachProvider: FakeCachProvider;
// let listProviders: ListProvidersService;

// describe('ListProviders', () => {
//     beforeEach(() => {
//         fakeUsersRepository = new FakeUsersRepository();
//         listProviders = new ListProvidersService(fakeUsersRepository, fakeCachProvider);
//     });

//     it('should be able to list all providers.', async () => {
//         const loggedUser = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
//         const user1 = await fakeUsersRepository.create({ name: 'João', email: 'João@gmail.com', password: '1234' });
//         const user2 = await fakeUsersRepository.create({ name: 'Rebeca', email: 'Rebeca@gmail.com', password: '1234' });

//         const providers = await listProviders.execute({ user_id: loggedUser.id });

//         expect(providers).toEqual([user1, user2]);
//     });

// });