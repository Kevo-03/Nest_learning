import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'test@test.com', password: 'test' } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'test' } as User]);
      },
      /*  remove: () => { },
       update: () => { } */
    };

    fakeAuthService = {
      /*  signUp: () => { },*/
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      }
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{
        provide: UsersService,
        useValue: fakeUsersService
      },
      {
        provide: AuthService,
        useValue: fakeAuthService
      }]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@test.mail');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.mail');
  })

  it('findOne returns the user with the specified id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  })

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn({ email: 'test@test.mail', password: 'test' }, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })
});
