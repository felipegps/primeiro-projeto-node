import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import AplicationError from "@shared/errors/AplicationError";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeMailProvider = new FakeMailProvider();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository);
    });

    it('should be able to recover the password using the email.', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
        await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        await sendForgotPasswordEmail.execute({ email: 'felipe@gmail.com' });
        expect(sendMail).toHaveBeenCalled();
    });

    it('should be able to recover the password using a non-existing user account.', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
        await expect(sendForgotPasswordEmail.execute({ email: 'felipe@gmail.com' })).rejects.toBeInstanceOf(AplicationError);
    });

    it('should generate a forgot password token.', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
        const user = await fakeUsersRepository.create({ name: 'Felipe', email: 'felipe@gmail.com', password: '1234' });
        await sendForgotPasswordEmail.execute({ email: 'felipe@gmail.com' });
        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});