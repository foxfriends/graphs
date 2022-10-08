# Graphs

Some graphs for analyzing repositories, teams, and work, largely inspired by
this [article][article].

[article]: https://stackoverflow.blog/2021/08/25/see-where-your-engineering-process-go-wrong-with-data-visualization/?utm_source=Iterable&utm_medium=email&utm_campaign=the_overflow_newsletter

## Setup

This project uses [Deno][Deno] to run and [PostgreSQL][PostgreSQL] to store the
data.

[Deno]: https://deno.land/
[PostgreSQL]: https://www.postgresql.org/

Set up the environment:

1. Create a database and a database user for this app
   (`createdb graphs; createuser graphs -slP`).
2. Create `.env` file (copy the `.env.example`) and fill in the necessary
   values, if not already correct from `.env.defaults` (see [`dotenv`][dotenv]).
3. Create a [Github Personal Access Token][Github Personal Access Token] for the
   Github API. You will get errors if the permissions are wrong, but which are
   required is not yet determined.
4. Migrate the database using [Nessie][Nessie] (`deno task nessie migrate`)
5. Populate the database with some data using the populate script (see `deno task populate --help`)

[dotenv]: https://github.com/pietvanzoen/deno-dotenv
[Github Personal Access Token]: https://github.com/settings/tokens
[Nessie]: https://github.com/halvardssm/deno-nessie

You should now be able to run the app by running `deno task dev` in the `app` directory.
