import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TaskModule } from '@/task/task.module';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TaskModule,
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === 'test'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
