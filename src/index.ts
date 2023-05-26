import { parsePacket } from "./bytes";
import { BTHomePacket } from "./util";

// const testByte = [1, 100, 2, 193, 7, 3, 254, 14, 18, 221, 1];
const testByte = [1, 100, 2, 52, 7, 46, 63, 18, 112, 5];
const energyByte = [66, 247, 216, 51, 77, 10, 255, 1, 90, 10, 169, 247, 24];
const macTestByte = [
  66, 128, 132, 112, 11, 218, 215, 1, 100, 2, 53, 8, 46, 63, 18, 250, 7,
];

function toFixed8Bits(n: number, length: number) {
  var len = length - ("" + n).length;
  return (len > 0 ? new Array(++len).join("0") : "") + n;
}

export function getByteProperties(
  receivedBytes: number[],
  encryptionKey?: string
) {
  const initialBits = toFixed8Bits(
    Number((receivedBytes[0] >>> 0).toString(2)),
    8
  );

  let hasEncryption = false;
  let bthomeVersion = "";
  if (initialBits) {
    if ([...initialBits].reverse().join("").charAt(0) === "1") {
      hasEncryption = true;
    }
    const btHomeBits = initialBits.slice(5, 7);
    if (btHomeBits === "010") bthomeVersion = "v2";
    else bthomeVersion = "v1";
  }

  const btHomePacket: BTHomePacket = {
    version: bthomeVersion,
    encryption: encryptionKey ? true : false,
    data: parsePacket(initialBits, bthomeVersion, receivedBytes, hasEncryption),
  };
  return btHomePacket;
}
