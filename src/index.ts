import { parsePacket } from "./bytes";
import { BTHomePacket } from "./util";

const BT_Version = "v2";

// const testByte = [1, 100, 2, 193, 7, 3, 254, 14, 18, 221, 1];

// console.log("Packet is", parsePacket(testByte, ""));

export function getByteProperties(
  receivedBytes: number[],
  encryptionKey?: string
) {
  const btHomePacket: BTHomePacket = {
    version: BT_Version,
    encryption: encryptionKey ? true : false,
    data: parsePacket(receivedBytes, encryptionKey),
  };
  return btHomePacket;
}
