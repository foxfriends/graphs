import { AbstractMigration, Info, ClientPostgreSQL } from 'https://deno.land/x/nessie@2.0.1/mod.ts';

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    const transaction = await this.client.createTransaction('github_pull_requests_reviewers_up');
    await transaction.begin();
    await transaction.queryArray`
      CREATE TABLE github_users (
        login         VARCHAR(39) PRIMARY KEY,
        avatarUrl     TEXT
      )
    `;
    await transaction.queryArray`
      CREATE TABLE github_repositories (
        owner         VARCHAR(39) NOT NULL REFERENCES github_users (login) ON DELETE CASCADE,
        name          VARCHAR(100) NOT NULL ON UPDATE CASCADE,
        PRIMARY KEY (owner, name)
      )
    `;
    await transaction.queryArray`
      CREATE TABLE github_pull_requests (
        id               INT PRIMARY KEY,
        repository_owner VARCHAR(39) NOT NULL,
        repository_name  VARCHAR(100) NOT NULL,
        title            VARCHAR(256) NOT NULL,
        author           VARCHAR(39) NOT NULL REFERENCES github_users (login) ON DELETE CASCADE,
        FOREIGN KEY (repository_name, repository_owner) REFERENCES github_repositories (name, owner) ON DELETE CASCADE
      )
    `;
    await transaction.queryArray`
      CREATE TABLE github_pull_request_reviewers (
        pull_request   INT REFERENCES github_pull_requests (id) ON DELETE CASCADE,
        reviewer       VARCHAR(39) NOT NULL REFERENCES github_users (login) ON DELETE CASCADE,
        PRIMARY KEY (pull_request, reviewer)
      )
    `;
    await transaction.commit();
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    const transaction = await this.client.createTransaction('github_pull_requests_reviewers_down');
    await transaction.begin();
    await transaction.queryArray`DROP TABLE github_pull_request_reviewers`;
    await transaction.queryArray`DROP TABLE github_pull_requests`;
    await transaction.queryArray`DROP TABLE github_users`;
    await transaction.commit();
  }
}
