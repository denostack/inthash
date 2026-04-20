import { assertEquals, assertNotEquals, assertThrows } from "@std/assert";
import { Bijector } from "./bijector.ts";

Deno.test("bijector, encode and decode", () => {
  for (const bits of [16, 32, 53, 64, 128]) {
    let runs = 0;
    for (let r = 0; r < 5; r++) {
      const options = Bijector.generate(bits);

      assertEquals(options.bits, bits);
      assertEquals(BigInt(options.prime).toString(2).length, bits);

      const bijector = new Bijector(options);

      let n = 0n;
      const limitN = 2n ** BigInt(options.bits);
      while (n < limitN) {
        {
          const encoded = bijector.encode(n);
          assertEquals(typeof encoded, "bigint");

          const decoded = bijector.decode(encoded);

          assertEquals(decoded, n);
          assertEquals(typeof decoded, "bigint");
        }
        {
          const nAsString = n.toString();
          const encoded = bijector.encode(nAsString);
          assertEquals(typeof encoded, "string");

          const decoded = bijector.decode(encoded);

          assertEquals(decoded, nAsString);
          assertEquals(typeof decoded, "string");
        }

        const rand = Math.pow(2, Math.floor(Math.random() * (bits - 6)));
        n += BigInt(rand);
        runs++;
      }

      // last
      n = limitN - 1n;
      const encoded = bijector.encode(n);

      assertNotEquals(encoded, n);
      assertEquals(bijector.decode(encoded), n);
    }

    assertEquals(runs > 0, true);
  }
});

Deno.test("README.md sample", () => {
  const bijector = new Bijector({
    bits: 53, // Javascript, Number.MAX_SAFE_INTEGER
    prime: "6456111708547433",
    inverse: "3688000043513561",
    xor: "969402349590075",
  });

  const encoded = bijector.encode("100");
  const decoded = bijector.decode(encoded);

  assertEquals(encoded, "6432533451586367");
  assertEquals(decoded, "100");

  assertEquals(bijector.encode(1), 6085136369434450);
  assertEquals(bijector.encode(2), 4132187376469225);
  assertEquals(bijector.encode(3), 2180123214014976);
  assertEquals(bijector.encode(4), 6982551782798239);
  assertEquals(bijector.encode(5), 5030633649101110);
  assertEquals(bijector.encode(6), 3077950944243277);
  assertEquals(bijector.encode(7), 1125015438342116);
});

Deno.test("forward/inverse aliases", () => {
  const bijector = new Bijector({
    bits: 53,
    prime: "6456111708547433",
    inverse: "3688000043513561",
    xor: "969402349590075",
  });

  assertEquals(bijector.forward(100), bijector.encode(100));
  assertEquals(bijector.inverse(bijector.forward(100)), 100);
  assertEquals(bijector.forward("100"), "6432533451586367");
  assertEquals(bijector.inverse("6432533451586367"), "100");
});

Deno.test("full coverage of 8bit", () => {
  for (let run = 0; run < 100; run++) {
    const bijector = new Bijector(Bijector.generate(8));

    for (let i = 0; i < 256; i++) {
      assertEquals(bijector.decode(bijector.encode(i)), i);
    }
  }
});

Deno.test("number input is allowed for bits <= 53", () => {
  for (const bits of [8, 16, 32, 52, 53]) {
    const bijector = new Bijector(Bijector.generate(bits));
    const encoded = bijector.encode(100);
    assertEquals(typeof encoded, "number");
    assertEquals(bijector.decode(encoded), 100);
  }
});

Deno.test("number input throws for bits > 53", () => {
  for (const bits of [54, 60, 64, 128]) {
    const bijector = new Bijector(Bijector.generate(bits));

    assertThrows(
      () => bijector.encode(100),
      TypeError,
      `bits=${bits}`,
    );
    assertThrows(
      () => bijector.decode(100),
      TypeError,
      `bits=${bits}`,
    );

    // bigint and string inputs still work
    const encodedBig = bijector.encode(100n);
    assertEquals(bijector.decode(encodedBig), 100n);

    const encodedStr = bijector.encode("100");
    assertEquals(bijector.decode(encodedStr), "100");
  }
});

Deno.test("out-of-range input throws RangeError", () => {
  const bijector = new Bijector(Bijector.generate(8)); // max = 255

  // overflow (number)
  assertThrows(() => bijector.encode(256), RangeError, "out of range");
  assertThrows(() => bijector.decode(256), RangeError, "out of range");

  // overflow (bigint)
  assertThrows(() => bijector.encode(256n), RangeError, "out of range");
  assertThrows(() => bijector.decode(256n), RangeError, "out of range");

  // overflow (string)
  assertThrows(() => bijector.encode("256"), RangeError, "out of range");
  assertThrows(() => bijector.decode("256"), RangeError, "out of range");

  // negative (number)
  assertThrows(() => bijector.encode(-1), RangeError, "out of range");
  assertThrows(() => bijector.decode(-1), RangeError, "out of range");

  // negative (bigint)
  assertThrows(() => bijector.encode(-1n), RangeError, "out of range");
  assertThrows(() => bijector.decode(-1n), RangeError, "out of range");

  // negative (string)
  assertThrows(() => bijector.encode("-1"), RangeError, "out of range");
  assertThrows(() => bijector.decode("-1"), RangeError, "out of range");

  // boundary values accepted
  assertEquals(bijector.decode(bijector.encode(0)), 0);
  assertEquals(bijector.decode(bijector.encode(255)), 255);
});
