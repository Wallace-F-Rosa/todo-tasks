import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, PrismaService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('valid task', async () => {
      const task = {
        name: 'Test task',
        description: 'Testing creation',
        userId: 'test',
      };
      // const servicePayload = {
      //   create: task,
      // };
      const createdTask = await service.create(task);
      expect(createdTask).toMatchObject(task);
    });
  });
});
