import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TaskModule } from '@/task/task.module';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
