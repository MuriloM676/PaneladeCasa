import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, CalculatePlateDto, QuickCheckoutDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

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

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@CurrentUser() user: { userId: string; role: 'CUSTOMER' | 'CHEF' | 'ADMIN' }) {
    return this.orders.listForUser(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  get(@Param('id') id: string) {
    return this.prisma.order.findUnique({ where: { id }, include: { items: true } });
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  getStatus(@Param('id') id: string) {
    return this.orders.getOrderStatus(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body() body: { status: 'NEW' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED' }) {
    return this.prisma.order.update({ where: { id }, data: { status: body.status } });
  }

  @Post('quick-checkout')
  @UseGuards(JwtAuthGuard)
  quickCheckout(
    @CurrentUser() user: { userId: string; role: 'CUSTOMER' | 'CHEF' | 'ADMIN' },
    @Body() dto: QuickCheckoutDto,
  ) {
    return this.orders.quickCheckout(user, dto);
  }
}
