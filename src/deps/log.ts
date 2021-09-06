export * from "https://deno.land/std@0.106.0/log/mod.ts";
import { handlers } from "https://deno.land/std@0.106.0/log/mod.ts";

export const ConsoleHandler = handlers.ConsoleHandler;
export const FileHandler = handlers.FileHandler;
export const BaseHandler = handlers.BaseHandler;
