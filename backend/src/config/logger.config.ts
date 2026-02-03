import { env } from "./env.config";

type LogLevel = "info" | "warn" | "error" | "debug";

const isPreProd = env.NODE_ENV === "staging";

const log = (level: LogLevel, message: string, meta?: unknown) => {
  const timestamp = new Date().toISOString();

  if (meta) {
    console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, meta);
  } else {
    console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  }
};

export const logger = {
  info: (message: string, meta?: unknown) => {
    log("info", message, meta);
  },

  warn: (message: string, meta?: unknown) => {
    log("warn", message, meta);
  },

  error: (message: string, meta?: unknown) => {
    log("error", message, meta);
  },

  debug: (message: string, meta?: unknown) => {
    if (!isPreProd){
      log("debug", message, meta);
    }
  },
};