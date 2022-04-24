import { isPrimeMillerRabin } from "./prime.ts";

function isPrime(n: bigint) {
  if (n === 2n) {
    return true;
  }
  for (let i = 3n; i * i <= n; i++) {
    if (n % i === 0n) {
      return false;
    }
  }
  return true;
}

const primes = [
  53912869n,
  6067841561n,
];

Deno.bench("isPrime", { n: 10 }, () => {
  for (const p of primes) {
    isPrime(p);
  }
});

Deno.bench("isPrimeMillerRabin", { n: 10 }, () => {
  for (const p of primes) {
    isPrimeMillerRabin(p);
  }
});
