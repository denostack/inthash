# inthash

<a href="https://github.com/denostack"><img src="https://raw.githubusercontent.com/denostack/images/main/logo.svg" width="240" /></a>

<p>
  <a href="https://github.com/wan2land/inthash/actions"><img alt="Build" src="https://img.shields.io/github/workflow/status/wan2land/inthash/CI?logo=github&style=flat-square" /></a>
  <a href="https://codecov.io/gh/denostack/inthash"><img alt="Coverage" src="https://img.shields.io/codecov/c/gh/denostack/inthash?style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/inthash?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/inthash.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/inthash"><img alt="Version" src="https://img.shields.io/npm/v/inthash.svg?style=flat-square" /></a>
  <a href="https://deno.land/x/inthash"><img alt="deno.land/x/inthash" src="https://img.shields.io/github/v/release/denostack/inthash?display_name=tag&label=deno.land/x/inthash@&style=flat-square&logo=deno&labelColor=000&color=777" /></a>
  <a href="https://www.npmjs.com/package/inthash"><img alt="License" src="https://img.shields.io/npm/l/inthash.svg?style=flat-square" /></a>
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
</p>

Integer Hashing Library based on Knuth's multiplicative hashing method for
Javascript(& Typescript).

## Installation

**Node.js**

```bash
npm install inthash
```

**Deno**

```ts
import { Hasher } from "https://deno.land/x/inthash/mod.ts";
```

## Usage

Generate random settings with the following command:

```bash
# Node.js:
npx inthash

# Deno:
deno run https://deno.land/x/inthash/cli.ts

# Output:
# {
#   "bits": 53,
#   "prime": "6456111708547433",
#   "inverse": "3688000043513561",
#   "xor": "969402349590075"
# }
```

And create hasher like this:

```ts
const hasher = new Hasher({
  bits: 53, // Javascript, Number.MAX_SAFE_INTEGER
  prime: "6456111708547433", // Random Prime
  inverse: "3688000043513561", // Modular Inverse
  xor: "969402349590075", // Random n-bit xor mask
});

const encoded = hasher.encode(100); // result: 6432533451586367
const decoded = hasher.decode(encoded); // result: 100

// You can obfuscate predictable numbers like 'Auto Increment'!
hasher.encode(1); // 6085136369434450
hasher.encode(2); // 4132187376469225
hasher.encode(3); // 2180123214014976
hasher.encode(4); // 6982551782798239
hasher.encode(5); // 5030633649101110
hasher.encode(6); // 3077950944243277
hasher.encode(7); // 1125015438342116
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
# Node.js:
npx inthash -b64

# Deno:
deno run https://deno.land/x/inthash/cli.ts -b64

# Output:
# {
#   "bits": 64,
#   "prime": "16131139598801670337",
#   "inverse": "14287487925114175297",
#   "xor": "8502035541264656686"
# }
```

## Refs.

- https://github.com/jenssegers/optimus
