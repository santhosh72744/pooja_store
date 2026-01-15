import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrdersPayments1768071558114 implements MigrationInterface {
  name = 'AddOrdersPayments1768071558114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ---- payments ----
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "orderId" character varying NOT NULL,
        "stripePaymentIntentId" character varying NOT NULL,
        "amount" integer NOT NULL,
        "status" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")
      )
    `);

    // ---- orders ----
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" character varying NOT NULL,
        "status" character varying NOT NULL,
        "paymentStatus" character varying NOT NULL,
        "totalAmount" numeric NOT NULL,
        "stripePaymentIntentId" character varying,
        "shippingAddress" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
      )
    `);

    // ---- order_items ----
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "productId" character varying NOT NULL,
        "productName" character varying NOT NULL,
        "productImage" character varying NOT NULL,
        "quantity" integer NOT NULL,
        "price" numeric NOT NULL,
        "orderId" uuid,
        CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "order_items"
      ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"
      FOREIGN KEY ("orderId")
      REFERENCES "orders"("id")
      ON DELETE CASCADE
    `);

    // ---- SAFE users.email migration ----
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP CONSTRAINT IF EXISTS "users_email_key"
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'users'
          AND column_name = 'email'
        ) THEN
          ALTER TABLE "users" ADD COLUMN "email" character varying;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      UPDATE "users"
      SET "email" = CONCAT('user_', id, '@temp.local')
      WHERE "email" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "email" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "users_email_key" UNIQUE ("email")
    `);

    // ---- users other constraints (unchanged logic) ----
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "isEmailVerified" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "createdAt" SET DEFAULT now()
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "updatedAt" SET DEFAULT now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "order_items"
      DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"
    `);

    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "payments"`);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP CONSTRAINT IF EXISTS "users_email_key"
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "email"
    `);
  }
}
