import { build, emptyDir } from "@deno/dnt";
import { bgGreen } from "@std/fmt/colors";
import denoJson from "../deno.json" with { type: "json" };

const version = denoJson.version;

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
  compilerOptions: {
    lib: ["ES2021", "DOM"],
  },
  package: {
    name: "inthash",
    version,
    description:
      "Efficient integer hashing library using Knuth's multiplicative method for Javascript and Typescript, perfect for obfuscating sequential numbers.",
    keywords: [
      "id obfuscation",
      "obfuscate",
      "obfuscation",
      "knuth",
      "uuid",
      "hash",
      "auto-increment",
      "optimus",
      "bigint",
      "typescript",
    ],
    author: "Changwan Jun <wan2land@gmail.com>",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/denostack/inthash.git",
    },
    bugs: {
      url: "https://github.com/denostack/inthash/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", ".npm/LICENSE");
    Deno.copyFileSync("README.md", ".npm/README.md");
  },
});
