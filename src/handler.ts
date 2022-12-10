import * as Renovate from "./renovate.ts";

type HandlerConfig = {
  debugLog: boolean;
};

const defaultHandlerConfig: HandlerConfig = {
  debugLog: true,
};

const isDependencyExtraction = (
  arg: Renovate.JsonLog,
): arg is Renovate.DependencyExtraction => {
  return arg.msg.includes(Renovate.DEPENDENCY_EXTRACTION_COMPLETE);
};

export const handleDependencyExtraction = (
  jsonLog: Renovate.JsonLog,
  config = defaultHandlerConfig,
) => {
  if (!isDependencyExtraction(jsonLog)) {
    return undefined;
  }

  if (config.debugLog) {
    console.debug(
      `Specific Log: ${Renovate.DEPENDENCY_EXTRACTION_COMPLETE}`,
    );
  }

  const { baseBranch, stats } = jsonLog;
  return {
    baseBranch,
    stats,
  };
};

export const handlers: {
  [key: string]: (
    jsonLog: Renovate.JsonLog,
  ) => undefined | Record<string, unknown>;
} = {
  [Renovate.DEPENDENCY_EXTRACTION_COMPLETE]: handleDependencyExtraction,
};
