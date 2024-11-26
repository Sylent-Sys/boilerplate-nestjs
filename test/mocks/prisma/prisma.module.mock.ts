import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { vi } from 'vitest';

export const PrismaServiceMock = {
  user: {
    findFirst: vi.fn(),
  },
};
@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useValue: PrismaServiceMock,
    },
  ],
  exports: [PrismaService],
})
export class PrismaMockModule {}
