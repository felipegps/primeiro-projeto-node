import AplicationError from "@shared/errors/AplicationError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import ShowProfileService from "./ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able show the profile.', async () => {
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });

        const profile = await showProfile.execute({ user_id: user.id });

        expect(profile.name).toBe('Felipe');
        expect(profile.email).toBe('felipe@gmail.com');
    });

    it('should not be able show the profile from non-existing user.', async () => {
        await expect(showProfile.execute({ user_id: 'non-existing-user' })).rejects.toBeInstanceOf(AplicationError);
    });

});