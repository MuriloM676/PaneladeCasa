import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, CalculatePlateDto, QuickCheckoutDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const subtotal = dto.items.reduce((acc, it) => acc + it.unitPrice * (it.quantity ?? 1), 0);
    const total = subtotal + dto.deliveryFee;
    return this.prisma.order.create({
      data: {
        customerId: dto.customerId,
        chefId: dto.chefId,
        status: 'NEW',
        subtotal,
        deliveryFee: dto.deliveryFee,
        total,
        deliveryAddress: dto.deliveryAddress,
        paymentMethod: dto.paymentMethod,
        items: {
          create: dto.items.map((it) => ({
            dishId: it.dishId,
            quantity: it.quantity ?? 1,
            unitPrice: it.unitPrice,
            customizations: it.customizations ?? null,
          })),
        },
      },
    });
  }

  async calculatePlate(dto: CalculatePlateDto) {
    const items = await this.prisma.menuItem.findMany({ where: { id: { in: dto.menuItemIds } } });
    const total = items.reduce((acc, item) => acc + Number(item.price), 0);
    return { items, total };
  }

  async listForUser(user: { userId: string; role: 'CUSTOMER' | 'CHEF' | 'ADMIN' }) {
    if (user.role === 'CHEF') {
      const chef = await this.prisma.chef.findUnique({ where: { userId: user.userId } });
      if (!chef) return [];
      return this.prisma.order.findMany({
        where: { chefId: chef.id },
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { dish: true } },
          customer: { include: { user: true } },
          chef: true,
        },
      });
    }
    // CUSTOMER or ADMIN (as customer for now)
    const customer = await this.prisma.customer.findUnique({ where: { userId: user.userId } });
    if (!customer) return [];
    return this.prisma.order.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { dish: true } },
        chef: { include: { user: true } },
      },
    });
  }

  async quickCheckout(user: { userId: string; role: 'CUSTOMER' | 'CHEF' | 'ADMIN' }, dto: QuickCheckoutDto) {
    const customer = await this.prisma.customer.findUnique({ where: { userId: user.userId } });
    if (!customer) throw new BadRequestException('Cliente não encontrado');

    // Validate dishes and compute prices
    const dishIds = dto.items.map((i) => i.dishId);
    const dishes = await this.prisma.dish.findMany({ where: { id: { in: dishIds } } });
    if (dishes.length !== dishIds.length) throw new BadRequestException('Alguns pratos não existem');

    // Check all dishes belong to same chef
    const chefIdSet = new Set(dishes.map((d) => d.chefId));
    if (chefIdSet.size !== 1) throw new BadRequestException('Todos os itens devem ser do mesmo chef');
    const chefId = dishes[0].chefId;
    if (chefId !== dto.chefId) throw new BadRequestException('chefId não corresponde aos itens');

    const itemsWithPrice = dto.items.map((i) => {
      const dish = dishes.find((d) => d.id === i.dishId)!;
      return {
        dishId: i.dishId,
        quantity: i.quantity ?? 1,
        unitPrice: Number(dish.price),
        customizations: i.customizations ?? null,
      };
    });

    const subtotal = itemsWithPrice.reduce((acc, it) => acc + it.unitPrice * (it.quantity ?? 1), 0);
    const total = subtotal + dto.deliveryFee;

    return this.prisma.order.create({
      data: {
        customerId: customer.id,
        chefId,
        status: 'NEW',
        subtotal,
        deliveryFee: dto.deliveryFee,
        total,
        deliveryAddress: dto.deliveryAddress,
        paymentMethod: dto.paymentMethod,
        items: { create: itemsWithPrice },
      },
    });
  }

  async getOrderStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        total: true,
        chef: {
          select: {
            kitchenName: true,
          },
        },
        customer: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!order) throw new BadRequestException('Pedido não encontrado');
    return order;
  }
}

