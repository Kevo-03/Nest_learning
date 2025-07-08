import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };
        const module = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }],
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signUp('test@test.com', 'test');

        expect(user.password).not.toEqual('test');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with an email that is in use', async () => {
        await service.signUp('test@test.mail', 'test');
        await expect(service.signUp('test@test.mail', 'test')).rejects.toThrow(BadRequestException);

    });

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signIn('test@test.com', 'test')).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        /* fakeUsersService.find = () => Promise.resolve([{ email: 'test@test.mail', password: 'test' } as User]);
        await expect(service.signIn('asd@asd.mail', 'password')).rejects.toThrow(BadRequestException); */
        await service.signUp('test@test.mail', 'test');
        await expect(service.signIn('test@test.mail', 'password')).rejects.toThrow(BadRequestException);
    })

    it('returns a user if correct password is provided', async () => {
        await service.signUp('test@test.mail', 'test');
        const user = await service.signIn('test@test.mail', 'test');
        expect(user).toBeDefined();
    })
});
