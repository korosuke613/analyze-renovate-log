export type LogLevel =
  | "TRACE"
  | "DEBUG"
  | "INFO"
  | "WARN"
  | "ERROR"
  | "FATAL";

export const LogLevelMap: Record<number, LogLevel> = {
  10: "TRACE",
  20: "DEBUG",
  30: "INFO",
  40: "WARN",
  50: "ERROR",
  60: "FATAL",
} as const;

export const getReadableLogLevel = (level: number): LogLevel => {
  return LogLevelMap[level];
};

export const DEPENDENCY_EXTRACTION_COMPLETE = "Dependency extraction complete";

export const JsonLogMap: Record<string, string> = {
  DEPENDENCY_EXTRACTION_COMPLETE,
} as const;

export type JsonLog = JsonLogBase | DependencyExtraction;

type JsonLogBase = {
  [key: string]: unknown;
  msg: string;
  v: number;
  time: string;
  level: number;
};

export type DependencyExtraction = JsonLogBase & {
  baseBranch: string;
  stats: Record<string, unknown>;
  msg: `${string}${typeof DEPENDENCY_EXTRACTION_COMPLETE}${string}`;
};
