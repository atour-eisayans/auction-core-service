import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { TransactionManagerInterface } from '../shared/domain/transaction-manager.interface';

@Injectable()
export class TransactionManger implements TransactionManagerInterface {
  private readonly managers: Record<string, EntityManager>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.managers = {};
  }

  getManager(transactionName: string): EntityManager {
    const manager = this.managers[transactionName];

    if (!manager) {
      throw new Error('Manager is not set yet!');
    }

    return manager;
  }

  async runInTransaction<T = unknown>(
    transactionName: string,
    isolationLevel: IsolationLevel,
    callback: () => T | Promise<T>,
  ): Promise<T> {
    if (this.managers[transactionName]) {
      throw new Error(
        'Another transaction with the same name already is executing!',
      );
    }

    const result = await this.entityManager.transaction<T>(
      isolationLevel,
      async (entityManager) => {
        this.managers[transactionName] = entityManager;
        return await callback();
      },
    );

    this.managers[transactionName] = null;

    return result;
  }
}
