import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Note: This will fail if no database is running.
    // For local dev, we might want to skip await this.connect() if not available.
    try {
      await this.$connect();
    } catch (e) {
      console.warn('Prisma could not connect to the database. Running in offline mode.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
