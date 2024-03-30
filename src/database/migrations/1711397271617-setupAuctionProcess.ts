import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupAuctionProcess1711397271617 implements MigrationInterface {
  name = 'SetupAuctionProcess1711397271617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_11a089fffafc70261f6977a6383"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" RENAME COLUMN "currency_id" TO "ticket_configuration_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "automated_bid" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ticket_count" integer NOT NULL DEFAULT '0', "last_bidder" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" character varying, "auction_id" uuid, CONSTRAINT "PK_f6a6c158a33eb643b35159b4146" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD "current_price" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "ticket_configuration_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_18f896b58fbfabc71e6a8607d58" FOREIGN KEY ("ticket_configuration_id") REFERENCES "ticket_configuration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "automated_bid" ADD CONSTRAINT "FK_613cc71feefa4d9299d0f4a7de8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "automated_bid" ADD CONSTRAINT "FK_43cfa1300b881bd4402575332ec" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_78132b8a75ff1b8285c2de9379" ON "auction_result" ("auction_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9451d98ffb01b92ea1976704e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "automated_bid" DROP CONSTRAINT "FK_43cfa1300b881bd4402575332ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "automated_bid" DROP CONSTRAINT "FK_613cc71feefa4d9299d0f4a7de8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_18f896b58fbfabc71e6a8607d58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "ticket_configuration_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" DROP COLUMN "current_price"`,
    );
    await queryRunner.query(`DROP TABLE "automated_bid"`);
    await queryRunner.query(
      `ALTER TABLE "item" RENAME COLUMN "ticket_configuration_id" TO "currency_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_11a089fffafc70261f6977a6383" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
