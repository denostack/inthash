// deno-lint-ignore-file no-explicit-any

import { Hasher } from "./hasher.ts";

const isDeno = typeof (globalThis as any).Deno !== "undefined";

const cmd = isDeno
  ? "deno run https://deno.land/x/inthash/cli.ts"
  : "npx inthash";

const args = parse(
  isDeno
    ? (globalThis as any).Deno.args
    : (globalThis as any).process.argv.slice(2),
);

const options = Hasher.generate(args.b ?? args.bit ?? args.bits ?? 53);

console.log(JSON.stringify(options, null, "  "));
console.error(`

$ ${cmd} | pbcopy

then paste to your code! :-) good luck.`);

type Args = {
  b?: number;
  bit?: number;
  bits?: number;
};

function parse(args: string[]): Args {
  const argv: Args = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    let match;
    if ((match = arg.match(/^--(b|bit|bits)=(\d+)/))) {
      const [, key, value] = match;
      argv[key as "b" | "bit" | "bits"] = +value;
    } else if ((match = arg.match(/^--(b|bit|bits)$/))) {
      const [, key] = match;
      const next = args[i + 1];
      if (
        next &&
        /\d+/.test(next)
      ) {
        argv[key as "b" | "bit" | "bits"] = +next;
        i++;
      }
    } else if ((match = arg.match(/^-b(\d+)/))) {
      argv.b = +match[1];
    }
  }
  return argv;
}
