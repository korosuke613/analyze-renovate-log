import { Analyzer } from "./src/analyzer.ts";

export {};

const analyzer = new Analyzer({
  fileName: "./src/__tests__/testdata/renovateJsons.log",
});
await analyzer.analyze();
analyzer.out();
