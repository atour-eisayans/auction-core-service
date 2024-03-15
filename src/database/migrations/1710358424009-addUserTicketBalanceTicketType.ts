import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTicketBalanceTicketType1710358424009
  implements MigrationInterface
{
  name = 'AddUserTicketBalanceTicketType1710358424009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_ticket_balance" ADD "ticket_type" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ticket_balance" ADD CONSTRAINT "FK_979df92f422f76ca44aebed330f" FOREIGN KEY ("ticket_type") REFERENCES "ticket_configuration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_ticket_balance" DROP CONSTRAINT "FK_979df92f422f76ca44aebed330f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ticket_balance" DROP COLUMN "ticket_type"`,
    );
  }
}
