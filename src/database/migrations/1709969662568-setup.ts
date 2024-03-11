import { MigrationInterface, QueryRunner } from 'typeorm';

export class Setup1709969662568 implements MigrationInterface {
  name = 'Setup1709969662568';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "avatar" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying, "phone" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_91ba90f150e8804bdaad7b17ff8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "currency" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "symbol" character varying NOT NULL, "code" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticket_configuration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unit_price" double precision NOT NULL, "raising_amount" double precision NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "currency_id" uuid NOT NULL, CONSTRAINT "PK_02b34bf2532cb9e3a3d0bb51a26" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" jsonb NOT NULL, "price" double precision NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "currency_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_ticket_balance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "balance" double precision NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, CONSTRAINT "PK_37f43a089b21c66db65727b65b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" jsonb NOT NULL, "start_at" TIMESTAMP WITH TIME ZONE NULL, "ended_at" TIMESTAMP WITH TIME ZONE, "state" character varying NOT NULL, "limits" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "item_id" uuid NOT NULL, CONSTRAINT "PK_9dc876c629273e71646cf6dfa67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auction_result" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "finishedAt" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auction_id" uuid, "user_id" character varying, CONSTRAINT "REL_78132b8a75ff1b8285c2de9379" UNIQUE ("auction_id"), CONSTRAINT "PK_8e192d4302cff28685f54105ebb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_bids" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auction_id" uuid, "user_id" character varying, CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_configuration" ADD CONSTRAINT "FK_8c4780d61416f166f9904a60cc5" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_11a089fffafc70261f6977a6383" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_91ba90f150e8804bdaad7b17ff8" FOREIGN KEY ("category_id") REFERENCES "item_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ticket_balance" ADD CONSTRAINT "FK_c93216c079f0480e88863c42ee2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "FK_27c3c60778327d48b589190ab20" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_result" ADD CONSTRAINT "FK_78132b8a75ff1b8285c2de93799" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_result" ADD CONSTRAINT "FK_b7055c149c7e6f757b2ccd38747" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" ADD CONSTRAINT "FK_9e594e5a61c0f3cb25679f6ba8d" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" ADD CONSTRAINT "FK_2abdf07c084ae99935e6506d06e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid" DROP CONSTRAINT "FK_2abdf07c084ae99935e6506d06e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" DROP CONSTRAINT "FK_9e594e5a61c0f3cb25679f6ba8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_result" DROP CONSTRAINT "FK_b7055c149c7e6f757b2ccd38747"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_result" DROP CONSTRAINT "FK_78132b8a75ff1b8285c2de93799"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "FK_27c3c60778327d48b589190ab20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ticket_balance" DROP CONSTRAINT "FK_c93216c079f0480e88863c42ee2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_91ba90f150e8804bdaad7b17ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_11a089fffafc70261f6977a6383"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_configuration" DROP CONSTRAINT "FK_8c4780d61416f166f9904a60cc5"`,
    );
    await queryRunner.query(`DROP TABLE "bid"`);
    await queryRunner.query(`DROP TABLE "auction_result"`);
    await queryRunner.query(`DROP TABLE "auction"`);
    await queryRunner.query(`DROP TABLE "user_ticket_balance"`);
    await queryRunner.query(`DROP TABLE "item"`);
    await queryRunner.query(`DROP TABLE "ticket_configuration"`);
    await queryRunner.query(`DROP TABLE "currency"`);
    await queryRunner.query(`DROP TABLE "item_category"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
