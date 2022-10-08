import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.1/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    const transaction = await this.client.createTransaction(
      "prs_additions_timings_up",
    );
    await transaction.begin();
    await transaction.queryArray`
        ALTER TABLE github_pull_requests
          ADD COLUMN additions  INTEGER NOT NULL DEFAULT 0,
          ADD COLUMN deletions  INTEGER NOT NULL DEFAULT 0,
          ADD COLUMN created_at TIMESTAMP,
          ADD COLUMN merged_at  TIMESTAMP,
          ADD COLUMN closed_at  TIMESTAMP;
      `;
    await transaction.commit();
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    const transaction = await this.client.createTransaction(
      "prs_additions_timings_down",
    );
    await transaction.begin();
    await transaction.queryArray`
        ALTER TABLE github_pull_requests
          DROP COLUMN additions,
          DROP COLUMN deletions,
          DROP COLUMN created_at,
          DROP COLUMN merged_at,
          DROP COLUMN closed_at;
      `;
    await transaction.commit();
  }
}
