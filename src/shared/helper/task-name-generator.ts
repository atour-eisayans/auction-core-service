import { TaskType } from '../enum/task-type.enum';

const taskNameGenerator = (taskType: TaskType, identifier: string) =>
  `${taskType}_${identifier}`;

export default taskNameGenerator;
