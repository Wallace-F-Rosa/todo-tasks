import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TaskService {
  /**
   * Service that deals with task data using Prisma.
   */

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async findAll(where: Prisma.TaskWhereInput) {
    if (Object.keys(where).length > 0) {
      return this.prisma.task.findMany({ where });
    }
    return this.prisma.task.findMany();
  }

  async findOne(id: string, userId: string) {
    return this.prisma.task.findFirstOrThrow({ where: { id, userId } });
  }

  async update(id: string, userId: string, data: UpdateTaskDto) {
    this.findOne(id, userId);
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    this.findOne(id, userId);
    return this.prisma.task.delete({ where: { id } });
  }

  async removeUserTasks(userId: string) {
    return this.prisma.task.deleteMany({ where: { userId } });
  }
}
