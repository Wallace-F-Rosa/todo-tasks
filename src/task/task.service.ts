import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async findAll() {
    return `This action returns all task`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} task`;
  }

  async update(id: string, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string) {
    return `This action removes a #${id} task`;
  }
}
