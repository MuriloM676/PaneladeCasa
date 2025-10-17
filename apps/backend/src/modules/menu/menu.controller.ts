import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateCategoryDto, CreateMenuItemDto } from './dto/menu.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('menu')
export class MenuController {
  constructor(private menu: MenuService) {}

  @Post('categories/:chefId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  createCategory(@Param('chefId') chefId: string, @Body() dto: CreateCategoryDto) {
    return this.menu.createCategory(chefId, dto);
  }

  @Get('categories/:chefId')
  getCategories(@Param('chefId') chefId: string) {
    return this.menu.getCategories(chefId);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  deleteCategory(@Param('id') id: string) {
    return this.menu.deleteCategory(id);
  }

  @Post('items/:categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  addItem(@Param('categoryId') categoryId: string, @Body() dto: CreateMenuItemDto) {
    return this.menu.addItem(categoryId, dto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CHEF')
  deleteItem(@Param('id') id: string) {
    return this.menu.deleteItem(id);
  }
}
