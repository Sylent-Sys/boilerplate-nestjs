import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import {
  PrismaMockModule,
  PrismaServiceMock,
} from 'test/mocks/prisma/prisma.module.mock';
import { UsersResultMocks } from 'test/mocks/prisma/result/users.result.mock';
import { PrismaService } from 'nestjs-prisma';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaServiceMock: typeof PrismaServiceMock;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaMockModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthModule,
      ],
    }).compile();
    prismaServiceMock = module.get<typeof PrismaServiceMock>(PrismaService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a token', async () => {
    prismaServiceMock.user.findFirst.mockResolvedValue(
      UsersResultMocks.adminUser,
    );
    const token = await service.login({
      key: 'admin@admin.com',
      password: 'admin',
    });
    expect(token).toEqual(expect.any(String));
  });

  it('should return a user', async () => {
    prismaServiceMock.user.findFirst.mockResolvedValue(
      UsersResultMocks.adminUser,
    );
    const user = await service.validateUser('admin@admin.com');
    expect(user).toEqual(expect.objectContaining({ id: expect.any(String) }));
  });

  it('should return a user', async () => {
    prismaServiceMock.user.findFirst.mockResolvedValue(null);
    try {
      await service.validateUser('');
      throw new Error('Test failed, exception was not thrown');
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        throw error;
      }
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid credentials');
    }
  });
});
