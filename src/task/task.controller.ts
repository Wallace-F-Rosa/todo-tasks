import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const data = { ...createTaskDto, userId: req.user.id };
    return this.taskService.create(data);
  }

  // FIXME: to use this endpoint we need rules and permissions implementation
  // @Get('/user/:userId')
  // findAll(@Param('userId') userId: string) {
  //   return this.taskService.findAll({ userId });
  // }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.taskService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, req.user.id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.taskService.remove(id, req.user.id);
  }

  @Delete('/user/:userId')
  removeUserTasks(@Request() req) {
    return this.taskService.removeUserTasks(req.user.id);
  }
}
