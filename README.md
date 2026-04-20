# bijector <a href="https://github.com/denostack"><img src="https://raw.githubusercontent.com/denostack/images/main/logo.svg" width="160" align="right" /></a>

<p>
  <a href="https://github.com/denostack/bijector/actions"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/denostack/bijector/ci.yml?branch=main&logo=github&style=flat-square" /></a>
  <a href="https://codecov.io/gh/denostack/bijector"><img alt="Coverage" src="https://img.shields.io/codecov/c/gh/denostack/bijector?style=flat-square" /></a>
  <img alt="License" src="https://img.shields.io/npm/l/bijector.svg?style=flat-square" />
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <br />
  <a href="https://jsr.io/@denostack/bijector"><img alt="JSR version" src="https://jsr.io/badges/@denostack/bijector?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/bijector"><img alt="NPM Version" src="https://img.shields.io/npm/v/bijector.svg?style=flat-square&logo=npm" /></a>
  <a href="https://npmcharts.com/compare/bijector?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/bijector.svg?style=flat-square" /></a>
</p>

> Renamed from [`inthash`](https://www.npmjs.com/package/inthash) in v4. The algorithm and parameter format are
> unchanged. See [Migration from `inthash`](#migration-from-inthash).

**bijector** is a reversible integer bijection for Javascript and Typescript. It maps an integer space onto itself with
a one-to-one correspondence, so every input has exactly one output and vice versa. Under the hood it uses Knuth's
multiplicative method over a modular ring (`prime`, modular `inverse`, and an `xor` mask), giving you a fast, lossless,
deterministic `encode` / `decode` pair.

Unlike a regular hash (one-way) or a random generator, `bijector` is **mathematically invertible** — the inverse is
guaranteed to exist because the transformation is a bijection on `[0, 2^bits)`.

Common applications: auto-increment ID obfuscation, URL shorteners, license keys, coupon codes, A/B bucketing. See
[Use cases](#use-cases) for concrete examples.

## Installation

**Node.js**

```bash
npm install bijector
```

**Deno**

```ts
import { Bijector } from "@denostack/bijector";
```

## Usage

### Generating parameters

Run the CLI to generate random parameters for your bijector:

```bash
# Node.js:
npx bijector

# Deno:
deno run jsr:@denostack/bijector/cli

# Bun
bunx bijector

# Output:
# {
#   "bits": 53,
#   "prime": "6456111708547433",
#   "inverse": "3688000043513561",
#   "xor": "969402349590075"
# }
```

### Creating and using a Bijector

```ts
const bijector = new Bijector({
  bits: 53, // Javascript, Number.MAX_SAFE_INTEGER
  prime: "6456111708547433", // Random Prime
  inverse: "3688000043513561", // Modular Inverse
  xor: "969402349590075", // Random n-bit xor mask
});

const encoded = bijector.encode(100); // result: 6432533451586367
const decoded = bijector.decode(encoded); // result: 100
```

![diagram](./diagram.png)

```ts
// You can obfuscate predictable numbers like 'Auto Increment'!
bijector.encode(0); // 969402349590075
bijector.encode(1); // 6085136369434450
bijector.encode(2); // 4132187376469225
bijector.encode(3); // 2180123214014976

bijector.encode(Number.MAX_SAFE_INTEGER - 3); // 2024647471942759
bijector.encode(Number.MAX_SAFE_INTEGER - 2); // 6827076040726014
bijector.encode(Number.MAX_SAFE_INTEGER - 1); // 4875011878271765
bijector.encode(Number.MAX_SAFE_INTEGER); // 2922062885306540
```

`bijector` also supports `string` and `bigint` values:

```ts
// String input and output
const encoded = bijector.encode("100"); // "6432533451586367"
const decoded = bijector.decode(encoded); // "100"
```

```ts
// BigInt input and output
const encoded = bijector.encode(100n); // 6432533451586367n
const decoded = bijector.decode(encoded); // 100n
```

### Math-style aliases: `forward` / `inverse`

In addition to `encode` / `decode`, you can use the mathematical pair `forward` / `inverse`. They are exact aliases of
the same methods — pick whichever reads better in context.

```ts
bijector.forward(100); // same as bijector.encode(100)
bijector.inverse(bijector.forward(100)); // 100
```

- Use `encode` / `decode` for codec-style flows (ID ↔ public code).
- Use `forward` / `inverse` when you are thinking about the underlying bijection as a math operation.

### Bit width

The default `bits: 53` covers JavaScript's safe integer range (`Number.MAX_SAFE_INTEGER === 2**53 - 1`). Arbitrary bit
widths are supported — pass `-b<n>` to the CLI and use `bigint` inputs when the range exceeds 53 bits. See the
[MySQL `bigint(20)` example](#obfuscate-auto-increment-ids) for a 64-bit setup.

```bash
npx bijector -b32   # 32-bit range
npx bijector -b64   # 64-bit range (bigint required)
npx bijector -b128  # 128-bit range (bigint required)
```

## Use cases

### Obfuscate auto-increment IDs

Expose `/users/6432533451586367` instead of `/users/100`. Hides your user base size, prevents ID enumeration, and keeps
the column numeric — no string codes in your database.

```ts
// Serializing: internal id → public id
response.publicId = bijector.encode(user.id); // 6432533451586367

// Routing: public id → internal id
app.get("/users/:id", (req, res) => {
  const userId = bijector.decode(Number(req.params.id));
  return db.users.findById(userId);
});
```

**For MySQL `bigint(20)` (64-bit) columns**, generate 64-bit parameters with `-b64` and use `bigint` inputs to cover the
full range:

```bash
npx bijector -b64
```

```ts
const bijector = new Bijector({
  bits: 64,
  prime: "16131139598801670337",
  inverse: "14287487925114175297",
  xor: "8502035541264656686",
});

bijector.encode(12345n); // bigint in, bigint out — safe beyond Number.MAX_SAFE_INTEGER
```

### License / serial key generation

Turn a sequential license counter into a random-looking key. Customers cannot guess adjacent keys, but your server can
always decode back to the issued sequence number for lookup.

```ts
const encoded = bijector.encode(nextLicenseNumber);
const key = encoded.toString(36).toUpperCase(); // "1KVXZ9ZPQ8M"

// Verify on redemption
const seq = bijector.decode(parseInt(key, 36));
await db.licenses.findBy({ sequence: seq });
```

### URL shorteners

Generate deterministic public short codes from internal row IDs. Because the mapping is a bijection, there are **no
collisions** and you don't need a separate lookup table for reverse mapping.

```ts
// Create: row id → short code
const shortCode = bijector.encode(urlRow.id).toString(36); // "1kvxz9"

// Resolve: short code → row id
const rowId = bijector.decode(parseInt(shortCode, 36));
```

### Coupon / voucher codes

Issue non-guessable codes that decode back to the issuing record. You never need to store the code itself — the issued
sequence number is recoverable from the code, so validation is a single primary-key lookup.

```ts
// Issue (encode campaign + serial into one integer)
const payload = campaignId * 1_000_000 + serial;
const code = bijector.encode(payload).toString(36).toUpperCase();

// Redeem
const decoded = bijector.decode(parseInt(userInput, 36));
const campaign = Math.floor(decoded / 1_000_000);
const issuedSerial = decoded % 1_000_000;
```

### A/B bucketing & deterministic shuffles

A bijection over an integer range is exactly a permutation of that range. That makes `bijector` useful for stable,
reversible assignment — A/B experiment buckets, load-balancing hash rings, or deterministic shuffles without storing a
mapping table.

```ts
// Stable bucket assignment. Same user always lands in the same bucket,
// distribution looks uniform, and you can recover the user from the bucket key.
const bucket = Number(bijector.encode(BigInt(userId)) % 100n);
```

### Lightweight format-preserving transformation

When you need a reversible integer-in, integer-out transformation but **not** cryptographic security — for example,
anonymizing order numbers in logs or exports while keeping the column type intact. For real security (regulated data,
adversarial threat model), use AES-GCM or format-preserving encryption (FF1/FF3) instead.

> ⚠️ `bijector` is **obfuscation, not encryption**. Given enough (input, output) pairs an attacker can recover the
> parameters. Do not use it as a security primitive.

## FAQ

### How is this different from `hashids` / `sqids`?

`hashids` and `sqids` encode one or more integers into a **string** of an alphabet. `bijector` stays in the integer
domain — input and output are both integers (or their string/bigint representations). That makes it:

- Faster (pure arithmetic, no alphabet lookup)
- Smaller in output range (same bit-width as the input)
- A drop-in for numeric columns without string conversion

If you need short alphanumeric codes, use `sqids`. If you need a reversible integer ↔ integer mapping, use `bijector`.

### How is this different from a regular hash (MurmurHash / FNV / SHA)?

Those are **one-way** hash functions: many inputs can collide to the same output, and you cannot recover the input.
`bijector` is a **bijection**: every output decodes back to exactly one input.

### Is it cryptographically secure?

No. It is deterministic obfuscation designed to hide sequential IDs from casual observers. Do not rely on it against a
motivated attacker — use a proper authenticated encryption scheme (AES-GCM, ChaCha20-Poly1305) or format-preserving
encryption (FF1/FF3) when you need real security.

### Can I use it for anything other than ID obfuscation?

Yes. Any problem that needs a reversible, deterministic permutation over an integer range fits — license keys, URL
shortener codes, coupon codes, deterministic shuffles, A/B bucketing.

## Migration from `inthash`

`bijector` is a direct rename of [`inthash`](https://www.npmjs.com/package/inthash) (v3 and below). The core algorithm,
parameter format, and encoded outputs are **100% compatible** — any `prime` / `inverse` / `xor` / `bits` quadruple
generated by `inthash` will produce identical results under `bijector`. You only need to rename the imports and the
class.

| Before (`inthash` v3)              | After (`bijector` v4)                             |
| ---------------------------------- | ------------------------------------------------- |
| `npm install inthash`              | `npm install bijector`                            |
| `import { Hasher } from "inthash"` | `import { Bijector } from "bijector"`             |
| `new Hasher(options)`              | `new Bijector(options)`                           |
| `HasherOptions`                    | `BijectorOptions`                                 |
| `Hasher.generate()`                | `Bijector.generate()`                             |
| `hasher.encode(n)` / `.decode(n)`  | `bijector.encode(n)` / `.decode(n)` _(unchanged)_ |
| `npx inthash`                      | `npx bijector`                                    |

The `inthash` package on npm has been deprecated and will continue to install with a notice directing you here.

## See also

- [optimus](https://github.com/jenssegers/optimus) — PHP implementation of Knuth's multiplicative hashing method.
  `bijector` is inspired by and ported from this library.
- [hashids](https://hashids.org/) / [sqids](https://sqids.org/) — string-based alternatives when you need an
  alphabet-encoded short code.
