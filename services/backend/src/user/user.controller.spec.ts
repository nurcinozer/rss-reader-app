import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/common';
import { UpdateUserDto } from '@/user/dto';
import { Cache } from 'cache-manager';

describe('UserController Unit Tests', () => {
  let userController: UserController;
  let userService: UserService;
  let user: User;
  let cache: Cache;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => '',
            set: () => jest.fn(),
            del: () => jest.fn(),
          },
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    cache = moduleRef.get(CACHE_MANAGER);

    const date = new Date();
    user = {
      fullName: 'John Doe',
      id: 1,
      email: 'john.doe@example.com',
      createdAt: date,
      updatedAt: date,
    };
  });

  it('Should return current user', async () => {
    const expected = { ...user };

    jest
      .spyOn(userService, 'getUserByEmail')
      .mockImplementation(async () => Promise.resolve(expected));

    const actual = await userController.getCurrentUser(expected);
    expect(actual).toBe(expected);
  });

  it('Should return user when provided email', async () => {
    const expected = { ...user };

    jest
      .spyOn(userService, 'getUserByEmail')
      .mockImplementation(async () => Promise.resolve(expected));

    const actual = await userController.getUserByEmail(expected.email);
    expect(actual).toBe(expected);
  });

  it('Should update the user', async () => {
    const newName = 'Jane Doe';
    const expected = {
      ...user,
      fullName: newName,
    };

    jest
      .spyOn(userService, 'updateUser')
      .mockImplementation(async () => Promise.resolve(expected));

    jest.spyOn(cache, 'set');

    const dto: UpdateUserDto = {
      fullName: newName,
    };

    const actual = await userController.updateUser({ userId: user.id }, dto);
    expect(actual).toBe(expected);
  });
});
