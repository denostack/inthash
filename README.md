# inthash

<p>
  <a href="https://github.com/wan2land/inthash/actions?query=workflow%3A%22Node.js+CI%22"><img alt="Build" src="https://img.shields.io/github/workflow/status/wan2land/inthash/Node.js%20CI?logo=github&style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/inthash?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/inthash.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/inthash"><img alt="Version" src="https://img.shields.io/npm/v/inthash.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/inthash"><img alt="License" src="https://img.shields.io/npm/l/inthash.svg?style=flat-square" /></a>
  <br />
  <a href="https://david-dm.org/wan2land/inthash"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/inthash.svg?style=flat-square" /></a>
  <a href="https://david-dm.org/wan2land/inthash?type=dev"><img alt="devDependencies Status" src="https://img.shields.io/david/dev/wan2land/inthash.svg?style=flat-square" /></a>
</p>

Integer Hashing Library based on Knuth's multiplicative hashing method for Javascript(& Typescript).

## Installation

```bash
npm install inthash
```

## Usage

3 values are required before using inthash.

1. Prime
2. Inverse
3. Xor (Random Number)

Fortunately, we provide the CLI tool also.

```
$ npx inthash

Prime   : 1288792847
Inverse : 327558127
Xor     : 74691595

$ npx inthash | pbcopy

then paste to your code! :-) good luck.

require('inthash').create(1288792847, 327558127, 74691595)
```

Copy the output code and paste it into your project.

There are only two methods. `encode` and `decode`.

```javascript
const hashing = require("inthash").create(1288792847, 327558127, 74691595)

const encoded = hashing.encode(100) // 96363991
const decoded = hashing.decode(encoded) // 100
```

Done!

## Refs.

- https://github.com/jenssegers/optimus
