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

1. Prime
2. Inverse
3. Xor (Random Number)

Fortunately, we provide the CLI tool also.

```bash
npx inthash
# deno run https://deno.land/x/inthash/cli.ts
```

```
{
  "bits": 53,
  "prime": "6456111708547433",
  "inverse": "3688000043513561",
  "xor": "969402349590075"
}
```

Copy the output code and paste it into your project.

There are only two methods. `encode` and `decode`.

```ts
const hasher = new Hasher({
  bits: 53, // Javascript, Number.MAX_SAFE_INTEGER
  prime: "6456111708547433",
  inverse: "3688000043513561",
  xor: "969402349590075",
});

const encoded = hasher.encode(100); // 6432533451586367
const decoded = hasher.decode(encoded); // 100
```

Done!

Of course, you can use other types of values as well.

```ts
// string
const encoded = hasher.encode("100"); // "6432533451586367"
const decoded = hasher.decode(encoded); // "100"
```

```ts
// bigint
const encoded = hasher.encode(100n); // 6432533451586367n
const decoded = hasher.decode(encoded); // 100n
```

### with MySQL `bigint(20)`

To handle `bigint(20)` in mysql, you have to deal with 64bit. In the past
`inthash` library only supported up to 53bit(`Number.MAX_SAFE_INTEGER(2^53-1)`),
the maximum value of JavaScript integer type. From v3.0.0 onwards, 64-bit is
also available. :-)

```bash
npx inthash -b64
# deno run https://deno.land/x/inthash/cli.ts -b64
```

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
