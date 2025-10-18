import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChefsService } from './chefs.service';

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

  @Get(':id')
  get(@Param('id') id: string) {
    return this.chefs.findById(id);
  }
}
