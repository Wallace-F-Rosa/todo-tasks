import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 as uuid4 } from 'uuid';
import { TaskController } from './../src/task/task.controller';
import { PrismaService } from '@/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let taskController: TaskController;

  // userIds
  const user1 = uuid4();
  const user2 = uuid4();

  // task data
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
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    taskController = moduleFixture.get<TaskController>(TaskController);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('todo', () => {
    describe('/tasks (POST)', () => {
      it('valid task', async () => {
        const task = {
          name: 'Test task',
          description: 'Test description',
          userId: '3f7e42bf-604c-4bc2-82fd-a3d3c7111510',
        };
        const res = await request(app.getHttpServer())
          .post('/tasks')
          .send(task);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject(task);
      });

      it('invalid task', async () => {
        const task = {
          name: 1,
          description: '',
          userId: '3',
        };
        const res = await request(app.getHttpServer())
          .post('/tasks')
          .send(task);
        expect(res.status).toEqual(400);
        expect(res.body.message.length).toEqual(Object.keys(task).length);
        expect(res.body.error).toEqual('Bad Request');
      });
    });

    describe('/tasks (GET)', () => {
      it('list tasks from user', async () => {
        for (const t of tasks) {
          taskController.create(t);
        }

        const res = await request(app.getHttpServer()).get('/tasks');
        console.log(res.body);
      });
    });
  });
});
