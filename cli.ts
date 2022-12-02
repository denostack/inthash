// deno-lint-ignore-file no-explicit-any

import { parse } from "./deps.ts";
import { Hasher } from "./hasher.ts";

const isDeno = typeof (globalThis as any).Deno !== "undefined";

const cmd = isDeno
  ? "deno run https://deno.land/x/inthash/cli.ts"
  : "npx inthash";

const args = parse(
  isDeno ? (globalThis as any).Deno.args : (globalThis as any).process.argv,
);

const options = Hasher.generate(+(args.b ?? args.bit ?? args.bits ?? "53"));

console.log(JSON.stringify(options, null, "  "));
console.error(`

$ ${cmd} | pbcopy

then paste to your code! :-) good luck.`);
