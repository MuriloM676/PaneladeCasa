import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChefsService {
  constructor(private prisma: PrismaService) {}

  list(params: { cuisine?: string; location?: string }) {
    // Simplificado: só retorna todos por enquanto.
    return this.prisma.chef.findMany({ include: { user: true } });
  }

  findById(id: string) {
    return this.prisma.chef.findUnique({ where: { id }, include: { user: true } });
  }
}
