import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, CreateUserRole } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
  const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
        role: dto.role === CreateUserRole.CHEF ? Role.CHEF : Role.CUSTOMER,
        chef: dto.role === CreateUserRole.CHEF ? { create: { kitchenName: '', approved: false } } : undefined,
        customer: dto.role === CreateUserRole.CUSTOMER ? { create: {} } : undefined,
      },
    });
    return { id: user.id, email: user.email, role: user.role };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
