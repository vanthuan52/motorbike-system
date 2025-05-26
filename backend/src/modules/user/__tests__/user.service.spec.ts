import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../domain/user';
import { ENUM_USER_STATUS, ENUM_USER_TYPE } from '../enums/user.enum';
import { mockUser } from '../mocks/users';

describe('UserService (Mongoose)', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const dto: CreateUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password',
        type: ENUM_USER_TYPE.CUSTOMER,
        ref_id: 'uuid-ref',
      };

      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await userService.create(dto);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.findById('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        userService.findById('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      mockUserRepository.findAll.mockResolvedValue([mockUser]);

      const result = await userService.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update and return the updated user', async () => {
      const dto: UpdateUserDto = { status: ENUM_USER_STATUS.INACTIVE };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(
        new User({ ...mockUser, ...dto } as Partial<User>),
      );

      const result = await userService.update(mockUser._id, dto);
      expect(result?.status).toEqual(ENUM_USER_STATUS.INACTIVE);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser._id, dto);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        userService.update('507f1f77bcf86cd799439011', {
          status: ENUM_USER_STATUS.INACTIVE,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user and return { deleted: true }', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      const result = await userService.deleteById(mockUser._id);
      expect(result).toEqual({ deleted: true });
      expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUser._id);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        userService.deleteById('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
