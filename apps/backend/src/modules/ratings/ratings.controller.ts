import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController {
  constructor(private ratings: RatingsService) {}

  @Post()
  rate(@Body() body: { customerId: string; chefId: string; stars: number; comment?: string }) {
    return this.ratings.rate(body);
  }

  @Get('/chef/:id')
  list(@Param('id') id: string) {
    return this.ratings.listForChef(id);
  }
}
