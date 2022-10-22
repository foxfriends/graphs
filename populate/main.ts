import { Command } from "cliffy";
import { ghPrs } from "./commands/gh_prs.ts";

await new Command()
  .name("populate")
  .version("0.1.0")
  .description("Data aggregator for the graphs.")
  .command(
    "gh-prs",
    new Command().arguments("<repositories:string[]>").action(ghPrs),
  )
  .parse(Deno.args);
