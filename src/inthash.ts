
const MAX_INT = Number.MAX_SAFE_INTEGER
const MAX_INT_N = BigInt(MAX_INT)

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

function modInv(a: bigint, b: bigint): bigint {
  let t = 0n
  let r = b
  let nextT = 1n
  let nextR = a
  while (nextR > 0) {
    const q = ~~(r / nextR)
    const [lastT, lastR] = [t, r]
    ;[t, r] = [nextT, nextR]
    ;[nextT, nextR] = [lastT - q * nextT, lastR - q * nextR]
  }
  return t < 0 ? t + b : t
}

export interface Hasher {
  encode(int: number): number
  decode(int: number): number
}

export function generate(): [number, number, number] {
  const prime = randomRangePrime(10000000, MAX_INT)
  const inverse = modInv(BigInt(prime), MAX_INT_N + 1n)
  return [
    prime,
    Number(inverse),
    random(10000000, MAX_INT),
  ]
}

export const create = (prime: number, inverse: number, xor: number): Hasher => {
  const nPrime = BigInt(prime)
  const nInverse = BigInt(inverse)
  const nXor = BigInt(xor)
  return {
    encode(int: number): number {
      return Number(BigInt(int) * nPrime & MAX_INT_N ^ nXor)
    },
    decode(int: number): number {
      return Number((BigInt(int) ^ nXor) * nInverse & MAX_INT_N)
    },
  }
}
