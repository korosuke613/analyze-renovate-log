// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.32.0/mod.ts";
import { path } from "./deps.ts";

const outDir = "./dist/npm"

await emptyDir(outDir);

await build({
  entryPoints: ["./mod.ts", {
    kind: "bin",
    name: "analyze-renovate-log", 
    path: "./mod.ts",
  }],
  outDir: outDir,
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  scriptModule: false,
  package: {
    // package.json properties
    name: "analyze-renovate-log",
    version: Deno.args[0],
    description: "Your package.",
    license: "Apache-2.0",
    repository: {
      type: "git",
      url: "git+https://github.com/korosuke613/analyze-renovate-log.git",
    },
    bugs: {
      url: "https://github.com/korosuke613/analyze-renovate-log/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", path.join(outDir, "LICENSE"));
Deno.copyFileSync("README.md", path.join(outDir, "README.md"));
