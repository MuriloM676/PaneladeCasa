import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, CreateMenuItemDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  createCategory(chefId: string, dto: CreateCategoryDto) {
    return this.prisma.menuCategory.create({
      data: { chefId, name: dto.name, minSelect: dto.minSelect ?? 0, maxSelect: dto.maxSelect ?? 1 },
    });
  }

  getCategories(chefId: string) {
    return this.prisma.menuCategory.findMany({ where: { chefId }, include: { items: true } });
  }

  deleteCategory(id: string) {
    return this.prisma.menuCategory.delete({ where: { id } });
  }

  addItem(categoryId: string, dto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({ data: { categoryId, name: dto.name, price: dto.price } });
  }

  deleteItem(id: string) {
    return this.prisma.menuItem.delete({ where: { id } });
  }
}
