import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './enum/role.enum';

describe('UsersService', () => {
  let service: UsersService;
  let repo: UsersRepository;

  const mockUser: User = {
    id: '1',
    email: 'testo@test.com',
    password: 'hashedPassword',
    administrator: Role.User,
    orders: [],
    name: 'Test User',
    phone: 1234567890,
    country: 'USA',
    address: '123 Test St',
    city: 'Test City',
  };

  const mockUserDto: CreateUserDto = {
    email: 'test@test.com',
    password: 'password',
    confirmPassword: 'password',
    name: 'Test User',
    address: '123 Test St',
    phone: 1234567890,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            delete: jest.fn().mockResolvedValue(undefined),
            findByEmail: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll(1, 5);
      expect(result).toEqual([mockUser]);
      expect(repo.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalled();
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
      await expect(service.findOne('1')).rejects.toThrow(
        'User with ID 1 not found',
      );
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const result = await service.create(mockUserDto);
      expect(result).toEqual(mockUser);
      expect(repo.create).toHaveBeenCalled();
    });

    it('should throw an error if email is already in use', async () => {
      jest.spyOn(repo, 'findByEmail').mockResolvedValue(mockUser);
      await expect(service.create(mockUserDto)).rejects.toThrow(
        'El correo electrónico ya está en uso',
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const result = await service.update('1', mockUserDto);
      expect(result).toEqual(mockUser);
      expect(repo.update).toHaveBeenCalled();
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(repo, 'update').mockResolvedValue(undefined);
      await expect(service.update('1', mockUserDto)).rejects.toThrow(
        'User with ID 1 not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = await service.delete('1');
      expect(result).toEqual('1');
      expect(repo.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
      await expect(service.delete('1')).rejects.toThrow(
        'User with ID 1 not found',
      );
    });
  });
});
