import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChefsService } from './chefs.service';

@Controller('chefs')
export class ChefsController {
  constructor(private chefs: ChefsService) {}

  @Get()
  list(@Query('cuisine') cuisine?: string, @Query('location') location?: string) {
    return this.chefs.list({ cuisine, location });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.chefs.findById(id);
  }
}
