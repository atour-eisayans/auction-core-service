import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TaskType } from '../shared/enum/task-type.enum';
import taskNameGenerator from '../shared/helper/task-name-generator';

@Injectable()
export class TaskService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  public async scheduleTask(
    taskType: TaskType,
    identifier: string,
    timeoutSeconds: number,
    callback: () => unknown,
  ): Promise<string> {
    const taskName = taskNameGenerator(taskType, identifier);
    await this.deleteTask(taskName);

    const taskId = setTimeout(callback, timeoutSeconds * 1_000);
    this.schedulerRegistry.addTimeout(taskName, taskId);

    return taskName;
  }

  public getTaskId(taskName: string): number {
    return this.schedulerRegistry.getTimeout(taskName);
  }

  public async setTaskAsDone(taskName: string): Promise<void> {
    return;
  }

  public async deleteTask(taskName: string): Promise<void> {
    try {
      const taskId = this.getTaskId(taskName);
      if (taskId) {
        this.schedulerRegistry.deleteTimeout(taskName);
      }
    } catch {}
  }

  public getTasksList(): string[] {
    return this.schedulerRegistry.getTimeouts();
  }
}
