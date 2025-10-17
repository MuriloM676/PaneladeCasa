import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  rate(params: { customerId: string; chefId: string; stars: number; comment?: string }) {
    return this.prisma.rating.create({ data: params });
  }

  listForChef(chefId: string) {
    return this.prisma.rating.findMany({ where: { chefId } });
  }
}
