import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto, UpdateDishDto } from './dto/dish.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('dishes')
export class DishesController {
  constructor(private dishes: DishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  create(@Body() dto: CreateDishDto) {
    return this.dishes.create(dto);
  }

  @Get()
  findAll(@Query('chefId') chefId?: string) {
    return this.dishes.findAll(chefId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishes.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  update(@Param('id') id: string, @Body() dto: UpdateDishDto) {
    return this.dishes.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  remove(@Param('id') id: string) {
    return this.dishes.remove(id);
  }
}
