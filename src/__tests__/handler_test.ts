import { assertEquals } from "../../dev_deps.ts";
import {
  handleDependencyExtraction,
  handlePackageFilesWithUpdates,
} from "../handler.ts";
import {
  dependencyExtractionComplete,
  emptyRenovateLog,
  packageFilesWithUpdates,
  prettyPackageFilesWithUpdates,
} from "./testdata/logJson.ts";

Deno.test("handleDependencyExtraction()", async (t) => {
  await t.step("positive", () => {
    const actual = handleDependencyExtraction(dependencyExtractionComplete, {
      debugLog: false,
    });
    const expected = {
      baseBranch: "main",
      stats: {
        managers: {
          asdf: {
            depCount: 3,
            fileCount: 1,
          },
          gomod: {
            depCount: 2,
            fileCount: 1,
          },
          regex: {
            depCount: 1,
            fileCount: 1,
          },
        },
        total: {
          depCount: 6,
          fileCount: 3,
        },
      },
    };
    assertEquals(actual, expected);
  });

  await t.step("negative", () => {
    const actual = handleDependencyExtraction(emptyRenovateLog, {
      debugLog: false,
    });
    const expected = undefined;
    assertEquals(actual, expected);
  });
});

Deno.test("handlePackageFilesWithUpdates()", async (t) => {
  await t.step("positive", () => {
    const actual = handlePackageFilesWithUpdates(packageFilesWithUpdates, {
      debugLog: false,
    });
    const expected: ReturnType<typeof handlePackageFilesWithUpdates> =
      prettyPackageFilesWithUpdates;
    assertEquals(actual, expected);
  });

  await t.step("negative", () => {
    const actual = handlePackageFilesWithUpdates(emptyRenovateLog, {
      debugLog: false,
    });
    const expected = undefined;
    assertEquals(actual, expected);
  });
});
