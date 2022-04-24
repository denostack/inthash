import { Hasher } from "./hasher.ts";

const options = Hasher.generate();

const isDeno = typeof Deno !== "undefined";
const cmd = isDeno
  ? "deno run https://deno.land/x/inthash/cli.ts"
  : "npx inthash";

console.log(JSON.stringify(options, null, "  "));
console.error(`

$ ${cmd} | pbcopy

then paste to your code! :-) good luck.

`);
