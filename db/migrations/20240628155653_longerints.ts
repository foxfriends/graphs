import { AbstractMigration, Info, ClientPostgreSQL } from "https://deno.land/x/nessie@2.0.1/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    const transaction = await this.client.createTransaction(
      "longerints_up",
    );
    await transaction.begin();
    await transaction.queryArray`
      ALTER TABLE github_pull_request_reviews ALTER COLUMN id SET DATA TYPE BIGINT;
    `;
    await transaction.commit();
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    const transaction = await this.client.createTransaction(
      "longerints_down",
    );
    await transaction.begin();
    await transaction.queryArray`
      ALTER TABLE github_pull_request_reviews ALTER COLUMN id SET DATA TYPE INT;
    `;
    await transaction.commit();
  }
}
