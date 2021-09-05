import { Command } from "./deps/cliffy.ts";
import { ghPrs } from "./commands/gh_prs.ts";

const options = await new Command()
  .name("populate")
  .version("0.1.0")
  .description("Data aggregator for the graphs.")
  .command(
    "gh-prs",
    new Command()
      .arguments("<owner:string> <repository:string>")
      .action(ghPrs),
  )
  .parse(Deno.args);
