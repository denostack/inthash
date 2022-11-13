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

Deno.bench({ name: "isPrime", group: "prime" }, () => {
  for (const p of primes) {
    isPrime(p);
  }
});

Deno.bench(
  { name: "isPrimeMillerRabin", group: "prime", baseline: true },
  () => {
    for (const p of primes) {
      isPrimeMillerRabin(p);
    }
  },
);
