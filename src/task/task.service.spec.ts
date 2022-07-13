import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { v4 as uuid4 } from 'uuid';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, PrismaService],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('create task', async () => {
    const task = {
      name: 'Test task',
      description: 'Testing creation',
      userId: uuid4(),
    };
    const createdTask = await service.create(task);
    expect(createdTask).toMatchObject(task);
  });

  it('update task', async () => {
    const task = {
      name: 'Test task',
      description: 'Testing creation',
      userId: uuid4(),
    };
    const createdTask = await prisma.task.create({ data: task });
    createdTask.userId = uuid4();
    const updateTask = await service.update(createdTask.id, createdTask);
    expect(updateTask).toMatchObject(createdTask);
  });
});
