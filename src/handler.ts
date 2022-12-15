import * as Renovate from "./renovate.ts";

type HandlerConfig = {
  debugLog: boolean;
};

const defaultHandlerConfig: HandlerConfig = {
  debugLog: true,
};

/*
 *  Dependency Extraction
 */

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

/*
 *  PackageFiles With Updates
 */

export type PrettyPackageFilesWithUpdate = {
  [manager: Renovate.ManagerName]: PackageUpdateWithKey;
};

export type PackageUpdateWithKey = {
  [packageFile: string]: {
    [depName: string]: Renovate.Dep;
  };
};

function isPackageFilesWithUpdates(
  arg: Renovate.JsonLog,
): arg is Renovate.PackageFilesWithUpdates {
  return arg.msg.includes(Renovate.PACKAGE_FILES_WITH_UPDATES);
}

export const handlePackageFilesWithUpdates = (
  jsonLog: Renovate.JsonLog,
  config = defaultHandlerConfig,
) => {
  if (!isPackageFilesWithUpdates(jsonLog)) {
    return undefined;
  }

  if (config.debugLog) {
    console.debug(
      `Specific Log: ${Renovate.PACKAGE_FILES_WITH_UPDATES}`,
    );
  }

  const { baseBranch, config: packageConfig } = jsonLog;
  const prettyPackageFilesWithUpdate: PrettyPackageFilesWithUpdate = {};

  for (const managerName in packageConfig) {
    if (config.debugLog) {
      console.debug(`Manager: ${managerName}`);
    }

    const tmpPackageUpdateWithKey: PackageUpdateWithKey = {};
    packageConfig[managerName].forEach(
      (packageUpdate) => {
        if (config.debugLog) {
          console.debug(`PackageFile: ${packageUpdate.packageFile}`);
        }

        if (
          !Object.hasOwn(tmpPackageUpdateWithKey, packageUpdate.packageFile)
        ) {
          tmpPackageUpdateWithKey[packageUpdate.packageFile] = {};
        }

        packageUpdate.deps.forEach((dep) => {
          if (config.debugLog) {
            console.debug(`Dep: ${dep.depName}`);
          }
          tmpPackageUpdateWithKey[packageUpdate.packageFile][dep.depName] = dep;
        });
      },
    );
    prettyPackageFilesWithUpdate[managerName] = tmpPackageUpdateWithKey;
  }

  return {
    baseBranch,
    updates: prettyPackageFilesWithUpdate,
  };
};

/*
 *  export handlers
 */

export const handlers: {
  [key: string]: (
    jsonLog: Renovate.JsonLog,
  ) => undefined | Record<string, unknown>;
} = {
  [Renovate.DEPENDENCY_EXTRACTION_COMPLETE]: handleDependencyExtraction,
  [Renovate.PACKAGE_FILES_WITH_UPDATES]: handlePackageFilesWithUpdates,
};
