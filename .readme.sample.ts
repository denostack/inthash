import { Hasher } from "./hasher.ts";

const hasher = new Hasher({
  bits: 53, // Javascript, Number.MAX_SAFE_INTEGER
  prime: "6456111708547433",
  inverse: "3688000043513561",
  xor: "969402349590075",
});

const encoded = hasher.encode("100"); // "6432533451586367" 외부 API는 요걸로 보여줌
const decoded = hasher.decode(encoded); // "100" 짠! 원래대로 돌아옴.

hasher.encode(1); // 6085136369434450
hasher.encode(2); // 4132187376469225
hasher.encode(3); // 2180123214014976
hasher.encode(4); // 6982551782798239
hasher.encode(5); // 5030633649101110
hasher.encode(6); // 3077950944243277
hasher.encode(7); // 1125015438342116
