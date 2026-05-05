/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export  class CreateResultsTable1777995850121 {
    name = 'CreateResultsTable1777995850121'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "role_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "technician_profiles" ("id" SERIAL NOT NULL, "bio" text, "skills" text, "user_id" integer, CONSTRAINT "REL_328f93227e883c577337c6a955" UNIQUE ("user_id"), CONSTRAINT "PK_b8b333b43558d1423241cb4924e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_fe4da5476c4ffe5aa2d3524ae68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_requests" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "customer_id" integer, "category_id" integer, CONSTRAINT "PK_ee60bcd826b7e130bfbd97daf66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assignments" ("id" SERIAL NOT NULL, "assigned_at" TIMESTAMP NOT NULL DEFAULT now(), "request_id" integer, "technician_id" integer, "assigned_by_id" integer, CONSTRAINT "PK_c54ca359535e0012b04dcbd80ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status_history" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "service_request_id" integer, "updated_by_id" integer, CONSTRAINT "PK_271a5228edb4eeb41bc01d58fac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "comment" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "request_id" integer, "reviewer_id" integer, "technician_id" integer, CONSTRAINT "REL_6ea6d2328e7d32aa0b0970d8d9" UNIQUE ("request_id"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "technician_profiles" ADD CONSTRAINT "FK_328f93227e883c577337c6a9551" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_requests" ADD CONSTRAINT "FK_1f899159d1935fa7ff19f06d733" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_requests" ADD CONSTRAINT "FK_fc34d8acfeb11bd777044e25ced" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignments" ADD CONSTRAINT "FK_a44a3bf55d50124c87b0fdca113" FOREIGN KEY ("request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignments" ADD CONSTRAINT "FK_29dc9b63f00c61630b9104bde5c" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignments" ADD CONSTRAINT "FK_a76bdbfeb13c3a195855993eaa5" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "status_history" ADD CONSTRAINT "FK_7ac063322f98eb240cd835cb8d3" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "status_history" ADD CONSTRAINT "FK_c8a0e7cef768b677e91f5348c00" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_6ea6d2328e7d32aa0b0970d8d96" FOREIGN KEY ("request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_92e950a2513a79bb3fab273c92e" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_e4f847330bb3d2fa17888e10564" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_e4f847330bb3d2fa17888e10564"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_92e950a2513a79bb3fab273c92e"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_6ea6d2328e7d32aa0b0970d8d96"`);
        await queryRunner.query(`ALTER TABLE "status_history" DROP CONSTRAINT "FK_c8a0e7cef768b677e91f5348c00"`);
        await queryRunner.query(`ALTER TABLE "status_history" DROP CONSTRAINT "FK_7ac063322f98eb240cd835cb8d3"`);
        await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "FK_a76bdbfeb13c3a195855993eaa5"`);
        await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "FK_29dc9b63f00c61630b9104bde5c"`);
        await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "FK_a44a3bf55d50124c87b0fdca113"`);
        await queryRunner.query(`ALTER TABLE "service_requests" DROP CONSTRAINT "FK_fc34d8acfeb11bd777044e25ced"`);
        await queryRunner.query(`ALTER TABLE "service_requests" DROP CONSTRAINT "FK_1f899159d1935fa7ff19f06d733"`);
        await queryRunner.query(`ALTER TABLE "technician_profiles" DROP CONSTRAINT "FK_328f93227e883c577337c6a9551"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "status_history"`);
        await queryRunner.query(`DROP TABLE "assignments"`);
        await queryRunner.query(`DROP TABLE "service_requests"`);
        await queryRunner.query(`DROP TABLE "service_categories"`);
        await queryRunner.query(`DROP TABLE "technician_profiles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }
}
