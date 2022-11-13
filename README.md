# inthash

<p>
  <a href="https://github.com/wan2land/inthash/actions?query=workflow%3A%22Deno%20Test%22"><img alt="Build" src="https://img.shields.io/github/workflow/status/wan2land/inthash/Deno%20Test?logo=github&style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/inthash?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/inthash.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/inthash"><img alt="Version" src="https://img.shields.io/npm/v/inthash.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/inthash"><img alt="License" src="https://img.shields.io/npm/l/inthash.svg?style=flat-square" /></a>
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
</p>

Integer Hashing Library based on Knuth's multiplicative hashing method for
Javascript(& Typescript).

## Installation

### Node.js

```bash
npm install inthash
```

```ts
import { Hasher } from "inthash";

//
```

### Deno

```ts
import { Hasher } from "https://deno.land/x/inthash/mod.ts";

//
```

## Usage

3 values are required before using inthash.

1. `prime` - Prime number
2. `inverse` - Modular inverse
3. `xor` - Random n-bit int

Generate the above 3 values with the following command:

```bash
# Using node:
npx inthash

# Using deno:
deno run https://deno.land/x/inthash/cli.ts
```

**output:**

```
{
  "bits": 53,
  "prime": "6456111708547433",
  "inverse": "3688000043513561",
  "xor": "969402349590075"
}
```

Copy the output code and paste it into your project.

```ts
const hasher = new Hasher({
  bits: 53, // Javascript, Number.MAX_SAFE_INTEGER
  prime: "6456111708547433",
  inverse: "3688000043513561",
  xor: "969402349590075",
});
```

There are only two methods. `encode` and `decode`.

```ts
const encoded = hasher.encode(100); // 6432533451586367
const decoded = hasher.decode(encoded); // 100
```

`string` and `bigint` values are also available.

```ts
// string in-out
const encoded = hasher.encode("100"); // "6432533451586367"
const decoded = hasher.decode(encoded); // "100"
```

```ts
// bigint in-out
const encoded = hasher.encode(100n); // 6432533451586367n
const decoded = hasher.decode(encoded); // 100n
```

### How can I use MySQL `bigint(20)`?

To handle `bigint(20)` in mysql, you have to deal with 64bit. Old version
`inthash` library only supported up to
53bit(`Number.MAX_SAFE_INTEGER === 2**53 - 1`) From v3 or later, n-bit is
supported. :-)

```bash
# Using node:
npx inthash -b64

# Using deno:
deno run https://deno.land/x/inthash/cli.ts -b64
```

**output:**

```
{
  "bits": 64,
  "prime": "16131139598801670337",
  "inverse": "14287487925114175297",
  "xor": "8502035541264656686"
}
```

## Refs.

- https://github.com/jenssegers/optimus
