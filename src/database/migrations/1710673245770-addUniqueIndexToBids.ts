import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIndexToBids1710673245770 implements MigrationInterface {
  name = 'AddUniqueIndexToBids1710673245770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b565c0e635b7c547985e3b55ba" ON "bid" ("auction_id", "user_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b565c0e635b7c547985e3b55ba"`,
    );
  }
}
