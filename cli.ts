// deno-lint-ignore-file no-explicit-any

import { Hasher } from "./hasher.ts";

const isDeno = typeof (globalThis as any).Deno !== "undefined";
const isBun = typeof (globalThis as any).Bun !== "undefined";

const cmd = isDeno ? "deno run jsr:@denostack/inthash/cli" : isBun ? "bunx inthash" : "npx inthash";

const rawArgs = isDeno ? (globalThis as any).Deno.args : (globalThis as any).process.argv.slice(2);
const cmdSuffix = rawArgs.join(" ");
const args = parse(rawArgs);

const bit = args.b ?? args.bit ?? args.bits ?? 53;
const options = Hasher.generate(bit);
const hasher = new Hasher(options);

console.log(JSON.stringify(options, null, "  "));
console.error(`
Usage:

  $ ${cmd}${cmdSuffix ? " " + cmdSuffix : ""}

Example:

  import { Hasher } from "${isDeno ? "jsr:@denostack/inthash" : "inthash"}";

  const hasher = new Hasher(/* paste the JSON above */);

  hasher.encode(1);    // a scrambled integer
  hasher.decode(...);  // back to 1

Supported range: 0 to ${hasher._max.toLocaleString()} (${bit}-bit).`);

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
