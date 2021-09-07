import { ConsoleHandler, FileHandler, getLogger, setup } from "./deps/log.ts";
import { LOG_FILE, LOG_LEVEL } from "./env.ts";

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
  handlers.file = new FileHandler(LOG_LEVEL, {
    filename: LOG_FILE,
    formatter: (logRecord) => JSON.stringify(logRecord),
    mode: "w",
  });
}

await setup({
  handlers,
  loggers: {
    default: {
      level: LOG_LEVEL,
      handlers: Object.keys(handlers),
    },
  },
});

export default getLogger();
