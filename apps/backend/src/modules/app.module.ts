import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { HealthModule } from './health/health.module';
import { ChefsModule } from './chefs/chefs.module';
import { DishesModule } from './dishes/dishes.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    HealthModule,
    ChefsModule,
    DishesModule,
    MenuModule,
    OrdersModule,
    RatingsModule,
  ],
  controllers: [],
})
export class AppModule {}
