#!/usr/bin/env node
import { generate } from './inthash'

const [prime, inverse, xor] = generate()

process.stderr.write(`
Prime   : ${prime}
Inverse : ${inverse}
Xor     : ${xor}

$ npx inthash | pbcopy

then paste to your code! :-) good luck.

`)
process.stdout.write(`require('inthash').create(${prime}, ${inverse}, ${xor})\n`)
