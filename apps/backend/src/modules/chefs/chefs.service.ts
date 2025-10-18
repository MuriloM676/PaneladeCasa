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

  async findByUserId(userId: string) {
    return this.prisma.chef.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true } },
        _count: { select: { ratings: true, orders: true, dishes: true } },
      },
    });
  }

  async updateProfile(userId: string, data: {
    kitchenName?: string;
    bio?: string;
    location?: string;
    openingHours?: any;
    cuisineTypes?: string[];
    deliveryRadius?: number;
    photoUrl?: string;
    avatarUrl?: string;
    coverUrl?: string;
  }) {
    const chef = await this.prisma.chef.findUnique({ where: { userId } });
    if (!chef) {
      throw new Error('Chef not found');
    }

    return this.prisma.chef.update({
      where: { id: chef.id },
      data: {
        kitchenName: data.kitchenName,
        bio: data.bio,
        location: data.location,
        openingHours: data.openingHours,
        cuisineTypes: data.cuisineTypes,
      },
      include: {
        user: { select: { email: true } },
      },
    });
  }

  async getChefOrders(userId: string) {
    const chef = await this.prisma.chef.findUnique({ where: { userId } });
    if (!chef) {
      throw new Error('Chef not found');
    }

    return this.prisma.order.findMany({
      where: { chefId: chef.id },
      include: {
        customer: {
          include: {
            user: { select: { email: true } },
          },
        },
        items: {
          include: {
            dish: { select: { name: true, photoUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    const validStatuses = ['NEW', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED', 'CANCELLED'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });
  }
}
