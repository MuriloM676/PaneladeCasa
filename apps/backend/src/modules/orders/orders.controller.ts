import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, CalculatePlateDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService, private prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  @Post('calculate-plate')
  calculatePlate(@Body() dto: CalculatePlateDto) {
    return this.orders.calculatePlate(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  get(@Param('id') id: string) {
    return this.prisma.order.findUnique({ where: { id }, include: { items: true } });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body() body: { status: 'NEW' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED' }) {
    return this.prisma.order.update({ where: { id }, data: { status: body.status } });
  }
}
