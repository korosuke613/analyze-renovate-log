import { path } from "../../deps.ts";
import { assert, assertEquals } from "../../dev_deps.ts";
import { Analyzer, defaultAnalyzerConfig } from "../analyzer.ts";
import * as Renovate from "../renovate.ts";

import {
  dependencyExtractionComplete,
  packageFilesWithUpdates,
} from "./testdata/logJson.ts";

const __dirname = new URL(".", import.meta.url).pathname;

Deno.test("positive: Analyzer.analyze() from string", async () => {
  const analyzer = new Analyzer();
  await analyzer.analyze(
    JSON.stringify(dependencyExtractionComplete),
  );
  await analyzer.analyze(
    JSON.stringify(packageFilesWithUpdates),
  );

  assert(
    Object.hasOwn(
      analyzer.analyzeResult,
      Renovate.DEPENDENCY_EXTRACTION_COMPLETE,
    ),
    `analyze result does not have '${Renovate.DEPENDENCY_EXTRACTION_COMPLETE}'`,
  );
});

Deno.test("Analyzer.analyze() by file io", async (t) => {
  const analyzer = new Analyzer(
    { fileName: path.join(__dirname, "testdata/renovate-json.log") },
  );
  await t.step("positive: analyze() from file", async () => {
    await analyzer.analyze();
    assert(
      Object.hasOwn(
        analyzer.analyzeResult,
        Renovate.DEPENDENCY_EXTRACTION_COMPLETE,
      ),
      `analyze result does not have '${Renovate.DEPENDENCY_EXTRACTION_COMPLETE}'`,
    );
    assert(
      Object.hasOwn(
        analyzer.analyzeResult,
        Renovate.PACKAGE_FILES_WITH_UPDATES,
      ),
      `analyze result does not have '${Renovate.PACKAGE_FILES_WITH_UPDATES}'`,
    );
  });

  await t.step("positive: write()", async () => {
    await analyzer.write("test");
    const resultPath = path.join(
      analyzer.config.analyzeResultDirPath,
      "test.json",
    );
    await Deno.stat(resultPath);
  });
});

Deno.test("Analyzer.config", () => {
  const defaultAnalyzer = new Analyzer();

  const overrideAnalyzer = new Analyzer({
    enableImportantLog: false,
  });

  assertEquals(defaultAnalyzer.config.enableImportantLog, true);
  assertEquals(overrideAnalyzer.config.enableImportantLog, false);
  assertEquals(
    overrideAnalyzer.config.analyzeResultDirPath,
    defaultAnalyzerConfig.analyzeResultDirPath,
  );
});
