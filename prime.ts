function modPow(x: bigint, y: bigint, p: bigint) {
  x = x % p;

  let result = 1n;
  while (y > 0n) {
    if (y & 1n) {
      result = (result * x) % p;
    }

    y = y / 2n;
    x = (x * x) % p;
  }
  return result;
}

function randomBigInt(range: bigint): bigint {
  const n = range.toString(2).length;
  if (n === 1) {
    return 0n;
  }
  if (n < 52) {
    return BigInt(Math.floor(Math.random() * Number(range)));
  }

  return BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)); // TODO
}

// https://github.com/openssl/openssl/blob/4cedf30e995f9789cf6bb103e248d33285a84067/crypto/bn/bn_prime.c#L337
export function isPrimeMillerRabin(w: bigint, iterations?: number): boolean {
  // console.log("isprime", w);
  if (w === 2n) {
    return true;
  }
  if (w < 2n || w % 2n === 0n) {
    return false;
  }

  const w1 = w - 1n;
  const w3 = w - 3n;
  let a = 1;
  let m = w1;
  // (Step 1) Calculate largest integer 'a' such that 2^a divides w-1
  // (Step 2) m = (w-1) / 2^a
  while (m % 2n === 0n) {
    a++;
    m /= 2n;
  }

  // TODO montgomery

  iterations = iterations ?? w.toString(2).length > 2048 ? 128 : 64;

  // (Step 4)
  outer_loop:
  for (let i = 0; i < iterations; i++) {
    // console.log("iter", i);
    // (Step 4.1) obtain a Random string of bits b where 1 < b < w-1 */
    const b = randomBigInt(w3) + 2n;
    // console.log("step 4.1");

    // (Step 4.5) z = b^m mod w
    // in openssl, Montgomery modular multiplication (TODO)
    // console.log("step 4.5", b, m, w);
    let z = modPow(b, m, w);

    /* (Step 4.6) if (z = 1 or z = w-1) */
    if (z === 1n || z === w1) {
      continue outer_loop;
    }
    // console.log("step 4.7", a);
    /* (Step 4.7) for j = 1 to a-1 */
    for (let j = 1; j < a; j++) {
      // (Step 4.7.1 - 4.7.2) x = z, z = x^2 mod w
      z = modPow(z, 2n, w);

      // (Step 4.7.3)
      if (z === w1) {
        continue outer_loop;
      }
      // (Step 4.7.4)
      if (z === 1n) {
        return false;
      }
    }
    return false;
  }
  return true;
}

function randomOdd(bits: number): bigint {
  let result = 1n;
  for (let i = 2; i < bits; i++) {
    result = (result << 1n) | (Math.random() < 0.5 ? 1n : 0n);
  }
  return (result << 1n) | 1n;
}

export function randomPrime(bits: number): bigint {
  // console.log("random", bits);
  if (bits < 2) {
    return 1n;
  }
  let result = randomOdd(bits);
  while (!isPrimeMillerRabin(result)) {
    result += 2n;
    if (result.toString(2).length > bits) {
      result = randomOdd(bits);
    }
  }
  return result;
}
