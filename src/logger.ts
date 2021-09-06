import { setup, FileHandler, ConsoleHandler, getLogger } from "./deps/log.ts";
import { LOG_LEVEL, LOG_FILE } from "./env.ts";

// NOTE: could not find BaseHandler as a type, so just going with any for now
const handlers: Record<string, any> = {
  console: new ConsoleHandler(LOG_LEVEL, {
    formatter: (logRecord) => {
      const args = logRecord.args.map((arg) => JSON.stringify(arg, null, 2)).join('\n');
      return `${logRecord.datetime.toISOString()} - [${logRecord.levelName}]: ${logRecord.msg}\n${args}`;
    }
  }),
};

if (LOG_FILE) {
  handlers.file = new FileHandler(LOG_LEVEL, {
    filename: LOG_FILE,
    formatter: (logRecord) => JSON.stringify(logRecord),
    mode: 'w',
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
