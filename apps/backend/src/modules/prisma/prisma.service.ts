import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to database');
    } catch (err) {
      this.logger.warn('Database not connected yet (check DATABASE_URL). Service will try to connect on first query.');
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
