import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
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

  describe('list tasks', () => {
    const user1 = uuid4();
    const user2 = uuid4();
    const tasks = [
      {
        name: 'task1',
        description: 'first task',
        userId: user1,
      },
      {
        name: 'task2',
        description: 'second task',
        userId: user1,
      },
      {
        name: 'task3',
        description: 'third task',
        userId: user2,
      },
    ];

    it('all tasks', async () => {
      const createdTasks = [];
      for (const t of tasks) {
        createdTasks.push(await prisma.task.create({ data: t }));
      }
      expect(createdTasks.length).toEqual(tasks.length);
      const foundTasks = await service.findAll({});
      expect(foundTasks.length).toEqual(createdTasks.length);
      expect(foundTasks).toMatchObject(expect.arrayContaining(createdTasks));
    });

    it('from specific user', async () => {
      const createdTasks = [];
      for (const t of tasks) {
        createdTasks.push(await prisma.task.create({ data: t }));
      }
      expect(createdTasks.length).toEqual(tasks.length);
      const foundTasks = await service.findAll({ userId: user2 });
      const user2Tasks = createdTasks.filter((item) => item.userId === user2);
      expect(foundTasks.length).toEqual(user2Tasks.length);
      expect(foundTasks).toMatchObject(expect.arrayContaining(user2Tasks));
    });

    it('from task name', async () => {
      const createdTasks = [];
      for (const t of tasks) {
        createdTasks.push(await prisma.task.create({ data: t }));
      }
      expect(createdTasks.length).toEqual(tasks.length);
      const foundTasks = await service.findAll({ name: { contains: '3' } });
      const filteredTasks = createdTasks.filter((item) =>
        item.name.includes('3'),
      );
      expect(foundTasks.length).toEqual(filteredTasks.length);
      expect(foundTasks).toMatchObject(expect.arrayContaining(filteredTasks));
    });
  });

  it('find a task', async () => {
    const task = {
      name: 'Test task',
      description: 'Testing creation',
      userId: uuid4(),
    };
    const createdTask = await prisma.task.create({ data: task });
    const foundTask = await service.findOne(createdTask.id);
    expect(foundTask).toMatchObject(createdTask);
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

  it('delete task', async () => {
    const task = {
      name: 'Test task',
      description: 'Testing creation',
      userId: uuid4(),
    };
    const createdTask = await prisma.task.create({ data: task });
    const deletedTask = await service.remove(createdTask.id);
    expect(deletedTask).toMatchObject(createdTask);
  });

  beforeEach(async () => {
    await prisma.task.deleteMany({});
  });
});
