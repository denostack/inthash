# inthash

[![Build](https://travis-ci.org/corgidisco/inthash.svg?branch=master)](https://travis-ci.org/corgidisco/inthash)
[![Downloads](https://img.shields.io/npm/dt/inthash.svg)](https://npmcharts.com/compare/inthash?minimal=true)
[![Version](https://img.shields.io/npm/v/inthash.svg)](https://www.npmjs.com/package/inthash)
[![License](https://img.shields.io/npm/l/inthash.svg)](https://www.npmjs.com/package/inthash)

[![NPM](https://nodei.co/npm/inthash.png)](https://www.npmjs.com/package/inthash)

Id obfuscation based on Knuth's multiplicative hashing method for Javascript(& Typescript).

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
$ node_modules/.bin/inthashgen

Prime   : 1288792847
Inverse : 327558127
Xor     : 74691595

$ inthashgen | pbcopy

then paste to your code! :-) good luck.

require("inthash").create(1288792847, 327558127, 74691595)
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
