import { assertEquals, assertNotEquals } from "testing/asserts.ts";
import { Hasher } from "./hasher.ts";

Deno.test("hasher, encode and decode", () => {
  for (const bits of [16, 32, 53, 64, 128]) {
    let runs = 0;
    for (let r = 0; r < 5; r++) {
      const options = Hasher.generate(bits);

      assertEquals(options.bits, bits);
      assertEquals(BigInt(options.prime).toString(2).length, bits);

      const hasher = new Hasher(options);

      let n = 0n;
      const limitN = 2n ** BigInt(options.bits);
      while (n < limitN) {
        {
          const encoded = hasher.encode(n);
          assertEquals(typeof encoded, "bigint");

          const decoded = hasher.decode(encoded);

          assertEquals(decoded, n);
          assertEquals(typeof decoded, "bigint");
        }
        {
          const nAsString = n.toString();
          const encoded = hasher.encode(nAsString);
          assertEquals(typeof encoded, "string");

          const decoded = hasher.decode(encoded);

          assertEquals(decoded, nAsString);
          assertEquals(typeof decoded, "string");
        }

        const rand = Math.pow(2, Math.floor(Math.random() * (bits - 6)));
        n += BigInt(rand);
        runs++;
      }

      // last
      n = limitN - 1n;
      const encoded = hasher.encode(n);

      assertNotEquals(encoded, n);
      assertEquals(hasher.decode(encoded), n);
    }

    assertEquals(runs > 0, true);
  }
});

Deno.test("README.md sample", () => {
  const hasher = new Hasher({
    bits: 53, // Javascript, Number.MAX_SAFE_INTEGER
    prime: "6456111708547433",
    inverse: "3688000043513561",
    xor: "969402349590075",
  });

  const encoded = hasher.encode("100");
  const decoded = hasher.decode(encoded);

  assertEquals(decoded, "100");

  assertEquals(hasher.encode(1), 6085136369434450);
  assertEquals(hasher.encode(2), 4132187376469225);
  assertEquals(hasher.encode(3), 2180123214014976);
  assertEquals(hasher.encode(4), 6982551782798239);
  assertEquals(hasher.encode(5), 5030633649101110);
  assertEquals(hasher.encode(6), 3077950944243277);
  assertEquals(hasher.encode(7), 1125015438342116);
});
