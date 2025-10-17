import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDishDto, UpdateDishDto } from './dto/dish.dto';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateDishDto) {
    return this.prisma.dish.create({
      data: {
        chefId: dto.chefId,
        type: dto.type,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        ingredients: dto.ingredients ?? [],
        photoUrl: dto.photoUrl,
        prepMinutes: dto.prepMinutes,
      },
    });
  }

  findAll(chefId?: string) {
    return this.prisma.dish.findMany({ where: chefId ? { chefId } : {} });
  }

  findOne(id: string) {
    return this.prisma.dish.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateDishDto) {
    return this.prisma.dish.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.dish.delete({ where: { id } });
  }
}
