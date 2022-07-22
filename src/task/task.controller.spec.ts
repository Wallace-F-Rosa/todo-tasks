import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { v4 as uuid4 } from 'uuid';
import { ConfigModule } from '@nestjs/config';

describe('TaskController', () => {
  let controller: TaskController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [`.env.${process.env.NODE_ENV}`],
        }),
      ],
      controllers: [TaskController],
      providers: [TaskService, PrismaService],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('valid task', async () => {
      const task = {
        name: 'Test task',
        description: 'Testing creation',
        userId: uuid4(),
      };
      const createdTask = await controller.create(task);
      expect(createdTask).toMatchObject(task);
    });

    it('invalid task', async () => { });
  });
});
