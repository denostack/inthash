
import * as hashid from "../lib"

require("jest") // tslint:disable-line

describe("inthash", () => {

  it("test encode and decode", () => {
    let countOfRun = 0

    for (let r = 0; r < 100; r++) {
      const [prime, inverse, xor] = hashid.generate()
      const gen = hashid.create(prime, inverse, xor)
      for (let i = 0; i < 2147483647;) {
        const encoded = gen.encode(i)

        expect(encoded).not.toEqual(i)
        expect(gen.decode(encoded)).toEqual(i)

        const rand = Math.pow(2, Math.floor(Math.random() * 30))
        i += Math.floor(Math.random() * rand)
        countOfRun++
      }
    }

    expect(countOfRun).toBeGreaterThan(0)
  })
})
