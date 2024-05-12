import { EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

export type TransactionManagerInterface = {
  getManager: (transactionName: string) => EntityManager;
  runInTransaction: <T>(
    transactionName: string,
    isolationLevel: IsolationLevel,
    callback: () => T | Promise<T>,
  ) => T | Promise<T>;
};
