import { path, readLines } from "../deps.ts";
import { handlers } from "./handler.ts";
import * as Renovate from "./renovate.ts";

type AnalyzeResult = Record<string, Array<Record<string, unknown>>>;

type AnalyzerConfig = {
  enableImportantLog: boolean;
  importantLogLevel: Array<Renovate.LogLevel>;
  analyzeResultDirPath: string;
  fileName: string | undefined;
};

export const defaultAnalyzerConfig: AnalyzerConfig = {
  enableImportantLog: true,
  importantLogLevel: ["INFO", "WARN", "ERROR", "FATAL"],
  analyzeResultDirPath: "./dist",
  fileName: undefined,
};

export class Analyzer {
  public readonly analyzeResult: AnalyzeResult = {};
  public config: AnalyzerConfig;
  constructor(
    config?: Partial<AnalyzerConfig>,
  ) {
    if (config !== undefined) {
      this.config = { ...defaultAnalyzerConfig, ...config };
    } else {
      this.config = defaultAnalyzerConfig;
    }
  }

  private async open(
    fileName = this.config.fileName,
  ) {
    if (fileName === undefined) {
      throw new Error("file name is undefined.");
    }

    return await Deno.open(fileName);
  }

  public async write(filePath = this.config.fileName) {
    if (filePath === undefined) {
      throw new Error("file name is undefined.");
    }

    try {
      await Deno.stat(this.config.analyzeResultDirPath);
    } catch (_e) {
      await Deno.mkdir(this.config.analyzeResultDirPath, { recursive: true });
    }

    const fileName = path.parse(filePath).name;

    await Deno.writeTextFile(
      path.join(this.config.analyzeResultDirPath, `${fileName}.json`),
      JSON.stringify(this.analyzeResult, null, 2),
    );
  }

  public out() {
    console.info(JSON.stringify(this.analyzeResult, null, 2));
  }

  private isImportantLogLevel(level: number) {
    const readableLogLevel = Renovate.getReadableLogLevel(level);

    return this.config.importantLogLevel.includes(readableLogLevel);
  }

  private analyzeOnceJson(j: string) {
    const parsed: Renovate.JsonLog = JSON.parse(j);

    for (const key in handlers) {
      const specificLog = handlers[key](parsed);
      if (specificLog !== undefined) {
        if (!Object.hasOwn(this.analyzeResult, key)) {
          this.analyzeResult[key] = [];
        }
        this.analyzeResult[key].push(specificLog);
      }
    }

    if (
      this.config.enableImportantLog && this.isImportantLogLevel(parsed.level)
    ) {
      const { msg, level } = { ...parsed };
      const readableLogLevel = Renovate.getReadableLogLevel(level);
      switch (readableLogLevel) {
        case "DEBUG":
        case "TRACE":
          console.debug(`Renovate Message: [${readableLogLevel}] ${msg}`);
          break;
        case "INFO":
          console.info(`Renovate Message: [${readableLogLevel}] ${msg}`);
          break;
        case "WARN":
          console.warn(`Renovate Message: [${readableLogLevel}] ${msg}`);
          break;
        case "ERROR":
        case "FATAL":
          console.error(`Renovate Message: [${readableLogLevel}] ${msg}`);
          break;
        default:
          console.log(
            `Unknown Renovate log level message:  [${readableLogLevel}] ${msg}`,
          );
      }
    }
  }

  public async analyze(jsonString?: string) {
    if (jsonString !== undefined) {
      this.analyzeOnceJson(jsonString);
    } else {
      const file = await this.open();

      try {
        for await (const l of readLines(file)) {
          this.analyzeOnceJson(l);
        }
      } catch (e) {
        throw e;
      } finally {
        Deno.close(file.rid);
      }
    }
  }
}
