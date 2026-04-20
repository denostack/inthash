import { randomPrime } from "./prime.ts";

function modInv(a: bigint, b: bigint): bigint {
  let t = 0n;
  let r = b;
  let nextT = 1n;
  let nextR = a;
  while (nextR > 0) {
    const q = ~~(r / nextR);
    const [lastT, lastR] = [t, r];
    [t, r] = [nextT, nextR];
    [nextT, nextR] = [lastT - q * nextT, lastR - q * nextR];
  }
  return t < 0 ? t + b : t;
}

function generateXor(bits: number): bigint {
  let result = 0n;
  for (let i = 0; i < bits; i++) {
    result = (result << 1n) | (Math.random() < 0.5 ? 1n : 0n);
  }
  return result;
}

export interface BijectorOptions {
  bits: number;
  prime: string;
  inverse: string;
  xor: string;
}

export class Bijector {
  static generate(
    bits?: number,
  ): BijectorOptions {
    bits = bits ?? Number.MAX_SAFE_INTEGER.toString(2).length; // default to Number.MAX_SAFE_INTEGER
    if (bits < 2) {
      throw new Error("bits must be greater than 2");
    }
    const modBase = 2n ** BigInt(bits);
    const prime = randomPrime(bits);
    return {
      bits,
      prime: prime.toString(),
      inverse: modInv(prime, modBase).toString(),
      xor: generateXor(bits).toString(),
    };
  }

  _bits: number;
  _prime: bigint;
  _inverse: bigint;
  _xor: bigint;
  _mask: bigint;
  _max: bigint;

  constructor({ bits, prime, inverse, xor }: BijectorOptions) {
    this._bits = bits;
    this._prime = BigInt(prime);
    this._inverse = BigInt(inverse);
    this._xor = BigInt(xor);
    this._mask = 2n ** BigInt(bits) - 1n;
    this._max = (1n << BigInt(bits)) - 1n;
  }

  encode(n: number): number;
  encode(n: bigint): bigint;
  encode(n: string): string;
  encode(n: number | bigint | string): number | bigint | string {
    if (typeof n === "string") {
      return this.encode(BigInt(n)).toString();
    }
    if (typeof n === "number") {
      if (this._bits > 53) {
        throw new TypeError(
          `Bijector with bits=${this._bits} does not support number inputs (only bits <= 53 is safe for JavaScript Number). Use bigint or string instead.`,
        );
      }
      return Number(this.encode(BigInt(n)));
    }
    if (n < 0n || n > this._max) {
      throw new RangeError(
        `input ${n} is out of range [0, ${this._max}] for bits=${this._bits}`,
      );
    }
    return n * this._prime & this._mask ^ this._xor;
  }

  decode(n: number): number;
  decode(n: bigint): bigint;
  decode(n: string): string;
  decode(n: number | bigint | string): number | bigint | string {
    if (typeof n === "string") {
      return this.decode(BigInt(n)).toString();
    }
    if (typeof n === "number") {
      if (this._bits > 53) {
        throw new TypeError(
          `Bijector with bits=${this._bits} does not support number inputs (only bits <= 53 is safe for JavaScript Number). Use bigint or string instead.`,
        );
      }
      return Number(this.decode(BigInt(n)));
    }
    if (n < 0n || n > this._max) {
      throw new RangeError(
        `input ${n} is out of range [0, ${this._max}] for bits=${this._bits}`,
      );
    }
    return (n ^ this._xor) * this._inverse & this._mask;
  }

  forward: Bijector["encode"] = this.encode;
  inverse: Bijector["decode"] = this.decode;
}
