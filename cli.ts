// deno-lint-ignore-file no-explicit-any

import { Bijector } from "./bijector.ts";

const isDeno = typeof (globalThis as any).Deno !== "undefined";
const isBun = typeof (globalThis as any).Bun !== "undefined";

const cmd = isDeno ? "deno run jsr:@denostack/bijector/cli" : isBun ? "bunx bijector" : "npx bijector";

const rawArgs = isDeno ? (globalThis as any).Deno.args : (globalThis as any).process.argv.slice(2);
const cmdSuffix = rawArgs.join(" ");
const args = parse(rawArgs);

const bit = args.b ?? args.bit ?? args.bits ?? 53;
const options = Bijector.generate(bit);
const bijector = new Bijector(options);

console.log(JSON.stringify(options, null, "  "));
console.error(`
Usage:

  $ ${cmd}${cmdSuffix ? " " + cmdSuffix : ""}

Example:

  import { Bijector } from "${isDeno ? "jsr:@denostack/bijector" : "bijector"}";

  const bijector = new Bijector(/* paste the JSON above */);

  bijector.encode(1);    // a scrambled integer
  bijector.decode(...);  // back to 1

Supported range: 0 to ${bijector._max.toLocaleString()} (${bit}-bit).`);

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
