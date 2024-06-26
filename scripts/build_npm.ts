import { build, emptyDir } from "@deno/dnt";
import { bgGreen } from "@std/fmt/colors";

const denoInfo = JSON.parse(
  Deno.readTextFileSync(new URL("../deno.json", import.meta.url)),
);
const version = denoInfo.version;

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
    lib: ["ES2020", "DOM"],
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
      url: "git://github.com/denostack/inthash.git",
    },
    bugs: {
      url: "https://github.com/denostack/inthash/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("README.md", ".npm/README.md");
