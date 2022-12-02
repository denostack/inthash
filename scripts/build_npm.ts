import { build, emptyDir } from "dnt/mod.ts";
import { bgGreen } from "fmt/colors.ts";

const cmd = Deno.run({
  cmd: ["git", "describe", "--tags", "--abbrev=0"],
  stdout: "piped",
});
const version = new TextDecoder().decode(await cmd.output()).trim();
cmd.close();

console.log(bgGreen(`version: ${version}`));

await emptyDir("./.npm");

await build({
  entryPoints: [
    "./mod.ts",
    {
      kind: "bin",
      name: "inthash",
      path: "./cli.ts",
    },
  ],
  outDir: "./.npm",
  shims: {
    deno: false,
  },
  test: false,
  package: {
    name: "inthash",
    version,
    description:
      "Integer Hashing Library based on Knuth's multiplicative hashing method for Javascript(& Typescript).",
    keywords: [
      "obfuscate",
      "obfuscation",
      "knuth",
      "uuid",
      "hash",
      "optimus",
      "bigint",
      "typescript",
    ],
    author: "Changwan Jun <wan2land@gmail.com>",
    license: "MIT",
    repository: {
      type: "git",
      url: "git://github.com/denostack/inthash.git",
    },
    bugs: {
      url: "https://github.com/denostack/inthash/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("README.md", ".npm/README.md");
