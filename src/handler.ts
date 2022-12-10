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
  parsed: Renovate.JsonLog,
  config = defaultHandlerConfig,
) => {
  if (!isDependencyExtraction(parsed)) {
    return undefined;
  }

  if (config.debugLog) {
    console.debug(
      `Specific Log: ${Renovate.DEPENDENCY_EXTRACTION_COMPLETE}`,
    );
  }

  const { baseBranch, stats } = parsed;
  return {
    baseBranch,
    stats,
  };
};
