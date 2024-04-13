// deno-lint-ignore-file no-explicit-any

import { Hasher } from "./hasher.ts";

const isDeno = typeof (globalThis as any).Deno !== "undefined";

const cmd = isDeno ? "deno run jsr:@denostack/inthash/cli" : "npx inthash";

const rawArgs = isDeno
  ? (globalThis as any).Deno.args
  : (globalThis as any).process.argv.slice(2);
const cmdSuffix = rawArgs.join(" ");
const args = parse(rawArgs);

const bit = args.b ?? args.bit ?? args.bits ?? 53;
const options = Hasher.generate(bit);
const hasher = new Hasher(options);

console.log(JSON.stringify(options, null, "  "));
console.error(`
$ ${cmd}${cmdSuffix ? " " + cmdSuffix : ""} | pbcopy

Now go ahead and paste it into your code! Good luck. :-)

Note: The supported range of integers is from min: 0 to max: ${hasher._max}.
Please make sure your inputs fall within this range.`);

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
