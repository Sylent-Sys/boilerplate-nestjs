import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async findOne(key: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: key }, { id: key }],
      },
    });
  }
}
