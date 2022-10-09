import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.1/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    const transaction = await this.client.createTransaction(
      "reviews_up",
    );
    await transaction.begin();
    await transaction.queryArray`
      CREATE TABLE github_pull_request_reviews (
        id               INT PRIMARY KEY,
        pull_request_id  INT NOT NULL,
        repository_owner VARCHAR(39) NOT NULL REFERENCES github_users (login) ON DELETE CASCADE,
        repository_name  VARCHAR(100) NOT NULL,
        reviewer         VARCHAR(39) NOT NULL REFERENCES github_users (login) ON DELETE CASCADE,
        comment_count    INT NOT NULL,
        submitted_at     TIMESTAMP,
        FOREIGN KEY (pull_request_id, repository_owner, repository_name) REFERENCES github_pull_requests (id, repository_owner, repository_name) ON DELETE CASCADE,
        FOREIGN KEY (repository_owner, repository_name) REFERENCES github_repositories (owner, name) ON DELETE CASCADE
      );
    `;
    await transaction.commit();
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    const transaction = await this.client.createTransaction(
      "reviews_down",
    );
    await transaction.begin();
    await transaction.queryArray`
      DROP TABLE github_pull_request_reviews;
    `;
    await transaction.commit();
  }
}
