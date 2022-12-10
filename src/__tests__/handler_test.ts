import { assertEquals } from "../../dev_deps.ts";
import { handleDependencyExtraction } from "../handler.ts";
import {
  dependencyExtractionComplete,
  packageFilesWithUpdates,
} from "./testdata/logJson.js";

Deno.test("positive: handleDependencyExtraction()", () => {
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

Deno.test("negative: handleDependencyExtraction()", () => {
  const actual = handleDependencyExtraction(packageFilesWithUpdates, {
    debugLog: false,
  });
  const expected = undefined;
  assertEquals(actual, expected);
});
