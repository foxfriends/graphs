import { getLogger, handlers as Handlers, setup } from "log";
import { LOG_FILE, LOG_LEVEL } from "./env.ts";

const { ConsoleHandler, FileHandler, BaseHandler } = Handlers;

// NOTE: could not find BaseHandler as a type, so just going with any for now
const handlers: Record<string, any> = {
  console: new ConsoleHandler(LOG_LEVEL, {
    formatter: (logRecord) => {
      const args = logRecord.args.map((arg) => JSON.stringify(arg, null, 2));
      return [
        `${logRecord.datetime.toISOString()} - [${logRecord.levelName}]: ${logRecord.msg}`,
        ...args,
      ].join("\n");
    },
  }),
};

if (LOG_FILE) {
  handlers.file = new FileHandler("DEBUG", {
    filename: LOG_FILE,
    formatter: (logRecord) => JSON.stringify({ ...logRecord, args: logRecord.args }),
    mode: "w",
  });
}

await setup({
  handlers,
  loggers: {
    default: {
      level: "DEBUG",
      handlers: Object.keys(handlers),
    },
  },
});

export default getLogger();
