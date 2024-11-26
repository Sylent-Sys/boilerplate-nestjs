import { describe, beforeEach, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import {
  PrismaMockModule,
  PrismaServiceMock,
} from 'test/mocks/prisma/prisma.module.mock';
import { PrismaService } from 'nestjs-prisma';
import { UsersResultMocks } from 'test/mocks/prisma/result/users.result.mock';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
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
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a token', async () => {
    prismaServiceMock.user.findFirst.mockResolvedValue(
      UsersResultMocks.adminUser,
    );
    const token = await controller.login({
      key: 'admin@admin.com',
      password: 'admin',
    });
    expect(token).toMatchObject({ data: { token: expect.any(String) } });
  });

  it('should return a token with remember me', async () => {
    prismaServiceMock.user.findFirst.mockResolvedValue(
      UsersResultMocks.adminUser,
    );
    const token = await controller.login({
      key: 'admin@admin.com',
      password: 'admin',
      rememberMe: true,
    });
    expect(token).toMatchObject({ data: { token: expect.any(String) } });
  });

  it('should return an error', async () => {
    prismaServiceMock.user.findFirst.mockResolvedValue(null);
    try {
      await controller.login({ key: 'a', password: 'a' });
      throw new Error('Test failed, exception was not thrown');
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        throw error;
      }
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid credentials');
    }
  });

  it('should return an user', async () => {
    prismaServiceMock.user.findFirst.mockResolvedValue(
      UsersResultMocks.adminUser,
    );
    const user = await controller.me({
      user: UsersResultMocks.adminUser,
    });
    expect(user).toMatchObject({ data: UsersResultMocks.adminUser });
  });
});
