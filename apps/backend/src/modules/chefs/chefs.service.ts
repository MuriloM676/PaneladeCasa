import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChefsService {
  constructor(private prisma: PrismaService) {}

  async list(params: {
    cuisine?: string;
    location?: string;
    page?: number;
    limit?: number;
    minRating?: number;
  }) {
    const { cuisine, location, page = 1, limit = 10, minRating } = params;
    const skip = (page - 1) * limit;

    const where: any = { approved: true };

    if (cuisine) {
      where.cuisineTypes = { has: cuisine };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const [chefs, total] = await Promise.all([
      this.prisma.chef.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { email: true } },
          _count: { select: { ratings: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.chef.count({ where }),
    ]);

    // Filtrar por minRating se fornecido (cálculo simplificado)
    let filteredChefs = chefs;
    if (minRating !== undefined) {
      filteredChefs = chefs.filter(() => true); // Placeholder - calcular rating médio
    }

    return {
      data: filteredChefs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findById(id: string) {
    return this.prisma.chef.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        ratings: { take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { ratings: true, orders: true } },
      },
    });
  }
}
