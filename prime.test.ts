import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { isPrimeMillerRabin, randomPrime } from "./prime.ts";

function isPrimeTrialDivision(n: bigint): boolean {
  if (n < 2n) return false;
  if (n < 4n) return true;
  if (n % 2n === 0n || n % 3n === 0n) return false;
  for (let i = 5n; i * i <= n; i += 6n) {
    if (n % i === 0n || n % (i + 2n) === 0n) return false;
  }
  return true;
}

describe("isPrimeMillerRabin", () => {
  it("known small primes", () => {
    const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n];
    for (const p of primes) {
      assertEquals(isPrimeMillerRabin(p), true, `${p} should be prime`);
    }
  });

  it("known small composites", () => {
    const composites = [0n, 1n, 4n, 6n, 8n, 9n, 10n, 12n, 15n, 21n, 25n, 100n];
    for (const c of composites) {
      assertEquals(isPrimeMillerRabin(c), false, `${c} should not be prime`);
    }
  });

  it("cross-verify with trial division (0 to 10000)", () => {
    for (let n = 0n; n <= 10000n; n++) {
      assertEquals(
        isPrimeMillerRabin(n),
        isPrimeTrialDivision(n),
        `mismatch at ${n}`,
      );
    }
  });

  // Carmichael numbers fool Fermat test but not Miller-Rabin
  it("Carmichael numbers", () => {
    const carmichaels = [561n, 1105n, 1729n, 2465n, 2821n, 6601n, 8911n, 41041n, 62745n, 825265n];
    for (const c of carmichaels) {
      assertEquals(isPrimeMillerRabin(c), false, `Carmichael number ${c} should not be prime`);
    }
  });

  // Strong pseudoprimes to specific bases — must be caught by multiple iterations
  it("strong pseudoprimes to base 2", () => {
    for (const n of [2047n, 3277n, 4033n, 4681n, 8321n]) {
      assertEquals(isPrimeMillerRabin(n), false, `SPSP(2) ${n} should not be prime`);
    }
  });

  it("strong pseudoprimes to base 3", () => {
    for (const n of [121n, 703n, 1891n, 3281n, 8401n]) {
      assertEquals(isPrimeMillerRabin(n), false, `SPSP(3) ${n} should not be prime`);
    }
  });

  it("Mersenne primes", () => {
    assertEquals(isPrimeMillerRabin(2305843009213693951n), true); // 2^61 - 1
    assertEquals(isPrimeMillerRabin(618970019642690137449562111n), true); // 2^89 - 1
    assertEquals(isPrimeMillerRabin(162259276829213363391578010288127n), true); // 2^107 - 1
    assertEquals(isPrimeMillerRabin(170141183460469231731687303715884105727n), true); // 2^127 - 1
  });

  it("other known large primes", () => {
    assertEquals(isPrimeMillerRabin(18446744073709551557n), true); // largest 64-bit prime
    assertEquals(isPrimeMillerRabin(10000000000000000051n), true); // 10^19 + 51
  });

  it("semiprimes", () => {
    assertEquals(isPrimeMillerRabin(127n * 131n), false);
    assertEquals(isPrimeMillerRabin(104729n * 104743n), false);
    assertEquals(isPrimeMillerRabin(1000000007n * 1000000009n), false);
    assertEquals(isPrimeMillerRabin(2305843009213693951n * 3n), false);
  });

  it("large even numbers", () => {
    assertEquals(isPrimeMillerRabin(2n ** 128n), false);
    assertEquals(isPrimeMillerRabin(2n ** 64n), false);
    assertEquals(isPrimeMillerRabin(1000000000000000000n), false);
  });
});

describe("randomPrime", () => {
  it("bits < 2 returns 1", () => {
    assertEquals(randomPrime(0), 1n);
    assertEquals(randomPrime(1), 1n);
    assertEquals(randomPrime(-1), 1n);
  });

  it("bits = 2 returns 2 or 3", () => {
    const results = new Set<bigint>();
    for (let i = 0; i < 50; i++) {
      const p = randomPrime(2);
      assertEquals(p.toString(2).length, 2);
      assertEquals(isPrimeMillerRabin(p), true);
      results.add(p);
    }
    for (const p of results) {
      assertEquals(p === 2n || p === 3n, true, `unexpected 2-bit prime: ${p}`);
    }
  });

  it("correct bit length (small)", () => {
    for (const bits of [3, 4, 8, 10, 16]) {
      for (let i = 0; i < 5; i++) {
        const p = randomPrime(bits);
        assertEquals(p.toString(2).length, bits, `prime should be ${bits} bits`);
        assertEquals(isPrimeMillerRabin(p), true);
      }
    }
  });

  it("correct bit length (medium)", () => {
    for (const bits of [32, 48, 64]) {
      const p = randomPrime(bits);
      assertEquals(p.toString(2).length, bits, `prime should be ${bits} bits`);
      assertEquals(isPrimeMillerRabin(p), true);
    }
  });

  // cross-verify with deterministic trial division
  it("cross-verify with trial division (20-bit, 20 runs)", () => {
    for (let i = 0; i < 20; i++) {
      const p = randomPrime(20);
      assertEquals(isPrimeTrialDivision(p), true, `${p} should be prime by trial division`);
    }
  });

  it("result is always odd", () => {
    for (let i = 0; i < 20; i++) {
      const p = randomPrime(16);
      assertEquals(p % 2n, 1n, `${p} should be odd`);
    }
  });

  it("128 bit", () => {
    const p = randomPrime(128);
    assertEquals(p.toString(2).length, 128);
    assertEquals(isPrimeMillerRabin(p), true);
    assertEquals(p % 2n, 1n);
  });

  it("256 bit", () => {
    const p = randomPrime(256);
    assertEquals(p.toString(2).length, 256);
    assertEquals(isPrimeMillerRabin(p), true);
    assertEquals(p % 2n, 1n);
  });

  it("produces different values", () => {
    const results = new Set<bigint>();
    for (let i = 0; i < 10; i++) {
      results.add(randomPrime(32));
    }
    assertEquals(results.size >= 2, true, "should produce at least 2 distinct primes");
  });
});
