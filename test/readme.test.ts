
import * as hashid from "../dist"

require("jest") // tslint:disable-line

describe("inthash", () => {

  it("test encode and decode", async () => {
    const gen = hashid.create(1580030173, 59260789, 1163945558)

    const testcase = []

    for (let i = 0; i < 2147483647;) {
      testcase.push(i)
      const encoded = gen.encode(i)

      expect(encoded).not.toEqual(i)
      expect(gen.decode(encoded)).toEqual(i)

      const rand = Math.pow(2, Math.floor(Math.random() * 30))
      i += Math.floor(Math.random() * rand)
    }
    console.log("test case is : \n" + testcase.join("\n"))
  })
})
