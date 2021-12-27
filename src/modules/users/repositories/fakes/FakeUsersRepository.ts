import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {

    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id == id);
        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email == email);
        return findUser;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const createUser = new User();

        Object.assign(createUser, { id: uuid() }, userData);

        this.users.push(createUser);

        return createUser;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(findUser => findUser.id == user.id);
        this.users[findIndex] = user;

        return user;
    }

    public async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<User[]> {

        let users = this.users;
        if (except_user_id) {
            users = this.users.filter(user => user.id != except_user_id);
        }

        return users;
    }

}

export default FakeUsersRepository;