import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 as uuid4 } from 'uuid';
import { PrismaService } from '@/prisma/prisma.service';
import { TaskService } from '@/task/task.service';
import { create } from 'domain';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let taskService: TaskService;

  const userServiceUrl = process.env.USER_SERVICE_URL;
  const createUserAndAssignId = async (user) => {
    const data = {
      username: user.username,
      passwordHash: bcrypt.hashSync(user.password, 10),
    };
    const res = await request(userServiceUrl).post('/user').send(data);
    user.id = res.body.id;
    return user;
  };
  const login = async (user: { username: string; password: string }) => {
    const res = await request(userServiceUrl).post('/auth/login').send(user);
    return res.body.token;
  };

  // user data
  let user1 = {
    username: '',
    password: '',
    id: '',
  };
  let user2 = {
    username: '',
    password: '',
    id: '',
  };

  // task data
  const tasks = [
    {
      name: 'task1',
      description: 'first task',
    },
    {
      name: 'task2',
      description: 'second task',
    },
    {
      name: 'task3',
      description: 'third task',
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    taskService = moduleFixture.get<TaskService>(TaskService);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    if (user1.id) {
      await taskService.removeUserTasks(user1.id);
    }
    if (user2.id) {
      await taskService.removeUserTasks(user2.id);
    }
  });

  describe('todo', () => {
    describe('/tasks (POST)', () => {
      it('valid task', async () => {
        user1 = await createUserAndAssignId({
          username: faker.internet.userName(),
          password: faker.internet.password(),
        });
        const token = await login({
          username: user1.username,
          password: user1.password,
        });
        const task = {
          name: 'Test task',
          description: 'Test description',
          userId: user1.id,
        };
        const res = await request(app.getHttpServer())
          .post('/tasks')
          .set('Authorization', 'Bearer ' + token)
          .send(task);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject(task);
      });

      it('invalid task', async () => {
        user2 = await createUserAndAssignId({
          username: faker.internet.userName(),
          password: faker.internet.password(),
        });
        const token = await login({
          username: user1.username,
          password: user1.password,
        });
        const task = {
          name: 1,
          description: '',
        };
        const res = await request(app.getHttpServer())
          .post('/tasks')
          .set('Authorization', 'Bearer ' + token)
          .send(task);
        expect(res.status).toEqual(400);
        expect(res.body.message.length).toEqual(Object.keys(task).length);
        expect(res.body.error).toEqual('Bad Request');
      });
    });

    describe('/tasks (GET)', () => {
      it('list tasks from user', async () => {
        // const createdTasks = [];
        // for (const t of tasks) {
        //   createdTasks.push(await taskService.create(t));
        // }
        // const res = await request(app.getHttpServer()).get('/tasks');
        // expect(res.body.length).toEqual(createdTasks.length);
      });
    });
  });
});
