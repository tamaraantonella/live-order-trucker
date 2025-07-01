import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed_password',
    role: 'client',
    created_at: new Date(),
    updated_at: new Date(),
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      const email = 'test@example.com';

      mockRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      const email = 'nonexistent@example.com';

      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const newUserData: User = {
        email: 'newuser@example.com',
        password: 'hashed_password',
        role: 'delivery',
      } as User;

      const savedUser = {
        ...newUserData,
        id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(newUserData);

      expect(mockRepository.save).toHaveBeenCalledWith(newUserData);
      expect(result).toEqual(savedUser);
    });

    it('should handle user creation with all fields', async () => {
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(mockUser);

      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
