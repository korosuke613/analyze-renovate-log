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

export type JsonLog =
  | JsonLogBase
  | DependencyExtraction
  | PackageFilesWithUpdates;

type JsonLogBase = {
  [key: string]: unknown;
  msg: string;
  v: number;
  time: string;
  level: number;
};

/*
 *  Dependency Extraction
 */

export type DependencyExtraction = JsonLogBase & {
  baseBranch: string;
  stats: Record<string, unknown>;
  msg: `${string}${typeof DEPENDENCY_EXTRACTION_COMPLETE}${string}`;
};

/*
 *  PackageFiles With Updates
 */

export const PACKAGE_FILES_WITH_UPDATES = "packageFiles with updates";

export type Dep = {
  [key: string]: unknown;
  depName: string;
};

export type PackageUpdate = {
  packageFile: string;
  deps: Array<Dep>;
};

export type ManagerName = string;

export type PackageUpdateConfig = Record<ManagerName, Array<PackageUpdate>>;

export type PackageFilesWithUpdates = JsonLogBase & {
  baseBranch: string;
  config: PackageUpdateConfig;
  msg: `${string}${typeof PACKAGE_FILES_WITH_UPDATES}${string}`;
};
