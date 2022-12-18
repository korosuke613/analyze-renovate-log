import { Command } from "./deps.ts";
import { Analyzer } from "./src/analyzer.ts";

const command = await new Command()
  .name("analyze-renovate-log")
  .description("Analyze Renovate logs.")
  .option("-f, --file <file-path:string>", "Input log json file.")
  .option("-o, --output-file", "Output file.")
  .parse(Deno.args);

const {
  file,
  outputFile,
} = command.options;

try {
  const analyzer = new Analyzer({
    fileName: file,
  });

  await analyzer.analyze();
  analyzer.out();

  if (outputFile) {
    analyzer.write();
  }
} catch (e) {
  console.error("-----------------------");
  console.error(e);
  console.error("-----------------------");
  command.cmd.showHelp();
}
