import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ratings')
export class RatingsController {
  constructor(private ratings: RatingsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @Post()
  rate(
    @Req() req: any,
    @Body() body: { orderId?: string; chefId?: string; stars: number; comment?: string }
  ) {
    return this.ratings.rate(req.user.userId, body);
  }

  @Get('/chef/:id')
  list(@Param('id') id: string) {
    return this.ratings.listForChef(id);
  }
}
