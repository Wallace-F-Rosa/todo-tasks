import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { v4 as uuid4 } from 'uuid';
import { ConfigModule } from '@nestjs/config';

describe('TaskController', () => {
  let controller: TaskController;
  let prisma: PrismaService;

  beforeAll(async () => {
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

  beforeEach(async () => {
    await prisma.task.deleteMany({});
  });

  afterAll(async () => {
    await prisma.task.deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('valid task', async () => {
    const task = {
      name: 'Test task',
      description: 'Testing creation',
      userId: uuid4(),
    };
    const createdTask = await controller.create(task);
    expect(createdTask).toMatchObject(task);
  });

  it('update task', async () => {
    const task = {
      name: 'Test task',
      description: 'Testing creation',
      userId: uuid4(),
    };
    const createdTask = await prisma.task.create({ data: task });
    const updateData = {
      id: createdTask.id,
      name: 'Updated task',
      description: 'Updated text',
    };
    const updatedTask = await controller.update(updateData);
    createdTask.name = updateData.name;
    createdTask.description = updateData.description;
    expect(updatedTask).toMatchObject(createdTask);
  });

  it('delete task', async () => {
    const task = {
      name: 'Test task',
      description: 'Testing creation',
      userId: uuid4(),
    };
    const createdTask = await prisma.task.create({ data: task });
    const deletedTask = await controller.remove(createdTask.id);
    expect(deletedTask).toMatchObject(createdTask);
  });

  it('list tasks', async () => {
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
    const createdTasks = [];
    for (const t of tasks) {
      createdTasks.push(await prisma.task.create({ data: t }));
    }
    const allTasks = await controller.findAll({});
    expect(allTasks).toMatchObject(expect.arrayContaining(createdTasks));

    const userTasks = createdTasks.filter((item) => item.userId === user1);
    const userTaskList = await controller.findAll({ userId: user1 });
    expect(userTaskList).toMatchObject(expect.arrayContaining(userTasks));
  });
});
