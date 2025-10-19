import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async rate(
    userId: string,
    params: { orderId?: string; chefId?: string; stars: number; comment?: string }
  ) {
    const { orderId, chefId, stars, comment } = params;

    // Buscar customer pelo userId
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new BadRequestException('Cliente não encontrado');
    }

    let targetChefId = chefId;

    // Se orderId for fornecido, buscar chefId do pedido
    if (orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { chef: true },
      });

      if (!order) {
        throw new BadRequestException('Pedido não encontrado');
      }

      if (order.customerId !== customer.id) {
        throw new BadRequestException('Este pedido não pertence a você');
      }

      if (order.status !== 'COMPLETED') {
        throw new BadRequestException('Só é possível avaliar pedidos concluídos');
      }

      targetChefId = order.chefId;
    }

    if (!targetChefId) {
      throw new BadRequestException('chefId ou orderId é obrigatório');
    }

    // Verificar se já existe avaliação para este pedido
    if (orderId) {
      const existingRating = await this.prisma.rating.findFirst({
        where: {
          customerId: customer.id,
          chefId: targetChefId,
          orderId: orderId,
        },
      });

      if (existingRating) {
        throw new BadRequestException('Você já avaliou este pedido');
      }
    }

    return this.prisma.rating.create({
      data: {
        customerId: customer.id,
        chefId: targetChefId,
        orderId: orderId,
        stars,
        comment,
      },
      include: {
        customer: {
          include: {
            user: { select: { email: true } },
          },
        },
        chef: {
          select: { kitchenName: true },
        },
      },
    });
  }

  listForChef(chefId: string) {
    return this.prisma.rating.findMany({
      where: { chefId },
      include: {
        customer: {
          include: {
            user: { select: { email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
