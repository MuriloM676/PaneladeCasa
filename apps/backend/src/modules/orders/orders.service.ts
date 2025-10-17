import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, CalculatePlateDto } from './dto/order.dto';

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
}
