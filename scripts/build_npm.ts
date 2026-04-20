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
      name: "bijector",
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
    name: "bijector",
    version,
    description:
      "A reversible integer bijection for Javascript and Typescript. Obfuscate auto-increment IDs, generate license keys, build URL shorteners — powered by Knuth's multiplicative method over a modular ring.",
    keywords: [
      "bijection",
      "bijective",
      "reversible",
      "invertible",
      "codec",
      "id-obfuscation",
      "obfuscate",
      "hashids-alternative",
      "sqids-alternative",
      "optimus",
      "knuth",
      "modular",
      "auto-increment",
      "url-shortener",
      "bigint",
      "typescript",
    ],
    author: "Changwan Jun <wan2land@gmail.com>",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/denostack/bijector.git",
    },
    bugs: {
      url: "https://github.com/denostack/bijector/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", ".npm/LICENSE");
    Deno.copyFileSync("README.md", ".npm/README.md");
  },
});
