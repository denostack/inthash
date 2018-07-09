
import * as big from "big-integer"

// export function generate(): any {

// }

const MAX_INT32 = 2147483647

export const create = (prime: number, inverse: number, xor: number, max: number = MAX_INT32) => {
  return {
    encode(int: number): number {
      return big(int).multiply(prime).and(max).valueOf() ^ xor // tslint:disable-line:no-bitwise
    },
    decode(int: number): number {
      return big(int ^ xor).multiply(inverse).and(max).valueOf() // tslint:disable-line:no-bitwise
    },
  }
}
