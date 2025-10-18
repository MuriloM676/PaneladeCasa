import { Controller, Get, Param, Query, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ChefsService } from './chefs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('chefs')
export class ChefsController {
  constructor(private chefs: ChefsService) {}

  @Get()
  list(
    @Query('cuisine') cuisine?: string,
    @Query('location') location?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('minRating') minRating?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    const minRatingNum = minRating ? parseFloat(minRating) : undefined;

    return this.chefs.list({
      cuisine,
      location,
      page: pageNum,
      limit: limitNum,
      minRating: minRatingNum,
    });
  }

  // Rotas específicas ANTES de rotas com parâmetros dinâmicos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  @Get('profile/me')
  getMyProfile(@Req() req: any) {
    return this.chefs.findByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  @Put('profile')
  updateProfile(@Req() req: any, @Body() data: any) {
    return this.chefs.updateProfile(req.user.userId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  @Get('orders')
  getChefOrders(@Req() req: any) {
    return this.chefs.getChefOrders(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') orderId: string, @Body() data: { status: string }) {
    return this.chefs.updateOrderStatus(orderId, data.status);
  }

  // Rota com parâmetro dinâmico por ÚLTIMO
  @Get(':id')
  get(@Param('id') id: string) {
    return this.chefs.findById(id);
  }
}
