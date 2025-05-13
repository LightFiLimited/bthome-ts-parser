import { parsePacket } from "./bytes";
import { BTHomePacket, BTHomeVersion } from "./util";

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
    const reversetBits = initialBits
      .split(" ")
      .map((binary) => binary.split("").reverse().join(""))
      .join(" ");

    if (reversetBits.charAt(0) === "1") {
      hasEncryption = true;
    }

    const btHomeBits = reversetBits.slice(5, 8);

    if (btHomeBits === "010") bthomeVersion = BTHomeVersion.v2;
    else bthomeVersion = BTHomeVersion.v1;
  }

  const btHomePacket: BTHomePacket = {
    version: bthomeVersion,
    data:
      bthomeVersion === BTHomeVersion.v2
        ? parsePacket(initialBits, receivedBytes, hasEncryption)
        : [],
  };
  return btHomePacket;
}
