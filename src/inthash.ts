
const big = require('big-integer') // eslint-disable-line

const MAX_INT32 = 2147483647 // Math.pow(2, 31) - 1

function isPrime(x: number): boolean {
  const max = Math.floor(Math.sqrt(x))
  for (let i = 2; i < max; i++) {
    if (x % i === 0) {
      return false
    }
  }
  return true
}

function randomRangePrimePivot(x: number, min: number, max: number): number {
  for (let p = x; p < max; p++) {
    if (isPrime(p)) {
      return p
    }
  }
  return randomRangePrime(min, x)
}

function random(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max + 1))
}

function randomRangePrime(min: number, max: number): number {
  return randomRangePrimePivot(random(min, max), min, max)
}

export interface Hasher {
  encode(int: number): number
  decode(int: number): number
}

export function generate(): [number, number, number] {
  const prime = randomRangePrime(10000000, MAX_INT32)
  const inverse = big(prime).modInv(2147483648).valueOf()
  return [
    prime,
    inverse,
    random(10000000, MAX_INT32),
  ]
}

export const create = (prime: number, inverse: number, xor: number): Hasher => {
  return {
    encode(int: number): number {
      return big(int).multiply(prime).and(MAX_INT32).valueOf() ^ xor
    },
    decode(int: number): number {
      return big(int ^ xor).multiply(inverse).and(MAX_INT32).valueOf()
    },
  }
}
