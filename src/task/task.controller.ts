import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller()
export class TaskController {
  /**
   * Controller that manages tasks data from rabbitmq queue.
   */
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern('createTask')
  async create(@Payload() data: CreateTaskDto) {
    return this.taskService.create(data);
  }

  @MessagePattern('findAllTask')
  async findAll(@Payload() where: Prisma.TaskWhereInput) {
    return this.taskService.findAll(where);
  }

  @MessagePattern('findOneTask')
  async findOne(@Payload() id: string) {
    return this.taskService.findOne(id);
  }

  @MessagePattern('updateTask')
  async update(@Payload() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(updateTaskDto.id, updateTaskDto);
  }

  @MessagePattern('removeTask')
  async remove(@Payload() id: string) {
    return this.taskService.remove(id);
  }
}
